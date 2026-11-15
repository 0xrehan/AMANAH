from django.contrib import admin

from .models import Post


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("id", "author", "content_preview", "created_at")
    search_fields = ("author__username", "content")
    list_filter = ("created_at",)

    @admin.display(description="Content")
    def content_preview(self, obj):
        return obj.content[:80]
