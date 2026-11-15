from rest_framework import serializers
from .models import Post


class PostSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="author.username",
        read_only=True
    )
    display_name = serializers.CharField(
        source="author.profile.display_name",
        read_only=True
    )

    class Meta:
        model = Post
        fields = [
            "id",
            "username",
            "display_name",
            "content",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "username",
            "display_name",
            "created_at",
            "updated_at",
        ]
