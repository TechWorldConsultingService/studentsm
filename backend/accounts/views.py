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
from rest_framework_simplejwt.views import TokenRefreshView
from django.utils.decorators import method_decorator


@method_decorator(csrf_exempt, name='dispatch')
class LoginAPIView(APIView):
    def post(self, request):
        # Deserialize the request data using LoginSerializer
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            # Authenticate the user
            user = authenticate(request, username=username, password=password)
            if user is None:
                return Response({'error': 'Invalid credentialss'}, status=status.HTTP_401_UNAUTHORIZED)

            # Generate JWT tokens for the authenticated user
            refresh = RefreshToken.for_user(user)

            # Determine the role and retrieve the role-specific data
            role_data = {}
            if hasattr(user, 'teacher'):
                teacher = user.teacher
                role_data = {
                    'id': teacher.id,  # Ensure you send teacher's ID, not user ID
                    'role': 'teacher',
                    'phone': teacher.phone,
                    'address': teacher.address,
                    'date_of_joining': teacher.date_of_joining.strftime('%Y-%m-%d'),
                    'gender': teacher.gender,
                    'subjects': [{'id': subject.id,'subject_code': subject.subject_code, 'subject_name': subject.subject_name} for subject in teacher.subjects.all()],
                    'classes': [{'id': cls.id, 'class_code': cls.class_code, 'class_name': cls.class_name} for cls in teacher.classes.all()],
                    'class_teacher': {
                        'id': teacher.class_teacher.id if teacher.class_teacher else None,
                        'class_code': teacher.class_teacher.class_code,
                        'class_name': teacher.class_teacher.class_name
                    } if teacher.class_teacher else None,
                }
            elif hasattr(user, 'principal'):
                principal = user.principal
                role_data = {
                    'id': principal.id, 
                    'role': 'principal',
                    'phone': principal.phone,
                    'address': principal.address,
                    'gender': principal.gender,
                }
            elif hasattr(user, 'student'):
                student = user.student
                student_class = student.class_code

                # Prepare the subjects based on whether the class_code exists or not
                if student_class:
                    subjects = [{'subject_code': subject.subject_code, 'subject_name': subject.subject_name} for subject in student_class.subjects.all()]
                else:
                    subjects = []  # If no class_code exists, return an empty list for subjects

                role_data = {
                    'id': student.id, 
                    'role': 'student',
                    'phone': student.phone,
                    'address': student.address,
                    'date_of_birth': student.date_of_birth.strftime('%Y-%m-%d'),
                    'gender': student.gender,
                    'parents': student.parents,
                    'class': {
                        'id': student_class.id if student_class else None,
                        'class_code': student_class.class_code  if student_class else None,
                        'class_name': student_class.class_name if student_class else None,
                    } if student_class else None,
                    'subjects': subjects  # Add subjects related to the student's class
                }
            elif hasattr(user, 'accountant'):
                accountant = user.accountant
                role_data = {
                    'id': accountant.id, 
                    'role': 'accountant',
                    'phone': accountant.phone,
                    'address': accountant.address,
                    'gender': accountant.gender,
                    'date_of_joining': accountant.date_of_joining.strftime('%Y-%m-%d'),
                }
            
            else:
                return Response({'error': 'User has no role assigned'}, status=status.HTTP_403_FORBIDDEN)

            # Prepare the response data
            response_data = {
                # 'id': user.id,  # Add the user's ID
                'id': role_data.get('id'),  # Use the role-specific ID
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'role': 'master' if user.is_master else 'principal' if user.is_principal else 'teacher' if user.is_teacher else 'student' if user.is_student else 'staff' if user.is_staff else None,
                'username': username,
                **role_data,  # Include role-specific data
                'email': user.email,  # User's email (assuming it exists in your user model)
                'first_name': user.first_name,  # User's first name
                'last_name': user.last_name,
            }

            # Add role-specific data
            if hasattr(user, 'teacher'):
                teacher = user.teacher
                response_data.update({
                    'role': 'teacher',
                    'phone': teacher.phone,
                    'address': teacher.address,
                    'date_of_joining': teacher.date_of_joining.strftime('%Y-%m-%d'),
                    'gender': teacher.gender,
                    'subjects': [{'id': subject.id, 'subject_code': subject.subject_code, 'subject_name': subject.subject_name} for subject in teacher.subjects.all()],
                    'classes': [{'id': cls.id, 'class_code': cls.class_code, 'class_name': cls.class_name} for cls in teacher.classes.all()],
                    'class_teacher': {
                        'id': teacher.class_teacher.id if teacher.class_teacher else None,
                        'class_code': teacher.class_teacher.class_code if teacher.class_teacher else None,
                        'class_name': teacher.class_teacher.class_name if teacher.class_teacher else None,
                    } if teacher.class_teacher else None,
                })
            elif hasattr(user, 'principal'):
                principal = user.principal
                response_data.update({
                    'role': 'principal',
                    'phone': principal.phone,
                    'address': principal.address,
                    'gender': principal.gender,
                })
            elif hasattr(user, 'student'):
                student = user.student
                student_class = student.class_code
                # subjects = [{'subject_code': subject.subject_code, 'subject_name': subject.subject_name} for subject in student_class.subjects.all()]
            
                # Check if the student_class is None before accessing its attributes
                if student_class:
                    subjects = [{'id': subject.id,'subject_code': subject.subject_code, 'subject_name': subject.subject_name} for subject in student_class.subjects.all()]
                else:
                    subjects = []  # If no class_code exists, return an empty list for subjects

                response_data.update({
                    'role': 'student',
                    'phone': student.phone,
                    'address': student.address,
                    'date_of_birth': student.date_of_birth.strftime('%Y-%m-%d'),
                    'gender': student.gender,
                    'parents': student.parents,
                    'class': {
                        'id': student_class.id,
                        'class_code': student.class_code.class_code,
                        'class_name': student.class_code.class_name
                    } if student.class_code else None,
                    'subjects': subjects  # Add subjects related to the student's class
                })
            elif hasattr(user, 'accountant'):
                accountant = user.accountant
                response_data.update({
                    'role': 'accountant',
                    'phone': accountant.phone,
                    'address': accountant.address,
                    'gender': accountant.gender,
                    'date_of_joining': accountant.date_of_joining.strftime('%Y-%m-%d')
                })
            else:
                # Handle case where user has no specific role
                response_data.update({
                    'role': None,
                    'error': 'User has no role assigned',
                })
            # Log the user in
            # login(request, user)
            return Response(response_data, status=status.HTTP_200_OK)
        
        # If serializer is invalid
        print("\n=== INVALID DATA ===")
        print(serializer.errors)
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
