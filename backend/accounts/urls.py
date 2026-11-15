from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token

from .views import (
    RegisterView,
    MyProfileView,
    MemberListView,
    MemberDetailView,
    ConnectionListCreateView,
    ConnectionActionView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', obtain_auth_token, name='login'),
    path('me/', MyProfileView.as_view(), name='my-profile'),

    path('members/', MemberListView.as_view(), name='member-list'),

    path('connections/', ConnectionListCreateView.as_view(), name='connections'),

    path(
        'connections/<int:pk>/<str:action>/',
        ConnectionActionView.as_view(),
        name='connection-action',
    ),

    path(
        'members/<str:username>/',
        MemberDetailView.as_view(),
        name='member-detail',
    ),
]
