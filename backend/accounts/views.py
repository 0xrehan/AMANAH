from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db import models
from .serializers import RegisterSerializer, ProfileSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class MyProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile


from rest_framework import filters
from .models import Profile
from .serializers import MemberSerializer


class MemberListView(generics.ListAPIView):
    serializer_class = MemberSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "user__username",
        "display_name",
        "bio",
        "city",
        "country",
        "skills",
        "interests",
    ]

    def get_queryset(self):
        return (
            Profile.objects
            .filter(user__is_active=True)
            .exclude(user=self.request.user)
            .select_related("user")
            .order_by("user__username")
        )


class MemberDetailView(generics.RetrieveAPIView):
    serializer_class = MemberSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "user__username"
    lookup_url_kwarg = "username"

    def get_queryset(self):
        return (
            Profile.objects
            .filter(user__is_active=True)
            .exclude(user=self.request.user)
            .select_related("user")
        )

from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Connection
from .serializers import ConnectionSerializer


class ConnectionListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        connections = (
            Connection.objects
            .filter(
                models.Q(sender=request.user)
                | models.Q(receiver=request.user)
            )
            .select_related("sender", "receiver")
        )

        serializer = ConnectionSerializer(connections, many=True)
        return Response(serializer.data)

    def post(self, request):
        username = request.data.get("username", "").strip()

        if not username:
            return Response(
                {"error": "Username is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        receiver = get_object_or_404(
            User,
            username__iexact=username,
            is_active=True,
        )

        if receiver == request.user:
            return Response(
                {"error": "You cannot send a request to yourself."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        existing = Connection.objects.filter(
            sender=request.user,
            receiver=receiver,
        ).first()

        reverse = Connection.objects.filter(
            sender=receiver,
            receiver=request.user,
        ).first()

        if reverse and reverse.status == Connection.Status.ACCEPTED:
            return Response(
                {"error": "You are already connected."},
                status=status.HTTP_409_CONFLICT,
            )

        if reverse and reverse.status == Connection.Status.PENDING:
            return Response(
                {"error": "This member has already sent you a request."},
                status=status.HTTP_409_CONFLICT,
            )

        if existing:
            if existing.status == Connection.Status.PENDING:
                return Response(
                    {"error": "Request already sent."},
                    status=status.HTTP_409_CONFLICT,
                )

            if existing.status == Connection.Status.ACCEPTED:
                return Response(
                    {"error": "You are already connected."},
                    status=status.HTTP_409_CONFLICT,
                )

            existing.status = Connection.Status.PENDING
            existing.save(update_fields=["status", "updated_at"])
            serializer = ConnectionSerializer(existing)
            return Response(serializer.data, status=status.HTTP_200_OK)

        connection = Connection.objects.create(
            sender=request.user,
            receiver=receiver,
        )

        return Response(
            ConnectionSerializer(connection).data,
            status=status.HTTP_201_CREATED,
        )


class ConnectionActionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk, action):
        connection = get_object_or_404(
            Connection.objects.select_related("sender", "receiver"),
            pk=pk,
        )

        if connection.status != Connection.Status.PENDING:
            return Response(
                {"error": "This request is no longer pending."},
                status=status.HTTP_409_CONFLICT,
            )

        if action in ["accept", "reject"]:
            if connection.receiver != request.user:
                return Response(
                    {"error": "Only the recipient can perform this action."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            if action == "accept":
                connection.status = Connection.Status.ACCEPTED
            else:
                connection.status = Connection.Status.REJECTED

            connection.save(update_fields=["status", "updated_at"])

            return Response(ConnectionSerializer(connection).data)

        if action == "cancel":
            if connection.sender != request.user:
                return Response(
                    {"error": "Only the sender can cancel this request."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            connection.delete()

            return Response(
                {"message": "Connection request cancelled."},
                status=status.HTTP_200_OK,
            )

        return Response(
            {"error": "Invalid action."},
            status=status.HTTP_400_BAD_REQUEST,
        )
