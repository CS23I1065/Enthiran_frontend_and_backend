from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, FamilyMember

class CustomUserAdmin(UserAdmin):
    list_display = ("email", "first_name", "last_name", "is_active", "is_staff")
    search_fields = ("email", "first_name", "last_name")
    ordering = ("email",)
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("first_name", "last_name", "phone_number", "date_of_birth", "gender")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Important Dates", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "first_name", "last_name", "password1", "password2", "is_active", "is_staff"),
        }),
    )

class FamilyMemberAdmin(admin.ModelAdmin):
    list_display = ("user", "name", "relationship", "date_of_birth")
    search_fields = ("name", "relationship")

# Register models
admin.site.register(User, CustomUserAdmin)
admin.site.register(FamilyMember, FamilyMemberAdmin)
