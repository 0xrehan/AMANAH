from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import Profile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password]
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
        ]
        extra_kwargs = {
            "email": {"required": True},
        }

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    class Meta:
        model = Profile
        fields = [
            "username",
            "display_name",
            "bio",
            "city",
            "country",
            "skills",
            "interests",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class MemberSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    display_name = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            "username",
            "display_name",
            "bio",
            "city",
            "country",
            "skills",
            "interests",
        ]

    def get_display_name(self, obj):
        return obj.display_name or obj.user.username


from .models import Connection


class ConnectionSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(
        source="sender.username",
        read_only=True,
    )

    receiver_username = serializers.CharField(
        source="receiver.username",
        read_only=True,
    )

    class Meta:
        model = Connection
        fields = [
            "id",
            "sender_username",
            "receiver_username",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields
