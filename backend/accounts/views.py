# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from .models import *
from .serializers import LoginSerializer, LogoutSerializer, RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils.decorators import method_decorator

# View for handling user login
@method_decorator(csrf_exempt, name='dispatch')
class LoginAPIView(APIView):
    def post(self, request):
        # Deserialize the request data using LoginSerializer
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            # Extract username and password from validated data
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            # Authenticate the user
            user = authenticate(request, username=username, password=password)

            # If authentication fails, return an error response
            if user is None:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

            # Generate JWT tokens for the authenticated user
            refresh = RefreshToken.for_user(user)

            # Prepare the response data
            response_data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'role': 'master' if user.is_master else 'principal' if user.is_principal else 'teacher' if user.is_teacher else 'student' if user.is_student else 'staff' if user.is_staff else None,
                'username': username,
                'password': password  # Note: Including the password in the response is not recommended
            }

            # If user has no role assigned, return an error response
            if response_data['role'] is None:
                return Response({'error': 'User has no role assigned'}, status=status.HTTP_403_FORBIDDEN)

            # Log the user in
            login(request, user)
            return Response(response_data, status=status.HTTP_200_OK)

        # If serializer is invalid, return validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
       

# View for handling user logout
class LogoutAPIView(APIView):
    permission_classes = (IsAuthenticated,)  # Ensure the user is authenticated

    def post(self, request):
        # Deserialize the request data using LogoutSerializer
        serializer = LogoutSerializer(data=request.data)
        if serializer.is_valid():
            refresh_token = serializer.validated_data['refresh']
            try:
                # Blacklist the refresh token
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

            # Log the user out
            logout(request)
            return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
        
        # If serializer is invalid, return validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View for handling user registration
@method_decorator(csrf_exempt, name='dispatch')
class RegisterAPIView(APIView):
    def post(self, request):
        # Deserialize the request data using RegisterSerializer
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            # Save the new user
            serializer.save()
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        
        # If serializer is invalid, return validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
