from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "phone_number", "profile_picture"]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email", "password", "phone_number"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user =  User.objects.create_user(**validated_data)
        return user

from django.contrib.auth import authenticate
import logging

logger = logging.getLogger(__name__)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        logger.debug(f"Trying to authenticate user with email: {email}")

        # Use authenticate with email directly
        user = authenticate(email=email, password=password)

        if not user:
            logger.debug("Authentication failed: User not found or wrong password.")
            raise serializers.ValidationError("Invalid credentials")

        if not user.is_active:
            logger.debug("Authentication failed: User account is not active.")
            raise serializers.ValidationError("User account is disabled")

        logger.debug(f"Authentication successful for user: {user.email}")
        
        refresh = RefreshToken.for_user(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "email": user.email
            },
        }


