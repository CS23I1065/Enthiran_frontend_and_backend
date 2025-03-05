from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import logging
from .scraper import scrape_schemes  # Assuming you'll move the scraping logic to a separate file
from rest_framework import generics, permissions

logger = logging.getLogger(__name__)

@csrf_exempt
def search_schemes(request):
    if request.method == 'POST':
        try:
            # Parse the JSON data from the request body
            data = json.loads(request.body)
            user_query = data.get('query', '')

            if not user_query:
                return JsonResponse({'error': 'Query parameter is required'}, status=400)

            # Call the scrape_schemes function
            relevant_schemes = scrape_schemes(user_query)

            # Prepare the response
            response_data = {
                'status': 'success',
                'query': user_query,
                'results': relevant_schemes
            }

            return JsonResponse(response_data)

        except Exception as e:
            logger.error(f"An error occurred: {e}")
            return JsonResponse({'error': str(e)}, status=500)

    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
    

from rest_framework.response import Response
from rest_framework import status, generics
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(generics.GenericAPIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
