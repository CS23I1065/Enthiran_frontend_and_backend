from django.db import models
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import AbstractUser


class Scheme(models.Model):
    name = models.CharField(max_length=255)
    eligibility = models.TextField()
    documents = models.TextField()
    offline_support = models.BooleanField(default=False)
    website = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name

# Custom user manager to handle email-based login
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)
    

# Custom user model
from django.contrib.auth.models import AbstractUser, BaseUserManager, Group, Permission
from django.db import models

class User(AbstractUser):
    username = None  # Remove username field
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    profile_picture = models.ImageField(upload_to="profile_pictures/", blank=True, null=True)
    
    # Fix conflicts by adding related_name
    groups = models.ManyToManyField(Group, related_name="custom_user_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="custom_user_permissions", blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []  # Only email & password are required

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    

# Family Member Model
RELATIONSHIP_CHOICES = [
    ("spouse", "Spouse"),
    ("child", "Child"),
    ("parent", "Parent"),
    ("sibling", "Sibling"),
    ("other", "Other"),
]


class FamilyMember(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="family_members")
    name = models.CharField(max_length=255)
    relationship = models.CharField(max_length=20, choices=RELATIONSHIP_CHOICES)
    date_of_birth = models.DateField()
    gender = models.CharField(choices=[("male", "Male"), ("female", "Female"), ("other", "Other")], max_length=10)
    document = models.FileField(upload_to="family_documents/", blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.relationship})"