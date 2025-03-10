from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,permissions,generics
from django.contrib.auth.models import User
from .models import *
from .serializers import * 
from rest_framework.permissions import IsAuthenticated
from .permissions import *
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
import json
from django.db import transaction
from django.utils.dateparse import parse_date
from rest_framework.exceptions import NotFound
from rest_framework.generics import *
from rest_framework import status
from django.db.models import Count
from collections import defaultdict
from django.db.models import Count, Q
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from django.utils.decorators import method_decorator
import nepali_datetime as ndt
from .serializers import FinanceSummarySerializer

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



class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            # Only principals and teachers can create posts
            return [permissions.IsAuthenticated(), IsPrincipalOrTeacher()]
        # Any authenticated user can view posts
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        user = self.request.user
        # Only principals and teachers are allowed to create posts
        if hasattr(user, 'principal') or hasattr(user, 'teacher'):
            serializer.save(creator=user)
        else:
            raise PermissionDenied("You do not have permission to create posts.")
        


class DateSettingView(APIView):
    """
    API to get and update the global date setting.
    """

    def get(self, request):
        """Fetch the current date setting (AD or BS)."""
        setting = DateSetting.get_instance()
        return Response({"is_ad": setting.is_ad}, status=status.HTTP_200_OK)

    def post(self, request):
        """Update the date setting (AD or BS)."""
        setting = DateSetting.get_instance()
        is_ad = request.data.get("is_ad")  # Boolean value expected

        if is_ad is not None:
            setting.is_ad = is_ad
            setting.save()
            return Response({"message": "Date setting updated", "is_ad": setting.is_ad}, status=status.HTTP_200_OK)
        
        return Response({"error": "Missing 'is_ad' parameter"}, status=status.HTTP_400_BAD_REQUEST)

        
# View for handling teacher registration
# @csrf_exempt
class RegisterTeacherView(APIView):
    def post(self, request, format=None):
        # Determine if the request data is in JSON format or form-data
        if request.content_type == 'application/json':
            # Handle JSON data
            user_data = request.data.get('user')
            if not user_data:
                # Return an error if user data is missing
                return Response({"error": "User data not provided"}, status=status.HTTP_400_BAD_REQUEST)
            
            subjects_data = request.data.get('subjects', [])
            classes_data = request.data.get('classes', [])
            class_teacher_data = request.data.get('class_teacher')
            teacher_data = request.data
        else:
            # Handle form-data
            user_data = {
                'username': request.data.get('user.username'),
                'password': request.data.get('user.password'),
                'email': request.data.get('user.email'),
                'first_name': request.data.get('user.first_name'),
                'last_name': request.data.get('user.last_name'),
            }
            subjects_data = request.data.getlist('subjects')  # Expecting a list of subject IDs
            classes_data = request.data.getlist('classes')  # Expecting a list of class IDs
            class_teacher_data = request.data.get('class_teacher')

            teacher_data = {
                'phone': request.data.get('phone'),
                'address': request.data.get('address'),
                'date_of_joining': request.data.get('date_of_joining'),
                'gender': request.data.get('gender'),
                'user': user_data,
                'subjects': request.data.get('subjects'),
                'classes': request.data.get('classes') ,
                'class_teacher': request.data.get('class_teacher')
            }
        
        # Serialize teacher data and validate
        teacher_serializer = TeacherSerializer(data=teacher_data)
        
        if teacher_serializer.is_valid():
            # Save the teacher instance and return success response
            teacher = teacher_serializer.save()
            teacher.user.is_teacher = True
            teacher.user.save()  # Ensure the is_teacher flag is saved

            return Response(teacher_serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Return error response if validation fails
            return Response(teacher_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View for handling principal registration
class RegisterPrincipalView(APIView):
    def post(self, request, format=None):
        # Determine if the request data is in JSON format or form-data
        if request.content_type == 'application/json':
            # Handle JSON data
            user_data = request.data.get('user')
            if not user_data:
                # Return an error if user data is missing
                return Response({"error": "User data not provided"}, status=status.HTTP_400_BAD_REQUEST)
            
            principal_data = request.data
        else:
            # Handle form-data
            user_data = {
                'username': request.data.get('user.username'),
                'password': request.data.get('user.password'),
                'email': request.data.get('user.email'),
                'first_name': request.data.get('user.first_name'),
                'last_name': request.data.get('user.last_name'),
            }
            
            principal_data = {
                'phone': request.data.get('phone'),
                'address': request.data.get('address'),
                'gender': request.data.get('gender'),
                'user': user_data,
            }
        
        # Serialize principal data and validate
        principal_serializer = PrincipalSerializer(data=principal_data)
        
        if principal_serializer.is_valid():
            # Save the principal instance and return success response
            principal = principal_serializer.save()
            principal.user.is_principal = True
            principal.user.save()

            return Response(principal_serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Return error response if validation fails
            return Response(principal_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View for handling student registration
class RegisterStudentView(APIView):
    def post(self, request, format=None):
        if request.content_type == 'application/json':
            user_data = request.data.get('user')
            if not user_data:
                return Response({"error": "User data not provided"}, status=status.HTTP_400_BAD_REQUEST)
            
            student_data = request.data
        else:
            user_data = {
                'username': request.data.get('user.username'),
                'password': request.data.get('user.password'),
                'email': request.data.get('user.email'),
                'first_name': request.data.get('user.first_name'),
                'last_name': request.data.get('user.last_name'),
            }
            
            student_data = {
                'phone': request.data.get('phone'),
                'address': request.data.get('address'),
                'date_of_birth': request.data.get('date_of_birth'),
                'parents': request.data.get('parents'),
                'gender': request.data.get('gender'),
                'class_code': request.data.get('class_code'),
                'class_code_section': request.data.get('class_code_section', None),  # Section is optional
                'user': user_data,
            }

        student_serializer = StudentSerializer(data=student_data)

        if student_serializer.is_valid():
            student = student_serializer.save()
            student.user.is_student = True
            student.user.save()
            
            return Response(student_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(student_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# View for handling staff registration
class RegisterAccountantView(APIView):
    def post(self, request, format=None):
        # Determine if the request data is in JSON format or form-data
        if request.content_type == 'application/json':
            # Handle JSON data
            user_data = request.data.get('user')
            if not user_data:
                # Return an error if user data is missing
                return Response({"error": "User data not provided"}, status=status.HTTP_400_BAD_REQUEST)

            accountant_data = request.data
        else:
            # Handle form-data
            user_data = {
                'username': request.data.get('user.username'),
                'password': request.data.get('user.password'),
                'email': request.data.get('user.email'),
                'first_name': request.data.get('user.first_name'),
                'last_name': request.data.get('user.last_name'),
            }

            accountant_data = {
                'phone': request.data.get('phone'),
                'address': request.data.get('address'),
                'date_of_joining': request.data.get('date_of_joining'),
                'gender': request.data.get('gender'),
                'user': user_data,
            }

        # Serialize staff data and validate
        accountant_serializer = AccountantSerializer(data=accountant_data)

        if accountant_serializer.is_valid():
            # Save the staff instance and return success response
            accountant = accountant_serializer.save()
            accountant.user.is_accountant = True
            accountant.user.save()

            return Response(accountant_serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Return error response if validation fails
            return Response(accountant_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API view to list all teachers
class TeacherListView(APIView):
    def get(self, request, format=None):
        teachers = Teacher.objects.all()  # Retrieve all teacher instances
        serializer = GetTeacherSerializer(teachers, many=True)  # Serialize the teacher data
        return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data with 200 OK status

# API view to list all principals
class PrincipalListView(APIView):
    def get(self, request, format=None):
        principals = Principal.objects.all()  # Retrieve all principal instances
        serializer = PrincipalSerializer(principals, many=True)  # Serialize the principal data
        return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data with 200 OK status

# API view to list all students
class StudentListView(APIView):
    def get(self, request, format=None):
        students = Student.objects.all()  # Retrieve all student instances
        serializer = GetStudentSerializer(students, many=True)  # Serialize the student data
        return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data with 200 OK status

# List all staff members
class AccountantListView(APIView):
    """
    Handle GET requests to list all accountant members.
    """
    def get(self, request, format=None):
        accountant = Accountant.objects.all()  # Retrieve all accountant records
        serializer = AccountantSerializer(accountant, many=True)  # Serialize the data for multiple accountant records
        return Response(serializer.data, status=status.HTTP_200_OK)

# API view to see specific teacher
class TeacherDetailView(APIView):
    def get(self, request, pk, format=None):
        """
        Handle GET requests to retrieve the details of a specific Teacher by primary key.
        """
        try:
            # Retrieve the Teacher instance by primary key
            teacher = Teacher.objects.get(pk=pk)
            # Serialize the Teacher instance
            serializer = GetTeacherSerializer(teacher)
            # Return serialized data with 200 OK status
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Teacher.DoesNotExist:
            # Return error message with 404 Not Found status if Teacher does not exist
            return Response({"error": "Teacher not found"}, status=status.HTTP_404_NOT_FOUND)

# API view to see specific teacher
class PrincipalDetailView(APIView):
    def get(self, request, pk, format=None):
        """
        Handle GET requests to retrieve the details of a specific Principal by primary key.
        """
        try:
            # Retrieve the Principal instance by primary key
            principal = Principal.objects.get(pk=pk)
            # Serialize the Principal instance
            serializer = PrincipalSerializer(principal)
            # Return serialized data with 200 OK status
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Principal.DoesNotExist:
            # Return error message with 404 Not Found status if Principal does not exist
            return Response({"error": "Principal not found"}, status=status.HTTP_404_NOT_FOUND)

# API view to see specific student
class StudentDetailView(APIView):
    def get(self, request, pk, format=None):
        """
        Handle GET requests to retrieve the details of a specific Student by primary key.
        """
        try:
            # Retrieve the Student instance by primary key
            student = Student.objects.get(pk=pk)
            # Serialize the Student instance
            serializer = GetStudentSerializer(student)
            # Return serialized data with 200 OK status
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Student.DoesNotExist:
            # Return error message with 404 Not Found status if Student does not exist
            return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)
        
# Retrieve specific Accountant member details
class AccountantDetailView(APIView):
    """
    Handle GET requests to retrieve details of a specific accountant member by primary key.
    """
    def get(self, request, pk, format=None):
        try:
            accountant = Accountant.objects.get(pk=pk)  # Retrieve Accountant record by primary key
            serializer = AccountantSerializer(accountant)  # Serialize the Accountant data
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Accountant.DoesNotExist:
            # Return an error response if staff member is not found
            return Response({"error": "accountant not found"}, status=status.HTTP_404_NOT_FOUND)

# API view to delete specific teacher
class TeacherDeleteView(APIView):
    def delete(self, request, pk, format=None):
        """
        Handle DELETE requests to remove a specific Teacher by primary key.
        """
        try:
            teacher = Teacher.objects.get(pk=pk)
            teacher.delete()
            return Response({"message": "Teacher deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Teacher.DoesNotExist:
            return Response({"error": "Teacher not found"}, status=status.HTTP_404_NOT_FOUND)

# API view to delete specific principal
class PrincipalDeleteView(APIView):
    def delete(self, request, pk, format=None):
        """
        Handle DELETE requests to remove a specific Principal by primary key.
        """
        try:
            # Retrieve the Principal instance by primary key
            principal = Principal.objects.get(pk=pk)
            # Delete the Principal instance
            principal.delete()
            # Return success message with 204 No Content status
            return Response({"message": "Principal deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Principal.DoesNotExist:
            # Return error message with 404 Not Found status if Principal does not exist
            return Response({"error": "Principal not found"}, status=status.HTTP_404_NOT_FOUND)

# API view to delete specific student
class StudentDeleteView(APIView):
    def delete(self, request, pk, format=None):
        """
        Handle DELETE requests to remove a specific Student by primary key.
        """
        try:
            # Retrieve the Student instance by primary key
            student = Student.objects.get(pk=pk)
            # Delete the Student instance
            student.delete()
            # Return success message with 204 No Content status
            return Response({"message": "Student deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Student.DoesNotExist:
            # Return error message with 404 Not Found status if Student does not exist
            return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)
        
# Delete a specific staff member
class AccountantDeleteView(APIView):
    """
    Handle DELETE requests to delete a specific Accountant member by primary key.
    """
    def delete(self, request, pk, format=None):
        try:
            accountant = Accountant.objects.get(pk=pk)  # Retrieve accountant record by primary key
            accountant.delete()  # Delete the accountant record
            return Response({"message": "Accountant deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Accountant.DoesNotExist:
            # Return an error response if accountant member is not found
            return Response({"error": "Accountant not found"}, status=status.HTTP_404_NOT_FOUND)
        
# API view to update teacher info
class TeacherUpdateAPIView(APIView):
    def put(self, request, pk):
        try:
            # Try to retrieve the teacher object by primary key (pk)
            teacher = Teacher.objects.get(pk=pk)
        except Teacher.DoesNotExist:
            # Return an error response if the teacher does not exist
            return Response({"error": "Teacher not found."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the incoming data, allowing partial updates (some fields can be omitted)
        serializer = TeacherSerializer(teacher, data=request.data, partial=True)
        if serializer.is_valid():
            # If the data is valid, save the updated teacher instance
            teacher = serializer.save()
            # Return the updated teacher's data in the response
            return Response(TeacherSerializer(teacher).data)
        # If validation fails, return the errors in the response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API view to update principal info
class PrincipalUpdateAPIView(APIView):
    def put(self, request, pk):
        try:
            # Try to retrieve the principal object by primary key (pk)
            principal = Principal.objects.get(pk=pk)
        except Principal.DoesNotExist:
            # Return an error response if the principal does not exist
            return Response({"error": "Principal not found."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the incoming data, allowing partial updates
        serializer = PrincipalSerializer(principal, data=request.data, partial=True)
        if serializer.is_valid():
            # If the data is valid, save the updated principal instance
            principal = serializer.save()
            # Return the updated principal's data in the response
            return Response(PrincipalSerializer(principal).data)
        # If validation fails, return the errors in the response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# api to get student as per class
class StudentListByClassAPIView(APIView):
    def get(self, request, class_code):
        """
        API to fetch students based on class_code.
        Example Request: GET /api/students/class/1/
        """
        students = Student.objects.filter(class_code_id=class_code)
        
        if not students.exists():
            return Response({"detail": "No students found for this class."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = GetStudentSerializer(students, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

# API view to update student info
class StudentUpdateAPIView(APIView):
    def put(self, request, pk):
        try:
            # Try to retrieve the student object by primary key (pk)
            student = Student.objects.get(pk=pk)
        except Student.DoesNotExist:
            # Return an error response if the student does not exist
            return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the incoming data, allowing partial updates
        serializer = StudentSerializer(student, data=request.data, partial=True)
        if serializer.is_valid():
            # If the data is valid, save the updated student instance
            student = serializer.save()
            # Return the updated student's data in the response
            return Response(StudentSerializer(student).data)
        # If validation fails, return the errors in the response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API view to update accountant info
class AccountantUpdateAPIView(APIView):
    def put(self, request, pk):
        try:
            # Try to retrieve the accountant object by primary key (pk)
            accountant = Accountant.objects.get(pk=pk)
        except Accountant.DoesNotExist:
            # Return an error response if the accountant does not exist
            return Response({"error": "accountant not found."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the incoming data, allowing partial updates
        serializer = AccountantSerializer(accountant, data=request.data, partial=True)
        if serializer.is_valid():
            # If the data is valid, save the updated Accountant instance
            accountant = serializer.save()
            # Return the updated Accountant's data in the response
            return Response(AccountantSerializer(accountant).data)
        # If validation fails, return the errors in the response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.decorators import api_view, permission_classes
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_role(request):
    user = request.user
    role = (
        "master" if user.is_master else
        "principal" if user.is_principal else
        "teacher" if user.is_teacher else
        "student" if user.is_student else
        "staff" if user.is_staff else
        "unknown"
    )
    return JsonResponse({"role": role})
        
class TotalLeaveApplicationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # Determine user role
        role = self.get_user_role(user)
        # Default assignment of leave_applications to an empty queryset
        leave_applications = LeaveApplication.objects.none()
        if role == 'Principal':
            # Principals can view all leave applications
            leave_applications = LeaveApplication.objects.all()
        elif role == 'Teacher':
            # Teachers can view leave applications from their class
            teacher = getattr(user, 'teacher', None)
            if not teacher or not teacher.class_teacher:
                return Response(
                    {"error": "Teacher does not have a class assigned."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Filter leave applications for students in the teacher's class
            leave_applications = LeaveApplication.objects.filter(
                applicant_type="Student", 
                applicant__in=Student.objects.filter(class_code=teacher.class_teacher).values_list('user', flat=True)
                # applicant__student__classes=teacher.class_teacher
            )
           
        elif role == 'Student':
            try:
                student = Student.objects.get(user=user)
            except Student.DoesNotExist:
                return Response(
                    {"error": "No student profile associated with the current user."},
                    status=status.HTTP_404_NOT_FOUND
                )
            leave_applications = LeaveApplication.objects.filter(applicant=student.user)
        else:
            raise PermissionDenied("You do not have permission to view leave applications.")

        # Serialize and return the data
        serializer = LeaveApplicationSerializer(leave_applications, many=True)
        return Response(serializer.data)

    @staticmethod
    def get_user_role(user):
        """
        Determine the role of the user.
        """
        if getattr(user, 'is_principal', False):
            return 'Principal'
        if hasattr(user, 'teacher'):
            return 'Teacher'
        if getattr(user, 'is_student', False):
            return 'Student'
        return 'Unknown'

# API view to list all leave applications for the current user
class LeaveApplicationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        """
        Handle GET requests to retrieve all leave applications for the current user,
        whether they are a student or a teacher.
        """
        user = request.user
        applications = LeaveApplication.objects.filter(applicant=user)

        serializer = LeaveApplicationSerializer(applications, many=True)
        return Response(serializer.data)

# API view to create a new leave application
class LeaveApplicationCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        """
        Handle POST requests to create a new leave application.
        """
        
        leave_date = request.data.get('leave_date')
        message = request.data.get('message')
        applicant_name = request.user.first_name

        if not leave_date or not message:
            # Return error message if 'leave_date' or 'message' is not provided
            return Response({"error": "Both 'leave_date' and 'message' are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Determine applicant_type based on user role
        if request.user.is_student:
            applicant_type = 'Student'
        elif request.user.is_teacher:
            applicant_type = 'Teacher'
        else:
            # Return error message if user is neither student nor teacher
            return Response({"error": "User must be a student or teacher"}, status=status.HTTP_400_BAD_REQUEST)

        # Prepare data for serializer
        data = {
            'leave_date': leave_date,
            'message': message,
            'applicant': request.user.id,
            'applied_on': timezone.now().date(),
            'applicant_type': applicant_type,
            'applicant_name': applicant_name
        }

        # Create a new leave application for the current user
        serializer = LeaveApplicationSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            # Save the leave application
            leave_application = serializer.save()  # Save the leave application to get the instance with an ID
            
            # Prepare the response data, including the ID of the created leave application
            response_data = {
                'id': leave_application.id,  # Now you can access the ID of the saved leave application
                'leave_date': leave_application.leave_date,
                'message': leave_application.message,
                'applicant': leave_application.applicant.id,
                'applied_on': leave_application.applied_on,
                'applicant_type': leave_application.applicant_type,
                'applicant_name': leave_application.applicant_name
            }

            # Return the response with the leave application's details, including the ID
            return Response(response_data, status=status.HTTP_201_CREATED)
        
        # Return validation errors if the serializer is not valid
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# API view to retrieve, update, or delete a specific leave application
class LeaveApplicationDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk, format=None):
        """
        Handle GET requests to retrieve a specific leave application by primary key.
        """
        try:
            # Get a specific leave application by ID
            application = LeaveApplication.objects.get(pk=pk)
        except LeaveApplication.DoesNotExist:
            # Return error message if leave application does not exist
            return Response({"error": "Leave application not found"}, status=status.HTTP_404_NOT_FOUND)
        # Serialize the leave application
        serializer = LeaveApplicationSerializer(application)
        # Return the serialized data
        return Response(serializer.data)
    
    def put(self, request, pk, format=None):
        """
        Handle PUT requests to update a specific leave application by primary key.
        """
        try:
            application = LeaveApplication.objects.get(pk=pk)
        except LeaveApplication.DoesNotExist:
            return Response({"error": "Leave application not found"}, status=status.HTTP_404_NOT_FOUND)

        # Ensure the logged-in user is the applicant
        if application.applicant != request.user:
            return Response({"error": "You do not have permission to edit this application"}, status=status.HTTP_403_FORBIDDEN)

        # Only allow updating specific fields
        data = request.data
        update_data = {}

        if 'leave_date' in data:
            update_data['leave_date'] = data['leave_date']

        if 'message' in data:
            update_data['message'] = data['message']

        # Serialize and validate the update data
        serializer = LeaveApplicationSerializer(application, data=update_data, partial=True)

        if serializer.is_valid():
            updated_application = serializer.save()
            return Response(
                {
                    "id": updated_application.id,
                    "leave_date": updated_application.leave_date,
                    "message": updated_application.message,
                    "status": updated_application.status,
                    "applied_on": updated_application.applied_on,
                    "updated_at": updated_application.updated_at,
                },
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk, format=None):
        """
        Handle DELETE requests to remove a specific leave application by primary key.
        """
        try:
            # Retrieve the LeaveApplication instance by primary key
            application = LeaveApplication.objects.get(pk=pk)
        except LeaveApplication.DoesNotExist:
            # Return error message with 404 Not Found status if leave application does not exist
            return Response({"error": "Leave application not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Delete the LeaveApplication instance
        application.delete()
        # Return success message with 204 No Content status
        return Response({"message": "Leave application successfully deleted"}, status=status.HTTP_204_NO_CONTENT)

# API view to update the status of a leave application
class LeaveApplicationStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    def patch(self, request, pk, format=None):
        """
        Handle PATCH requests to update the status of a leave application.
        """
        try:
            # Retrieve the LeaveApplication instance by primary key
            application = LeaveApplication.objects.get(pk=pk)
        except LeaveApplication.DoesNotExist:
            # Return error message if leave application does not exist
            return Response({"error": "Leave application not found"}, status=status.HTTP_404_NOT_FOUND)

        # Ensure the logged-in user is authorized to update the status
        if request.user.is_principal:
            # Principals can update both student and teacher leave applications
            pass
        elif request.user.is_teacher:
            # Teachers can only update student leave applications
            if application.applicant != request.user and not application.applicant.is_student:
                return Response({"error": "Teachers can only update student leave applications."}, status=status.HTTP_403_FORBIDDEN)
        else:
            # Non-principal and non-teacher users cannot update the status
            return Response({"error": "You do not have permission to update this application"}, status=status.HTTP_403_FORBIDDEN)

        # Check if 'status' is provided in the request data
        new_status = request.data.get('status')
        if not new_status:
            return Response({"error": "'status' field is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate the new status
        if new_status not in ['Pending', 'Approved', 'Disapproved']:
            return Response({"error": "Invalid status. Must be 'Pending', 'Approved', or 'Disapproved'."}, status=status.HTTP_400_BAD_REQUEST)

        # Update the status and save
        application.status = new_status
        application.save()

        # Serialize the updated instance and return it
        serializer = LeaveApplicationSerializer(application)
        return Response(serializer.data, status=status.HTTP_200_OK)

# API view to list all subjects or create a new subject
class SubjectListCreateView(APIView):
    def get(self, request):
        """Retrieve a list of all subjects."""
        subjects = Subject.objects.all()
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Create a new subject."""
        serializer = SubjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API view to retrieve, update, or delete a specific subject
class SubjectDetailView(APIView):
    def get_object(self, pk):
        """Retrieve subject instance or return 404."""
        return get_object_or_404(Subject, pk=pk)

    def get(self, request, pk):
        """Retrieve a specific subject by primary key."""
        subject = self.get_object(pk)
        serializer = SubjectSerializer(subject)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        """Update a specific subject (full update)."""
        subject = self.get_object(pk)
        serializer = SubjectSerializer(subject, data=request.data, partial=True)  # ✅ Partial update
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Delete a specific subject."""
        subject = self.get_object(pk)
        subject.delete()
        return Response({"message": "Subject successfully deleted"}, status=status.HTTP_204_NO_CONTENT)
    
class CompulsorySubjectsAPIView(APIView):
    """API to list all compulsory subjects (is_optional=False)"""
    
    def get(self, request):
        subjects = Subject.objects.filter(is_optional=False)
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data)

class OptionalSubjectsAPIView(APIView):
    """API to list all optional subjects (is_optional=True)"""
    
    def get(self, request):
        subjects = Subject.objects.filter(is_optional=True)
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data)

# API view to list all classes or create a new class
class ClassListCreateView(APIView):
    
    def get(self, request, *args, **kwargs):
        # Fetch all classes, prefetched related sections (excluding subjects)
        classes = Class.objects.prefetch_related("sections")  # Only prefetch sections, no subjects
        serializer = ClassDetailSerializer(classes, many=True)
        return Response({"status": "success", "classes": serializer.data})

    def post(self, request, format=None):
        """
        Handle POST requests to create a new Class instance.
        """
        serializer = ClassSerializer(data=request.data)  # Deserialize Class data
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Return serialized data with 201 Created status
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Return validation errors with 400 Bad Request status

# API view to retrieve, update, or delete a specific class
class ClassDetailView(APIView):
    def get(self, request, pk, format=None):
    # def get(self, request, class_code, format=None):
        """
        Handle GET requests to retrieve the details of a specific Class by primary key.
        """
        class_instance = get_object_or_404(Class, pk=pk)  # Retrieve the Class instance by class_code
        # class_instance = get_object_or_404(Class, class_code=class_code)  # Retrieve the Class instance by class_code
        serializer = ClassSerializer(class_instance)  # Serialize the Class instance
        return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data with 200 OK status

    # def put(self, request, pk, format=None):
    def put(self, request, pk, format=None):
        class_instance = get_object_or_404(Class, pk=pk)  # Retrieve the Class instance by primary key
        serializer = ClassSerializer(class_instance, data=request.data)  # Deserialize and validate data for updating
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data with 200 OK status
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Return validation errors with 400 Bad Request status

    # def delete(self, request, pk, format=None):
    def delete(self, request, pk, format=None):
        class_instance = get_object_or_404(Class, pk=pk)  # Retrieve the Class instance by primary key
        class_instance.delete()  # Delete the Class instance
        return Response({"message": "Class successfully deleted"}, status=status.HTTP_204_NO_CONTENT)  # Return success message with 204 No Content status

class SectionListCreateAPIView(APIView):
    def get(self, request, class_id, format=None):
        """
        Retrieve all sections for a specific class.
        """
        sections = Section.objects.filter(school_class_id=class_id)
        serializer = SectionSerializer(sections, many=True)
        return Response({"status": "success", "sections": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request, class_id, format=None):
        """
        Create a section and automatically assign it to the class from the URL.
        """
        serializer = SectionSerializer(data=request.data, context={'class_id': class_id})  # Pass class_id in context
        if serializer.is_valid():
            serializer.save()  # school_class is set automatically in the serializer
            return Response({"message": "Section created successfully"}, status=status.HTTP_201_CREATED)
        
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class SectionDetailAPIView(APIView):
    """
    Handles retrieving, updating, and deleting a section.
    """
    def get(self, request, pk):
        section = get_object_or_404(Section, pk=pk)
        serializer = SectionSerializer(section)
        return Response({"status": "success", "section": serializer.data}, status=status.HTTP_200_OK)

    def put(self, request, pk):
        section = get_object_or_404(Section, pk=pk)
        serializer = SectionSerializer(section, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Section updated successfully"}, status=status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        section = get_object_or_404(Section, pk=pk)
        section.delete()
        return Response({"message": "Section deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

class EventListView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users can view and create events

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)  # Save the user who created the event

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

from rest_framework.permissions import AllowAny
class TeacherAssignmentsView(APIView):
    """
    View for teachers to fetch assignments they created.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        # Ensure the user is a teacher
        try:
            teacher = request.user.teacher  # Assuming a OneToOneField relationship exists between Teacher and AUTH_USER_MODEL
        except Teacher.DoesNotExist:
            return Response(
                {"error": "You are not authorized to view this content."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Fetch assignments created by the teacher
        assignments = Assignment.objects.filter(teacher=teacher)

        if not assignments.exists():
            return Response(
                {"message": "No assignments found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Serialize assignments and return the response
        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class StudentAssignmentsBySubjectView(APIView):
    """
    View for students to fetch assignments based on a specific subject.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        # Ensure the user is a student
        try:
            student = request.user.student  # Assuming a OneToOneField relationship exists between Student and AUTH_USER_MODEL
        except Student.DoesNotExist:
            return Response(
                {"error": "You are not authorized to view this content."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get the subject ID from query parameters
        subject_id = request.query_params.get('subject_id')
        if not subject_id:
            return Response(
                {"error": "Subject ID is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Fetch assignments for the student's class and the specified subject
        assignments = Assignment.objects.filter(
            class_assigned=student.class_code,
            subject_id=subject_id
        )

        if not assignments.exists():
            return Response(
                {"message": "No assignments found for this subject."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Serialize assignments and return the response
        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# to assign homework for student by teacher
class AssignHomeworkView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        # Ensure the request has a logged-in user
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
        # Check if the user is a teacher
        if not hasattr(request.user, 'teacher'):
            return Response({"error": "Only teachers can assign homework."}, status=status.HTTP_403_FORBIDDEN)
        teacher = request.user.teacher # Get the associated teacher instance
        print (teacher)
        # Use the serializer for validation and creation
        serializer = AssignmentSerializer(data=request.data, context={'teacher': teacher})
        if serializer.is_valid():
            # Validate teacher's authorization for class and subject
            subject_instance = serializer.validated_data['subject']
            class_instance = serializer.validated_data['class_assigned']
            # Ensure subject belongs to the class
            if not class_instance.subjects.filter(id=subject_instance.id).exists():
                return Response(
                    {"error": f"The subject '{subject_instance.subject_name}' is not part of the class '{class_instance.class_name}'."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not teacher.classes.filter(id=class_instance.id).exists():
                return Response(
                    {"error": f"You are not authorized to assign homework for the class '{class_instance.class_name}'."},
                    status=status.HTTP_403_FORBIDDEN
                )
            # Save the assignment
            assignment = serializer.save()
            return Response(AssignmentSerializer(assignment).data, status=status.HTTP_201_CREATED)
        # Return validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# delete assignment by same teacher who assigned the assignment
class DeleteAssignmentView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, assignment_id, format=None):
        # Ensure the request has a logged-in user
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Check if the user is a teacher
        if not hasattr(request.user, 'teacher'):
            return Response({"error": "Only teachers can delete assignments."}, status=status.HTTP_403_FORBIDDEN)
        
        teacher = request.user.teacher  # Get the associated teacher instance
        
        try:
            assignment = Assignment.objects.get(id=assignment_id, teacher=teacher)
        except Assignment.DoesNotExist:
            return Response({"error": "Assignment not found or you are not authorized to delete it."}, status=status.HTTP_404_NOT_FOUND)
        
        assignment.delete()
        return Response({"message": "Assignment deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

# update assignment detail by teacher
class UpdateAssignmentView(APIView):
    permission_classes = [AllowAny]

    def put(self, request, assignment_id, format=None):
        # Ensure the request has a logged-in user
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Check if the user is a teacher
        if not hasattr(request.user, 'teacher'):
            return Response({"error": "Only teachers can update assignments."}, status=status.HTTP_403_FORBIDDEN)
        
        teacher = request.user.teacher  # Get the associated teacher instance
        
        try:
            assignment = Assignment.objects.get(id=assignment_id, teacher=teacher)
        except Assignment.DoesNotExist:
            return Response({"error": "Assignment not found or you are not authorized to update it."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = AssignmentSerializer(assignment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class FilterSubjectsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        teacher_id = request.GET.get('teacher')
        print(teacher_id)
        
        class_assigned = request.GET.get('class_assigned')
        print(class_assigned)

        if not teacher_id or not class_assigned:
            return JsonResponse({"error": "Missing teacher or class_assigned parameter"}, status=400)
        teacher_id = int(teacher_id)
        try:
            teacher_id = int(teacher_id)
        except ValueError:
            return JsonResponse({"error": "Invalid teacher parameter"}, status=400)

        print(f"Received teacher ID: {teacher_id}")
        # Fetch the teacher by user_id (which is teacher_id)
        try:
            # print(f"Teacher is : {Teacher}")

            teacher = Teacher.objects.get(id=teacher_id)
            # teacher = Teacher.objects.get(teacher_id)
            print(f"Teacher is : {Teacher}")

            print(f"teachersssss ID: {teacher}")
        except Teacher.DoesNotExist:
            print(f"Teacher with user_id {teacher_id} not found.")
            return JsonResponse({"error": "Teacher not found"}, status=404)

        try:
            assigned_class = Class.objects.get(class_name=class_assigned)
        except Class.DoesNotExist:
            return JsonResponse({"error": f"Class '{class_assigned}' not found"}, status=404)

        # Now filter the subjects for the teacher and the assigned class
        subjects = Subject.objects.filter(teachers=teacher, classes=assigned_class)
        return JsonResponse({"subjects": list(subjects.values())}, safe=False)


class StudentAssignmentsView(APIView):
    """
    View for students to fetch all assigned homework.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        """
        Retrieve all assignments assigned to the student's class.
        """
        try:
            student = request.user.student  # Assuming a OneToOneField relationship
        except Student.DoesNotExist:
            return Response(
                {"error": "You are not authorized to view this content."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Fetch all assignments for the student's class
        assignments = Assignment.objects.filter(class_assigned=student.class_code)

        if not assignments.exists():
            return Response(
                {"message": "No assignments found for your class."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Serialize assignments and return the response
        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class SubmitStudentAssignmentView(APIView):
    permission_classes = [IsAuthenticated]
 
    def post(self, request, format=None):
        """
        Submit an assignment for a student.
        """
        try:
            student = request.user.student  # Ensure the user is linked to a Student instance

        except Student.DoesNotExist:
            return Response(
                {"error": "Only students can submit assignments."},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        # Check if the student is trying to submit a valid assignment
        assignment_id = request.data.get('assignment_id')
        submission_file = request.FILES.get('submission_file')
        written_submission = request.data.get('written_submission')

        if not assignment_id:
            return Response(
                {"error": "Assignment ID are required."},
                status=status.HTTP_400_BAD_REQUEST)

        if not submission_file and not written_submission:
            return Response(
                {"error": "Either a submission file or written submission is required."},
                status=status.HTTP_400_BAD_REQUEST)

        # Retrieve the assignment
        assignment = get_object_or_404(Assignment, id=assignment_id)
        
        # Check if the assignment is for the student's class
        if student.class_code != assignment.class_assigned:
            return Response(
                {"error": "This assignment is not for your class."}, 
                status=status.HTTP_403_FORBIDDEN)

        # Check if the student has already submitted
        if AssignmentSubmission.objects.filter(
            assignment=assignment,student=request.user
            ).exists():
            return Response(
                {"error": "You have already submitted this assignment."}, 
                status=status.HTTP_400_BAD_REQUEST)

        # Create submission
        submission = AssignmentSubmission.objects.create(
            assignment=assignment,
            student=request.user,  # # Pass the CustomUser instance
            submission_file=submission_file,
            written_submission=written_submission,
        )

        serializer = AssignmentSubmissionSerializer(submission)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
# delete submitted assignment of student by student if not reviewed yet:
class DeleteStudentSubmissionView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, submission_id, format=None):
        try:
            student = request.user.student  # Ensure the user is a student
        except Student.DoesNotExist:
            return Response(
                {"error": "Only students can delete their submissions."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            submission = AssignmentSubmission.objects.get(id=submission_id, student=request.user)
        except AssignmentSubmission.DoesNotExist:
            return Response(
                {"error": "Submission not found or you are not authorized to delete it."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if submission.is_checked:
            return Response(
                {"error": "You cannot delete a submission that has been reviewed by the teacher."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        submission.delete()
        return Response({"message": "Submission deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


# review list of assignements given by teacher//uses by teacher 
class ReviewAssignmentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """
        Fetch assignments and their submissions for the teacher's assigned classes and subjects.
        """
        try:
            teacher = request.user.teacher  # Ensure the request user is a teacher
        except Teacher.DoesNotExist:
            return Response(
                {"error": "You are not authorized to view this content."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Fetch assignments for the teacher's classes and subjects
        assignments = Assignment.objects.filter(
            class_assigned__in=teacher.classes.all(),
            subject__in=teacher.subjects.all()
        )

        if not assignments.exists():
            return Response(
                {"message": "No assignments found for your assigned classes or subjects."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Prepare detailed response for each assignment
        data = []
        for assignment in assignments:
            submissions = AssignmentSubmission.objects.filter(assignment=assignment)
            
            # If there is no `status` field, we will not include the breakdown
            data.append({
                "assignment": AssignmentSerializer(assignment).data,
                "submissions": AssignmentSubmissionSerializer(submissions, many=True).data,
                "total_submissions": submissions.count(),
            })

        return Response(data, status=status.HTTP_200_OK)

# to allow a teacher to review a specific assignment submission
# from rest_framework import status
class ReviewAssignmentSubmissionView(APIView):
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]

    def post(self, request, submission_id, format=None):
        """
        Allow a teacher to review a student's assignment submission.
        """
        try:
            teacher = request.user.teacher  # Ensure the user is a teacher
            print(teacher)
        except Teacher.DoesNotExist:
            return Response(
                {"error": "You are not authorized to review assignmentss."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Fetch the submission
        submission = get_object_or_404(AssignmentSubmission, id=submission_id)

        # Ensure the assignment belongs to the teacher
        if submission.assignment.teacher != teacher:
            return Response(
                {"error": "You are not authorized to review this assignment."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get review data from the request
        review_text = request.data.get('review_text', '').strip()
        is_checked = request.data.get('is_checked', False)

        # Update the submission
        submission.reviewed_by = teacher
        submission.review_text = review_text
        submission.is_checked = is_checked
        submission.save()

        return Response(
            {"message": "Review submitted successfully."},
            status=status.HTTP_200_OK
        )
        
class SyllabusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        syllabus = Syllabus.objects.all()
        serializer = SyllabusSerializer(syllabus, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        if not hasattr(request.user, 'teacher'):
            return Response({"error": "Only teachers can create a syllabus."}, status=status.HTTP_403_FORBIDDEN)

        teacher = request.user.teacher
        data = request.data.copy()
        data['teacher'] = teacher.id    # Ensure teacher ID is included

        # Get subject ID from request data
        subject_id = data.get('subject')

        # Check if teacher is assigned to the subject
        if not teacher.subjects.filter(id=subject_id).exists():
            return Response(
                {"error": "You can only add a syllabus for subjects you teach."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = SyllabusSerializer(data=data)

        if serializer.is_valid():
            serializer.save(teacher=teacher)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        """ Allows teachers to update the completion status of topics and subtopics """
        if not hasattr(request.user, 'teacher'):
            return Response({"error": "Only teachers can update the syllabus."}, status=status.HTTP_403_FORBIDDEN)

        teacher = request.user.teacher
        syllabus_id = kwargs.get("pk")  # Get the syllabus ID from URL

        try:
            syllabus = Syllabus.objects.get(id=syllabus_id, teacher=teacher)
        except Syllabus.DoesNotExist:
            return Response({"error": "You do not have permission to update this syllabus."},
                            status=status.HTTP_403_FORBIDDEN)

        data = request.data
        for chapter_data in data.get("chapters", []):
            for topic_data in chapter_data.get("topics", []):
                topic_id = topic_data.get("id")
                if topic_id:
                    topic = Topic.objects.filter(id=topic_id, chapter__syllabus=syllabus).first()
                    if topic:
                        topic.is_completed = topic_data.get("is_completed", topic.is_completed)
                        topic.save()

                        # Update subtopics if provided
                        for subtopic_data in topic_data.get("subtopics", []):
                            subtopic_id = subtopic_data.get("id")
                            if subtopic_id:
                                subtopic = Subtopic.objects.filter(id=subtopic_id, topic=topic).first()
                                if subtopic:
                                    subtopic.is_completed = subtopic_data.get("is_completed", subtopic.is_completed)
                                    subtopic.save()

        serializer = SyllabusSerializer(syllabus)
        return Response(serializer.data, status=status.HTTP_200_OK)

# syllabus get / filter by subject id
class SyllabusFilterView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        subject_id = request.query_params.get("subject_id")

        if not subject_id:
            return Response({"error": "Subject ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        syllabus = Syllabus.objects.filter(subject_id=subject_id)

        if not syllabus.exists():
            return Response({"message": "No syllabus found for this subject."}, status=status.HTTP_404_NOT_FOUND)

        serializer = SyllabusSerializer(syllabus, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


from rest_framework import viewsets
class ChapterViewSet(viewsets.ModelViewSet):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    permission_classes = [permissions.IsAuthenticated]

class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['patch'])
    def mark_complete(self, request, pk=None):
        topic = self.get_object()
        topic.is_completed = True
        topic.save()
        return Response({"message": "Topic marked as completed"}, status=status.HTTP_200_OK)

class SubtopicViewSet(viewsets.ModelViewSet):
    queryset = Subtopic.objects.all()
    serializer_class = SubtopicSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['patch'])
    def mark_complete(self, request, pk=None):
        subtopic = self.get_object()
        subtopic.is_completed = True
        subtopic.save()
        return Response({"message": "Subtopic marked as completed"}, status=status.HTTP_200_OK)

# Discussion Post API Views
class DiscussionPostAPIView(APIView):
    """
    API View to list and create posts.
    """
    def get(self, request):
        # Get all discussion posts
        posts = DiscussionPost.objects.all()
        serializer = DiscussionPostSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Ensure the logged-in user is set as the creator
        data = request.data.copy()
        serializer = DiscussionPostSerializer(data=data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Discussion Comment API Views
class DiscussionCommentAPIView(APIView):
    """
    API View to list and create comments under a specific post.
    """
    def get(self, request, post_id):
        comments = DiscussionComment.objects.filter(post_id=post_id, parent=None)
        serializer = DiscussionCommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, post_id):
        data = request.data.copy()
        data['post'] = post_id
        serializer = DiscussionCommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DiscussionPostDeleteAPIView(APIView):
    """
    API View to delete a discussion post.
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, post_id):
        try:
            post = DiscussionPost.objects.get(id=post_id)
        except DiscussionPost.DoesNotExist:
            return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

        if post.created_by != request.user:
            raise PermissionDenied("You are not authorized to delete this post.")
        post.delete()
        return Response({"message": "Post deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class DiscussionCommentDeleteAPIView(APIView):
    """
    API View to delete a discussion comment.
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, comment_id):
        try:
            comment = DiscussionComment.objects.get(id=comment_id)
        except DiscussionComment.DoesNotExist:
            return Response({"error": "Comment not found."}, status=status.HTTP_404_NOT_FOUND)

        if comment.created_by != request.user:
            raise PermissionDenied("You are not authorized to delete this comment.")

        comment.delete()
        return Response({"message": "Comment deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    

class ExamAPIView(APIView):
    def get(self, request, *args, **kwargs):
        exams = Exam.objects.all()
        serializer = ExamSerializer(exams, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = ExamSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ExamDetailAPIView(APIView):
    def get(self, request):
        """
        Retrieve all exam details.
        """
        details = ExamDetail.objects.all()
        serializer = GetExamDetailSerializer(details, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        serializer = ExamDetailSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StudentResultAPIView(APIView):
    def get(self, request):
        results = StudentResult.objects.all()
        serializer = GetStudentResultSerializer(results, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = StudentResultSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Single Exam APIView
class SingleExamAPIView(APIView):
    def get_object(self, exam_id):
        try:
            return Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            raise NotFound("Exam not found.")

    def get(self, request, exam_id):
        exam = self.get_object(exam_id)
        serializer = ExamSerializer(exam)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, exam_id):
        exam = self.get_object(exam_id)
        data = request.data.copy()  # Copy request data to modify safely

        # Ensure boolean fields are updated properly
        if 'is_timetable_published' not in data:
            data['is_timetable_published'] = exam.is_timetable_published
        if 'is_result_published' not in data:
            data['is_result_published'] = exam.is_result_published

        serializer = ExamSerializer(exam, data=data, partial=True)  # Allow partial updates
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, exam_id):
        exam = self.get_object(exam_id)
        exam.delete()
        return Response({"message": "Exam deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

# Single ExamDetail APIView
class SingleExamDetailAPIView(APIView):
    def get_object(self, exam_detail_id):
        try:
            return ExamDetail.objects.get(id=exam_detail_id)
        except ExamDetail.DoesNotExist:
            raise NotFound("Exam detail not found.")

    def get(self, request, exam_detail_id):
        exam_detail = self.get_object(exam_detail_id)
        serializer = GetExamDetailSerializer(exam_detail)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, exam_detail_id):
        try:
            exam_detail = ExamDetail.objects.get(pk=exam_detail_id)
        except ExamDetail.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = ExamDetailSerializer(exam_detail, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, exam_detail_id):
        exam_detail = self.get_object(exam_detail_id)
        exam_detail.delete()
        return Response({"message": "Exam detail deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

# Single StudentResult APIView
class SingleStudentResultAPIView(APIView):
    def get_object(self, result_id):
        try:
            return StudentResult.objects.get(id=result_id)
        except StudentResult.DoesNotExist:
            raise NotFound("Student result not found.")

    def get(self, request, result_id):
        student_result = self.get_object(result_id)
        serializer = GetStudentResultSerializer(student_result)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, result_id):
        student_result = self.get_object(result_id)
        serializer = StudentResultSerializer(student_result, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, result_id):
        student_result = self.get_object(result_id)
        student_result.delete()
        return Response({"message": "Student result deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class MarksheetView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, student_id, exam_id):
        try:
            # Fetch the exam
            exam = Exam.objects.get(id=exam_id)

            # Check if results are published
            if not exam.is_result_published:
                return Response(
                    {"detail": "Results for this exam are not published yet."},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Fetch the student
            student = Student.objects.select_related('user').get(id=student_id)

            # Fetch the student's subject-wise results for the exam
            results = StudentResult.objects.filter(
                student_id=student_id,
                exam_detail__exam_id=exam_id
            ).select_related('exam_detail', 'exam_detail__subject', 'exam_detail__class_assigned')

            if not results.exists():
                return Response(
                    {"detail": "No results found for the specified student and exam."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Prepare result data
            results_data = []
            total_marks_obtained = 0
            total_full_marks = 0

            for result in results:
                total_marks_obtained += result.total_marks or 0
                total_full_marks += result.exam_detail.full_marks or 0

                # Serialize the result
                result_data = GetStudentResultSerializer(result).data
                results_data.append(result_data)

            # Fetch the overall result from the StudentOverallResult model
            overall_result = StudentOverallResult.objects.get(student=student, exam=exam)

            # Prepare the response data with all student details and results
            return Response({
                "student": {
                    "id": student.id,
                    "username": student.user.username,
                    "full_name": f"{student.user.first_name} {student.user.last_name}",
                    "gender": student.gender,
                    "address": student.address,
                    "phone": student.phone,
                    "date_of_birth": student.date_of_birth
                },
                "exam": exam.name,
                "results": results_data,
                "total_marks_obtained": overall_result.total_marks_obtained,
                "total_full_marks": overall_result.total_full_marks,
                "percentage": round(overall_result.percentage, 2),
                "gpa": round(overall_result.gpa, 2),
                "grade": overall_result.grade
            }, status=status.HTTP_200_OK)

        except Exam.DoesNotExist:
            return Response(
                {"detail": "Exam not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Student.DoesNotExist:
            return Response(
                {"detail": "Student not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except StudentOverallResult.DoesNotExist:
            return Response(
                {"detail": "No overall result found for the specified student and exam."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class ExamDetailsByExamView(APIView):
    def get(self, request, exam_id, *args, **kwargs):
        try:
            # Fetch the exam
            exam = Exam.objects.get(id=exam_id)      

            # Fetch the related exam details
            exam_details = []
            for detail in exam.exam_details.all():
                exam_details.append({
                    "id": detail.id,
                    "class_details": {
                        "id": detail.class_assigned.id,
                        "name": detail.class_assigned.class_name,
                        "code": detail.class_assigned.class_code,
                    },
                    "subject": {
                        "id": detail.subject.id,
                        "subject_code": detail.subject.subject_code,
                        "subject_name": detail.subject.subject_name,
                    },
                    "full_marks": detail.full_marks,
                    "pass_marks": detail.pass_marks,
                    "exam_date": detail.exam_date,  # Keeping only necessary fields
                    "exam_time": detail.exam_time,
                })

            response_data = {
                "id": exam.id,
                "exam": {
                    "id": exam.id,
                    "name": exam.name,
                },
                "exam_details": exam_details,
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except Exam.DoesNotExist:
            return Response({"detail": "Exam not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class SubjectWiseExamResultsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, exam_id, subject_id, *args, **kwargs):
        try:
            # Fetch the results for the specified exam and subject
            results = StudentResult.objects.filter(
                exam_detail__exam_id=exam_id,
                exam_detail__subject_id=subject_id
            ).select_related(
                'student__user', 'exam_detail__exam', 'exam_detail__subject', 'exam_detail__class_assigned'
            )

            if not results.exists():
                return Response(
                    {"detail": "No results found for the specified exam and subject."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Prepare exam and subject details
            exam_detail = results[0].exam_detail
            exam_details = {
                "exam_id": exam_detail.exam.id,
                "exam_name": exam_detail.exam.name,
                "exam_detail_id": exam_detail.id,  # Include the exam_detail ID
                "subject_id": exam_detail.subject.id,
                "subject_code": exam_detail.subject.subject_code,
                "subject_name": exam_detail.subject.subject_name,
                "full_marks": exam_detail.full_marks,
                "pass_marks": exam_detail.pass_marks,
                "exam_date": exam_detail.exam_date,
            }

            # Prepare results data for all students
            results_data = []
            for result in results:
                student = result.student
                results_data.append({
                    "result_id": result.id,  # Include the result ID
                    "student": {
                        "id": student.id,
                        "username": student.user.username,
                        "full_name": f"{student.user.first_name} {student.user.last_name}",
                        "class": {
                            "id": student.class_code.id,
                            "class_code": student.class_code.class_code,
                            "class_name": student.class_code.class_name,
                        } if student.class_code else None,
                        "gender": student.gender,
                    },
                    "practical_marks": result.practical_marks,
                    "theory_marks": result.theory_marks,
                    "total_marks": result.total_marks,
                    "percentage": result.percentage,
                    "gpa": result.gpa,
                })

            return Response({
                "exam_details": exam_details,
                "results": results_data,
            }, status=status.HTTP_200_OK)

        except StudentResult.DoesNotExist:
            return Response(
                {"detail": "Results not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class ExamDetailsByTeacherView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can access

    def get(self, request, examid, teacherId):
        # Fetch the teacher
        try:
            teacher = Teacher.objects.get(id=teacherId)
        except Teacher.DoesNotExist:
            raise NotFound("Teacher not found.")

        # Get subjects taught by the teacher
        teacher_subjects = teacher.subjects.all()

        # Fetch exam details for the given exam ID and teacher's subjects
        exam_details = ExamDetail.objects.filter(
            exam_id=examid,
            subject__in=teacher_subjects
        ).select_related('subject', 'exam', 'class_assigned')  # Optimize queries

        if not exam_details.exists():
            return Response({"detail": "No exam details found for this teacher and exam."}, status=404)

        # Prepare the response with the desired structure
        response_data = []
        for detail in exam_details:
            response_data.append({
                "exam_details": {
                    "id": detail.id,  # Exam detail ID
                    "full_marks": detail.full_marks,
                    "pass_marks": detail.pass_marks,
                    "exam_date": detail.exam_date,
                },
                "exam": {
                    "id": detail.exam.id,
                    "name": detail.exam.name,
                },
                "subject_details": {
                    "id": detail.subject.id,
                    "subject_code": detail.subject.subject_code,
                    "subject_name": detail.subject.subject_name,
                },
                "class_details": {
                    "id": detail.class_assigned.id if detail.class_assigned else None,
                    "class_code": detail.class_assigned.class_code if detail.class_assigned else None,
                    "class_name": detail.class_assigned.class_name if detail.class_assigned else None,
                },
            })
        return Response(response_data, status=200)

class ExamTimetableView(APIView):
    def get(self, request, exam_id, class_id, *args, **kwargs):
        try:
            # Fetch the exam
            exam = Exam.objects.get(id=exam_id)

            # Fetch the exam details for the specific class
            exam_details = exam.exam_details.filter(class_assigned_id=class_id)

            if not exam_details.exists():
                return Response({"detail": "No exam timetable found for this class."}, status=status.HTTP_404_NOT_FOUND)

            # Prepare response data without full_marks and pass_marks
            exam_details_data = [
                {
                    "id": detail.id,
                    "class_details": {
                        "id": detail.class_assigned.id,
                        "name": detail.class_assigned.class_name,
                        "code": detail.class_assigned.class_code,
                    },
                    "subject": {
                        "id": detail.subject.id,
                        "subject_code": detail.subject.subject_code,
                        "subject_name": detail.subject.subject_name,
                    },
                    "exam_date": detail.exam_date,  # Keeping only necessary fields
                    "exam_time": detail.exam_time,
                }
                for detail in exam_details
            ]

            response_data = {
                "id": exam.id,
                "exam": {
                    "id": exam.id,
                    "name": exam.name,
                },
                "exam_details": exam_details_data,
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Exam.DoesNotExist:
            return Response({"detail": "Exam not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ExamsByClassView(APIView):
    def get(self, request, class_id, *args, **kwargs):
        try:
            # Fetch all unique exams linked to the given class via ExamDetail
            exams = Exam.objects.filter(exam_details__class_assigned_id=class_id).distinct()

            if not exams.exists():
                return Response({"detail": "No exams found for this class."}, status=status.HTTP_404_NOT_FOUND)

            # Retrieve class details (assuming all exams belong to the same class)
            class_instance = exams.first().exam_details.filter(class_assigned_id=class_id).first().class_assigned

            # Prepare response data
            response_data = {
                "class_details": {
                    "id": class_instance.id,
                    "name": class_instance.class_name,
                    "code": class_instance.class_code,
                },
                "exams": [
                    {
                        "id": exam.id,
                        "name": exam.name,
                    }
                    for exam in exams
                ],
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Student, Class

class BulkUpdateRollNumbersAPIView(APIView):
    def put(self, request, class_id, *args, **kwargs):
        """
        API to bulk update roll numbers for students within a given class.
        Expects JSON:
        {
            "students": [
                {"id": 1, "roll_no": "3"},
                {"id": 2, "roll_no": "4"}
            ]
        }
        """
        students_data = request.data.get("students", [])

        if not students_data:
            return Response({"detail": "Students data is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Validate class exists
            if not Class.objects.filter(id=class_id).exists():
                return Response({"detail": "Class not found."}, status=status.HTTP_404_NOT_FOUND)

            with transaction.atomic():
                student_ids = [s["id"] for s in students_data]

                # Fetch students from database who belong to the given class
                students = Student.objects.filter(id__in=student_ids, class_code_id=class_id)

                if students.count() != len(students_data):
                    return Response({"detail": "Some students do not belong to the given class."}, status=status.HTTP_400_BAD_REQUEST)

                # Get existing roll numbers in the class (excluding the students being updated)
                existing_rolls = set(
                    Student.objects.filter(class_code_id=class_id)
                    .exclude(id__in=student_ids)
                    .values_list("roll_no", flat=True)
                )

                # Get new roll numbers from request
                new_roll_numbers = {s["roll_no"] for s in students_data}

                # Ensure no duplicate roll numbers within the class
                if len(new_roll_numbers) != len(students_data):
                    return Response({"detail": "Duplicate roll numbers detected."}, status=status.HTTP_400_BAD_REQUEST)

                if existing_rolls & new_roll_numbers:
                    return Response({"detail": "Roll number conflict in the class."}, status=status.HTTP_400_BAD_REQUEST)

                # Temporarily clear roll numbers for students being updated
                Student.objects.filter(id__in=student_ids).update(roll_no=None)

                # Assign new roll numbers
                roll_no_map = {s["id"]: s["roll_no"] for s in students_data}
                for student in students:
                    student.roll_no = roll_no_map[student.id]

                Student.objects.bulk_update(students, ["roll_no"])

            return Response({"detail": "Roll numbers updated successfully."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction

@receiver(post_save, sender=StudentResult)
def update_student_overall_result(sender, instance, **kwargs):
    # Ensure atomicity
    with transaction.atomic():
        student = instance.student
        exam = instance.exam_detail.exam
        class_instance = student.class_code

        # Calculate the total marks and GPA for the student in this exam
        results = StudentResult.objects.filter(student=student, exam_detail__exam=exam)
        total_marks_obtained = sum(result.total_marks or 0 for result in results)
        total_full_marks = sum(result.exam_detail.full_marks or 0 for result in results)

        if total_full_marks > 0:
            percentage = (total_marks_obtained / total_full_marks) * 100
        else:
            percentage = 0

        # Calculate GPA based on percentage
        if percentage >= 90:
            gpa = 4.0
            grade = 'A+'
        elif percentage >= 80:
            gpa = 3.5
            grade = 'A'
        elif percentage >= 70:
            gpa = 3.0
            grade = 'B+'
        elif percentage >= 60:
            gpa = 2.5
            grade = 'B'
        elif percentage >= 50:
            gpa = 2.0
            grade = 'C+'
        elif percentage >= 40:
            gpa = 1.5
            grade = 'C'
        elif percentage >= 35:
            gpa = 1.0
            grade = 'D'
        else:
            gpa = 0.0
            grade = 'NG'

        # Update or create the overall result
        student_overall_result, created = StudentOverallResult.objects.update_or_create(
            student=student, 
            exam=exam, 
            defaults={
                'total_marks_obtained': total_marks_obtained,
                'total_full_marks': total_full_marks,
                'percentage': percentage,
                'gpa': gpa,
                'grade': grade
            }
        )

        # Now that the overall result is updated, recalculate rankings
        recalculate_rankings(exam, class_instance)

def recalculate_rankings(exam, class_instance):
    # Fetch all student results for this exam and class
    student_results = StudentOverallResult.objects.filter(
        exam=exam, student__class_code=class_instance
    ).select_related('student')

    # Order by total marks obtained, then by student name (for tie-breaking)
    ranked_results = student_results.order_by('-total_marks_obtained', 'student__user__username')

    # Recalculate the ranks
    rank = 1
    for idx, result in enumerate(ranked_results):
        # If marks are different from the previous result, increment the rank
        if idx > 0 and ranked_results[idx-1].total_marks_obtained != result.total_marks_obtained:
            rank = idx + 1

        # Update the rank in the StudentOverallResult
        result.rank = rank
        result.save()

class StudentRankingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, exam_id, class_id):
        try:
            # Fetch the exam and class instances
            exam = Exam.objects.get(id=exam_id)
            class_instance = Class.objects.get(id=class_id)  # Using class_id instead of class_code

            # Check if results are published for the exam
            if not exam.is_result_published:
                return Response(
                    {"detail": "Results for this exam are not published yet."},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Fetch all students' overall results for this exam and class
            student_results = StudentOverallResult.objects.filter(
                exam=exam, student__class_code=class_instance
            ).select_related('student')

            # Create the rankings list with the stored rank and result data
            results_with_ranks = [
                {
                    'student': result.student.user.username,
                    'total_marks_obtained': result.total_marks_obtained,
                    'rank': result.rank,  # Get the rank directly from the model
                    'gpa': result.gpa,
                    'grade': result.grade,
                }
                for result in student_results
            ]

            # Return ranked results
            return Response({
                "exam": {"id": exam.id, "name": exam.name},
                "class": {"id": class_instance.id, "name": class_instance.class_name, "code": class_instance.class_code},
                "rankings": results_with_ranks
            }, status=status.HTTP_200_OK)

        except Exam.DoesNotExist:
            return Response(
                {"detail": "Exam not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Class.DoesNotExist:
            return Response(
                {"detail": "Class not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class MessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(sender=user) | Message.objects.filter(receiver=user)

class SendMessageView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class NotesCreateView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request):
        """Create a new note (Only teachers can post)."""
        if not hasattr(request.user, 'teacher'):
            return Response({"error": "Only teachers can upload notes."}, status=status.HTTP_403_FORBIDDEN)

        serializer = NotesSerializer(data=request.data, context={'request': request})  # Pass request context
        if serializer.is_valid():
            serializer.save(created_by=request.user)  # Auto-assign teacher
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NotesDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get_object(self, pk):
        try:
            return Notes.objects.get(pk=pk)
        except Notes.DoesNotExist:
            return None

    def get(self, request, pk):
        """Retrieve a single note."""
        note = self.get_object(pk)
        if note is None:
            return Response({"error": "Note not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = GetNotesSerializer(note, context={'request': request})  # Pass request context
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        """Update a note (Only the creator can update)."""
        note = self.get_object(pk)
        if note is None:
            return Response({"error": "Note not found."}, status=status.HTTP_404_NOT_FOUND)

        if request.user != note.created_by:
            return Response({"error": "You can only edit your own notes."}, status=status.HTTP_403_FORBIDDEN)

        serializer = NotesSerializer(note, data=request.data, context={'request': request}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Delete a note (Only the creator can delete)."""
        note = self.get_object(pk)
        if note is None:
            return Response({"error": "Note not found."}, status=status.HTTP_404_NOT_FOUND)

        if request.user != note.created_by:
            return Response({"error": "You can only delete your own notes."}, status=status.HTTP_403_FORBIDDEN)

        note.delete()
        return Response({"message": "Note deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    
class NotesBySubjectAPIView(APIView):
    def get(self, request, subjectid):
        try:
            # Fetch the subject by its ID
            subject = Subject.objects.get(id=subjectid)
        except Subject.DoesNotExist:
            return Response({"detail": "Subject not found."}, status=status.HTTP_404_NOT_FOUND)

        # Fetch all notes for the given subject
        notes = Notes.objects.filter(subject=subject)

        # Serialize the notes data
        serializer = GetNotesSerializer(notes, many=True)

        # Return the serialized data
        return Response({"notes": serializer.data}, status=status.HTTP_200_OK)
    

class DailyAttendanceAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        today = timezone.now().date()
        user = request.user  # Logged-in user (CustomUser)

        # Ensure the logged-in user is a teacher
        try:
            teacher = Teacher.objects.get(user=user)
        except Teacher.DoesNotExist:
            return Response({"detail": "User is not a teacher."}, status=status.HTTP_400_BAD_REQUEST)

        attendance_data = request.data.get('attendance', [])

        if not attendance_data:
            return Response({"detail": "No attendance data provided"}, status=status.HTTP_400_BAD_REQUEST)

        # To track the students whose attendance is already recorded
        already_recorded_students = []
        new_attendance_students = []

        # Flag to check if all attendance records are already taken
        all_records_taken = True

        try:
            with transaction.atomic():  # Wrap the entire operation in a transaction
                for attendance in attendance_data:
                    student = attendance.get('student')
                    status_value = attendance.get('status')

                    # Check if the record exists for the student on the given day
                    existing_record = DailyAttendance.objects.filter(student_id=student, date=today).first()

                    if existing_record:
                        # If record already exists, skip this student
                        already_recorded_students.append(student)
                    else:
                        # Create a new record for students without today's attendance
                        DailyAttendance.objects.create(
                            student_id=student,
                            date=today,
                            status=status_value,
                            recorded_by=teacher
                        )
                        new_attendance_students.append(student)
                        all_records_taken = False  # Mark as False if there are new records

            if all_records_taken:
                return Response({"detail": "Attendance already taken for the day."}, status=status.HTTP_400_BAD_REQUEST)

            response_data = {
                "detail": "Attendance records processed successfully.",
                "already_recorded_students": already_recorded_students,
                "new_attendance_students": new_attendance_students
            }
            return Response(response_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            # If any error occurs, the entire transaction will be rolled back
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AttendanceByClassAPIView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can access

    def get(self, request, classid, date):
        """Retrieve attendance records for a class on a specific date."""
        try:
            date_obj = timezone.datetime.strptime(date, "%Y-%m-%d").date()
        except ValueError:
            return Response({"detail": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            class_obj = Class.objects.get(id=classid)
        except Class.DoesNotExist:
            return Response({"detail": "Class not found."}, status=status.HTTP_404_NOT_FOUND)

        attendance_records = DailyAttendance.objects.filter(student__class_code=class_obj, date=date_obj)

        # Serialize class details
        class_details = {
            "id": class_obj.id,
            "name": class_obj.class_name,
            "code": class_obj.class_code
        }

        # Serialize attendance data
        attendance_list = [
            {
                "student_id": record.student.id,
                "full_name": f"{record.student.user.first_name} {record.student.user.last_name}".strip(),
                "roll_no": record.student.roll_no,
                "status": record.status
            }
            for record in attendance_records
        ]

        return Response({
            "date": date_obj,
            "class": class_details,
            "attendance": attendance_list
        }, status=status.HTTP_200_OK)

    def put(self, request, classid, date):
        """Update attendance for a class on a specific date."""
        try:
            date_obj = timezone.datetime.strptime(date, "%Y-%m-%d").date()
        except ValueError:
            return Response({"detail": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            class_obj = Class.objects.get(id=classid)
        except Class.DoesNotExist:
            return Response({"detail": "Class not found."}, status=status.HTTP_404_NOT_FOUND)

        attendance_data = request.data.get('attendance', [])

        if not attendance_data:
            return Response({"detail": "No attendance data provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                for record in attendance_data:
                    student_id = record.get('student')
                    status_value = record.get('status')

                    attendance_record = DailyAttendance.objects.filter(
                        student_id=student_id, date=date_obj, student__class_code=class_obj
                    ).first()

                    if attendance_record:
                        attendance_record.status = status_value
                        attendance_record.save()
                    else:
                        return Response(
                            {"detail": f"Attendance record for student {student_id} does not exist."},
                            status=status.HTTP_400_BAD_REQUEST
                        )

            return Response({"detail": "Class attendance updated successfully."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, classid, date):
        """Delete attendance records for a class on a specific date."""
        try:
            date_obj = timezone.datetime.strptime(date, "%Y-%m-%d").date()
        except ValueError:
            return Response({"detail": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            class_obj = Class.objects.get(id=classid)
        except Class.DoesNotExist:
            return Response({"detail": "Class not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            with transaction.atomic():
                attendance_records = DailyAttendance.objects.filter(student__class_code=class_obj, date=date_obj)

                if not attendance_records.exists():
                    return Response({"detail": "No attendance records found for the specified class and date."},
                                    status=status.HTTP_400_BAD_REQUEST)

                attendance_records.delete()

            return Response({"detail": "Class attendance records deleted successfully."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    

class StudentsByClassAttendanceAPIView(APIView):
    def get(self, request, class_id):
        students = Student.objects.filter(class_code_id=class_id).prefetch_related('user')

        # Get student IDs to fetch last transactions in bulk (optimized)
        student_ids = students.values_list('id', flat=True)

        # Fetch last transaction for each student in bulk (avoiding N+1 queries)
        last_transactions = {
            txn.student_id: txn.balance
            for txn in StudentTransaction.objects.filter(student_id__in=student_ids).order_by('student_id', '-transaction_date')
        }

        # Attach balance to each student instance
        for student in students:
            student.pre_balance = last_transactions.get(student.id, 0)  # Default to 0 if no transaction

        serializer = StudentListAttendanceSerializer(students, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    

class SubjectWiseStudentListAPIView(APIView):
    def get(self, request, subject_id):
        """Retrieve students enrolled in a given subject."""
        try:
            subject = Subject.objects.get(id=subject_id)
        except Subject.DoesNotExist:
            return Response({"detail": "Subject not found."}, status=status.HTTP_404_NOT_FOUND)

        students = Student.objects.filter(class_code__subjects=subject).distinct()
        serializer = GetStudentSerializer(students, many=True)

        return Response({
            "subject": {
                "id": subject.id,
                "name": subject.subject_name,
                "code": subject.subject_code
            },
            "students": serializer.data
        }, status=status.HTTP_200_OK)


# Fee Category API
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import FeeCategoryName
from .serializers import FeeCategoryNameSerializer
from rest_framework.permissions import IsAuthenticated

class FeeCategoryNameAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        fee_category_names = FeeCategoryName.objects.all()
        serializer = FeeCategoryNameSerializer(fee_category_names, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = FeeCategoryNameSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FeeCategoryNameDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, category_id, *args, **kwargs):
        try:
            fee_category_name = FeeCategoryName.objects.get(id=category_id)
            serializer = FeeCategoryNameSerializer(fee_category_name)
            return Response(serializer.data)
        except FeeCategoryName.DoesNotExist:
            return Response({"detail": "FeeCategoryName not found."}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, category_id, *args, **kwargs):
        try:
            fee_category_name = FeeCategoryName.objects.get(id=category_id)
            serializer = FeeCategoryNameSerializer(fee_category_name, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except FeeCategoryName.DoesNotExist:
            return Response({"detail": "FeeCategoryName not found."}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, category_id, *args, **kwargs):
        try:
            fee_category_name = FeeCategoryName.objects.get(id=category_id)
            fee_category_name.delete()
            return Response({"detail": "FeeCategoryName deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except FeeCategoryName.DoesNotExist:
            return Response({"detail": "FeeCategoryName not found."}, status=status.HTTP_404_NOT_FOUND)


class FeeCategoryByClassAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, class_id, *args, **kwargs):
        fee_categories = FeeCategory.objects.filter(class_assigned__id=class_id)
        serializer = GetFeeCategorySerializer(fee_categories, many=True)
        return Response(serializer.data)

    def post(self, request, class_id, *args, **kwargs):
        # Add class_id to the incoming data
        data = request.data
        data['class_assigned'] = class_id  # Ensure the class_id is included in the new category data

        # Validation: Check if the FeeCategory already exists for this class and category name
        fee_category_name = data.get('fee_category_name')
        if FeeCategory.objects.filter(class_assigned__id=class_id, fee_category_name__id=fee_category_name).exists():
            return Response({"detail": "Fee category for this class already created."}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = FeeCategorySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FeeCategoryDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, class_id, category_id, *args, **kwargs):
        try:
            fee_category = FeeCategory.objects.get(id=category_id, class_assigned__id=class_id)
            serializer = GetFeeCategorySerializer(fee_category)
            return Response(serializer.data)
        except FeeCategory.DoesNotExist:
            return Response({"detail": "FeeCategory not found."}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, class_id, category_id, *args, **kwargs):
        try:
            fee_category = FeeCategory.objects.get(id=category_id, class_assigned__id=class_id)
            serializer = FeeCategorySerializer(fee_category, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except FeeCategory.DoesNotExist:
            return Response({"detail": "FeeCategory not found."}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, class_id, category_id, *args, **kwargs):
        try:
            fee_category = FeeCategory.objects.get(id=category_id, class_assigned__id=class_id)
            fee_category.delete()
            return Response({"detail": "FeeCategory deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except FeeCategory.DoesNotExist:
            return Response({"detail": "FeeCategory not found."}, status=status.HTTP_404_NOT_FOUND)

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import TransportationFee
from .serializers import TransportationFeeSerializer

class TransportationFeeListCreateAPIView(APIView):
    def get(self, request):
        transportation_fees = TransportationFee.objects.all()
        serializer = TransportationFeeSerializer(transportation_fees, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Validation: Check if the transportation fee with the same name already exists
        place = request.data.get('place')
        if TransportationFee.objects.filter(place=place).exists():
            return Response({"detail": "Transportation Fee with that name already created."}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = TransportationFeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TransportationFeeDetailAPIView(APIView):
    def get(self, request, pk):
        try:
            transportation_fee = TransportationFee.objects.get(pk=pk)
        except TransportationFee.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = TransportationFeeSerializer(transportation_fee)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            transportation_fee = TransportationFee.objects.get(pk=pk)
        except TransportationFee.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = TransportationFeeSerializer(transportation_fee, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            transportation_fee = TransportationFee.objects.get(pk=pk)
        except TransportationFee.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        transportation_fee.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class StudentBillAPIView(APIView):
    def get(self, request, student_id, *args, **kwargs):
        """Retrieve all bills for a specific student."""
        bills = StudentBill.objects.filter(student__id=student_id)
        serializer = GetStudentBillSerializer(bills, many=True)
        return Response(serializer.data)

    def post(self, request, student_id, *args, **kwargs):
        try:
            student = Student.objects.get(id=student_id)
        except Student.DoesNotExist:
            return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)

        month = request.data.get("month")
        if StudentBill.objects.filter(student=student, month=month).exists():
            return Response({"error": "Bill already generated for this month."}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate pre_balance (last transaction balance)
        last_transaction = StudentTransaction.objects.filter(student=student).order_by('-transaction_date').first()
        pre_balance = last_transaction.balance if last_transaction else 0

        # Prepare request data
        request.data["student"] = student.id
        serializer = StudentBillSerializer(data=request.data)

        if serializer.is_valid():
            # Start atomic transaction block
            with transaction.atomic():
                # Create the bill
                student_bill = serializer.save()

                # Calculate post_balance (pre_balance + bill amount)
                post_balance = pre_balance + student_bill.total_amount

                # Create the transaction for the bill
                StudentTransaction.objects.create(
                    student=student_bill.student,
                    transaction_type='bill',
                    bill=student_bill,
                    balance=post_balance,
                    transaction_date=student_bill.date
                )

                # Commit the transaction
                bill_data = GetStudentBillSerializer(student_bill).data
                bill_data.update({
                    "pre_balance": pre_balance,
                    "post_balance": post_balance
                })

                return Response({
                    'message': f'Student Bill generated successfully with Bill Number: {student_bill.bill_number}',
                    'bill_details': bill_data
                }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class StudentBillDetailAPIView(APIView):
    def get(self, request, bill_number=None):
        try:
            # Fetch the StudentBill object
            bill = StudentBill.objects.get(bill_number=bill_number)

            # Serialize the bill data
            serializer = GetStudentBillSerializer(bill)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except StudentBill.DoesNotExist:
            return Response({"detail": "Bill not found."}, status=status.HTTP_404_NOT_FOUND)


class StudentPaymentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, student_id, *args, **kwargs):
        """Retrieve all payments for a specific student."""
        payments = StudentPayment.objects.filter(student__id=student_id)
        serializer = GetStudentPaymentSerializer(payments, many=True)
        return Response(serializer.data)

    def post(self, request, student_id, *args, **kwargs):
        try:
            student = Student.objects.get(id=student_id)
        except Student.DoesNotExist:
            return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)

        

        last_transaction = StudentTransaction.objects.filter(student=student).order_by('-transaction_date').first()
        pre_balance = last_transaction.balance if last_transaction else 0

        data = request.data
        data['student'] = student_id

        serializer = StudentPaymentSerializer(data=data, context={'request': request})  # Pass request context

        if serializer.is_valid():
            # Begin atomic transaction
            with transaction.atomic():
                # Create the payment object
                payment = serializer.save()

                # Update the balances
                post_balance = pre_balance - payment.amount_paid

                # Create the transaction for the payment
                last_transaction = StudentTransaction.objects.filter(student=student).order_by('-transaction_date').first()
                last_balance = last_transaction.balance if last_transaction else Decimal('0.00')
                new_balance = last_balance - Decimal(str(payment.amount_paid))

                # Save the new transaction entry
                StudentTransaction.objects.create(
                    student=payment.student,
                    transaction_type='payment',
                    payment=payment,
                    balance=new_balance,
                    transaction_date=payment.date
                )

                # Commit the transaction
                post_balance = pre_balance - payment.amount_paid

                payment_data = GetStudentPaymentSerializer(payment).data
                payment_data.update({
                    "pre_balance": pre_balance,
                    "post_balance": post_balance
                })

                return Response({
                    'message': f'Payment done successfully with Payment Number: {payment.payment_number}',
                    'payment_details': payment_data
                }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StudentPaymentDetailAPIView(APIView):
    def get(self, request, payment_number=None):
        try:
            # Fetch the StudentPayment object
            payment = StudentPayment.objects.get(payment_number=payment_number)

            # Serialize the payment data
            serializer = GetStudentPaymentSerializer(payment)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except StudentPayment.DoesNotExist:
            return Response({"detail": "Payment not found."}, status=status.HTTP_404_NOT_FOUND)

class StudentTransactionsAPIView(APIView):

    def get(self, request, student_id):
        # Get all transactions for the student
        transactions = StudentTransaction.objects.filter(student_id=student_id)
        if not transactions.exists():
            return Response({"message": "No transactions found"}, status=404)

        # Serialize transactions
        transaction_serializer = StudentTransactionSerializer(transactions, many=True)
        transaction_data = transaction_serializer.data

        # Extract student details from the first transaction manually
        first_transaction = transactions.first()
        student_data = {
            "id": first_transaction.student.id,
            "name": first_transaction.student.user.username,
            "parents": first_transaction.student.parents,
            "roll_no": first_transaction.student.roll_no,
            "phone": first_transaction.student.phone,
            "address": first_transaction.student.address,
            "date_of_birth": first_transaction.student.date_of_birth,
            "gender": first_transaction.student.gender,
            "class_name": first_transaction.student.class_code.class_name if first_transaction.student.class_code else None
        }

        # Remove student data from each transaction
        for transaction in transaction_data:
            transaction.pop("student", None)

        # Return response with student details only once
        return Response({
            "student": student_data,  # Extracted manually
            "transactions": transaction_data  # Transactions without duplicate student data
        })


class DashboardAPIView(APIView):
    def get(self, request):
        # Count total numbers
        total_students = Student.objects.count()
        total_teachers = Teacher.objects.count()
        total_classes = Class.objects.count()

        # Gender distribution
        student_gender_distribution = Student.objects.values('gender').annotate(count=Count('gender'))
        teacher_gender_distribution = Teacher.objects.values('gender').annotate(count=Count('gender'))

        # Convert to dictionary format
        student_gender_data = {item["gender"]: item["count"] for item in student_gender_distribution}
        teacher_gender_data = {item["gender"]: item["count"] for item in teacher_gender_distribution}

        # Students per class
        students_per_class = {
            cls.class_name: cls.students.count() for cls in Class.objects.prefetch_related('students')
        }

        # Prepare response data (without using a serializer)
        data = {
            "total_students": total_students,
            "total_teachers": total_teachers,
            "total_classes": total_classes,
            "student_gender_distribution": student_gender_data,
            "teacher_gender_distribution": teacher_gender_data,
            "students_per_class": students_per_class,
        }

        return Response(data, status=status.HTTP_200_OK)


class AttendanceSummaryAPIView(APIView):

    def get(self, request, date=None):
        """
        Get overall attendance statistics for a specific date.
        """
        if not date:
            date = timezone.now().date()  # Default to today's date
        else:
            try:
                date = timezone.datetime.strptime(date, "%Y-%m-%d").date()
            except ValueError:
                return Response({"detail": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # Get all students
        total_students = Student.objects.count()

        # Get attendance records for the given date
        attendance_records = DailyAttendance.objects.filter(date=date)

        # Count present and absent students
        present_count = attendance_records.filter(status=True).count()
        absent_count = attendance_records.filter(status=False).count()

        # Get class-wise statistics
        class_wise_stats = defaultdict(lambda: {"total": 0, "present": 0, "absent": 0})

        for student in Student.objects.all():
            class_name = student.class_code.class_name  # Assuming class_code is related to Class model
            class_wise_stats[class_name]["total"] += 1

        for record in attendance_records:
            class_name = record.student.class_code.class_name
            if record.status:
                class_wise_stats[class_name]["present"] += 1
            else:
                class_wise_stats[class_name]["absent"] += 1

        return Response({
            "date": date,
            "total_students": total_students,
            "total_present": present_count,
            "total_absent": absent_count,
            "class_wise_attendance": class_wise_stats
        }, status=status.HTTP_200_OK)
    

class SyllabusSummaryAPIView(APIView):
    def get(self, request, teacher_id):
        syllabuses = Syllabus.objects.filter(teacher_id=teacher_id).prefetch_related('chapters__topics__subtopics')

        syllabus_data = []

        for syllabus in syllabuses:
            # Count total subtopics (since progress is tracked at the subtopic level)
            total_subtopics = syllabus.chapters.aggregate(total=Count("topics__subtopics"))["total"] or 0
            completed_subtopics = syllabus.chapters.aggregate(
                completed=Count("topics__subtopics", filter=Q(topics__subtopics__is_completed=True))
            )["completed"] or 0

            # Calculate completion percentage
            completion_percentage = (completed_subtopics / total_subtopics * 100) if total_subtopics else 0

            syllabus_data.append({
                "subject": syllabus.subject.name,
                "total_topics": syllabus.chapters.aggregate(total=Count("topics"))["total"] or 0,  # Total topics count
                "total_subtopics": total_subtopics,  # Total subtopics count
                "completed_subtopics": completed_subtopics,  # Completed subtopics count
                "completion_percentage": round(completion_percentage, 2),
            })

        return Response({"syllabus_progress": syllabus_data}, status=200)


from django.db.models import Sum


class FeeDashboardAPIView(APIView):
    def get(self, request):
        # Get current month & year
        current_month = now().strftime("%B")  # e.g., "February"
        current_year = now().year

        # 🔹 Total amount billed (All time)
        total_billed_all_time = StudentBill.objects.aggregate(total=Sum('total_amount'))["total"] or 0

        # 🔹 Total amount billed (Current Month)
        total_billed_monthly = StudentBill.objects.filter(date__month=datetime.now().month).aggregate(total=Sum('total_amount'))["total"] or 0

        # 🔹 Total payments made (All time)
        total_paid_all_time = StudentPayment.objects.aggregate(total=Sum('amount_paid'))["total"] or 0

        # 🔹 Total payments made (Current Month)
        total_paid_monthly = StudentPayment.objects.filter(date__month=datetime.now().month).aggregate(total=Sum('amount_paid'))["total"] or 0

        # 🔹 Number of payments (All time)
        total_payments_all_time = StudentPayment.objects.count()

        # 🔹 Number of payments (Current Month)
        total_payments_monthly = StudentPayment.objects.filter(date__month=datetime.now().month).count()

        # 🔹 Students with cleared dues (Balance = 0)
        cleared_students = StudentTransaction.objects.filter(balance=0).values("student").distinct().count()

        # 🔹 Students with outstanding balance (Balance > 0) and have transactions/bills
        students_with_dues = StudentTransaction.objects.filter(balance__gt=0).filter(student__in=StudentBill.objects.values('student')).values("student").distinct().count()  # Ensure there is a bill generated for the student
        

        # 🔹 Total Scholarship/Discount Amount
        discount_amount = StudentBill.objects.aggregate(total=Sum("discount"))["total"] or 0

        # 🔹 Total Fee Amount where Scholarship is applied
        scholarship_fee_amount = StudentBillFeeCategory.objects.filter(scholarship=True).aggregate(total=Sum("fee_category__amount"))["total"] or 0

        # Response Data
        data = {
            "bills": {
                "total_bill_amount_alltime": total_billed_all_time,
                "bill_amount_monthly": [
                    {
                        "month": current_month,
                        "amount": total_billed_monthly
                    }
                ],
                "total_payment_amount_alltime": total_paid_all_time,
                "number_of_payments_done": total_payments_all_time,
                "payment_amount_monthly": [
                    {
                        "month": current_month,
                        "amount": total_paid_monthly,
                        "no_of_payment": total_payments_monthly
                    }
                ],
                "dues": {
                    "students_cleared": cleared_students,
                    "students_with_dues": students_with_dues
                },
                "total_discount_amount": discount_amount,
                "total_scholarship_fee_amount": scholarship_fee_amount
            }
        }

        return Response(data, status=status.HTTP_200_OK)


class PaymentSearchAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Get start and end dates from the request body
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')

        # Validate that both dates are provided
        if not start_date or not end_date:
            return Response({"error": "Both start_date and end_date are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Check if the date is in BS format (YYYY/MM/DD) or AD format (YYYY-MM-DD)
            if '/' in start_date and '/' in end_date:
                # Convert BS to AD
                start_date_bs_obj = ndt.date(*map(int, start_date.split('/')))
                end_date_bs_obj = ndt.date(*map(int, end_date.split('/')))
                
                start_date_ad = start_date_bs_obj.to_datetime_date()
                end_date_ad = end_date_bs_obj.to_datetime_date()
            else:
                # Parse as AD date (YYYY-MM-DD)
                start_date_ad = parse_date(start_date)
                end_date_ad = parse_date(end_date)

                if not start_date_ad or not end_date_ad:
                    raise ValueError  # If parsing fails

                if start_date_ad > end_date_ad:
                    return Response({"error": "start_date cannot be after end_date."}, status=status.HTTP_400_BAD_REQUEST)

        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY/MM/DD for BS or YYYY-MM-DD for AD."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch payments within the date range (converted to AD)
        payments = StudentPayment.objects.filter(date__date__range=(start_date_ad, end_date_ad))

        # Calculate total amount directly using aggregation (efficient)
        total_amount = payments.aggregate(total=Sum('amount_paid'))['total'] or 0

        # Serialize payment data
        payment_data = []
        for payment in payments:
            student_name = payment.student.user.get_full_name() if payment.student and payment.student.user else "Unknown"
            class_name = payment.student.class_code.class_name if payment.student and payment.student.class_code else "Not Assigned"
            created_by = payment.created_by.username if payment.created_by else "Unknown"

            payment_data.append({
                "student_name": student_name,
                "class": class_name,
                "payment_amount": payment.amount_paid,
                "payment_date": payment.date.strftime('%Y-%m-%d'),
                "created_by": created_by
            })

        return Response({
            "payments": payment_data,
            "total_payment_amount": total_amount
        }, status=status.HTTP_200_OK)


# API to create a new message
class CreateMessageAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CommunicationSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()  # sender is automatically set in the serializer
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API to get messages for a specific receiver
class UserMessagesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Fetch messages where the logged-in user is the direct receiver.
        """
        user = request.user
        messages = Communication.objects.filter(receiver=user)
        serializer = GetCommunicationSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# API to get messages based on logged-in user's role
class RoleBasedMessagesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Fetch messages based on the logged-in user's role.
        """
        user = request.user
        role_filters = []

        # Logic for Teachers
        if user.is_teacher:
            role_filters += ["teacher", "teacher_student", "teacher_accountant", "all"]

        # Logic for Students
        if user.is_student:
            role_filters += ["student", "teacher_student", "student_accountant", "all"]

        # Logic for Accountants
        if user.is_accountant:
            role_filters += ["accountant", "teacher_accountant", "student_accountant", "all"]

        # Fetch messages where receiver_role matches the above filter
        messages = Communication.objects.filter(receiver_role__in=role_filters)

        # Serialize the messages and send the response
        serializer = GetCommunicationSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CommunicationDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        """
        Retrieve a single message by ID
        """
        message = get_object_or_404(Communication, pk=pk)
        serializer = GetCommunicationSerializer(message)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        """
        Update an existing message, but only if the logged-in user is the sender
        """
        message = get_object_or_404(Communication, pk=pk)
        
        # Check if the logged-in user is the sender
        if message.sender != request.user:
            raise PermissionDenied("You do not have permission to edit this message.")
        
        serializer = CommunicationSerializer(message, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """
        Delete a message, but only if the logged-in user is the sender.
        """
        message = get_object_or_404(Communication, pk=pk)
        
        # Check if the logged-in user is the sender
        if message.sender != request.user:
            raise PermissionDenied("You do not have permission to delete this message.")
        
        message.delete()
        
        # Return 200 OK with the success message
        return Response({"detail": "Message deleted successfully"}, status=status.HTTP_200_OK)

class FinanceSummaryAPIView(APIView):
    permission_classes = [IsAuthenticated]  # Optional, restrict access
    # permission_classes = [AllowAny]  # Optional, restrict access

    def get(self, request, *args, **kwargs):
        # Total Fees Collected
        total_fees_collected = StudentPayment.objects.aggregate(total=Sum('amount_paid'))['total'] or 0

        # Total Outstanding Amount
        total_fees_billed = StudentBill.objects.aggregate(total=Sum('total_amount'))['total'] or 0
        total_outstanding_amount = total_fees_billed - total_fees_collected

        # Total Transaction Count
        total_transaction_count = StudentTransaction.objects.count()

        # Prepare response data
        data = {
            "total_fees_collected": total_fees_collected,
            "total_outstanding_amount": total_outstanding_amount,
            "total_transaction_count": total_transaction_count
        }

        serializer = FinanceSummarySerializer(data)
        return Response(serializer.data)
    
class IsPrincipal(BasePermission):
    def has_permission(self, request, view):
        return Principal.objects.filter(user=request.user).exists()

@api_view(['GET'])
def dashboard_stats(request):
    # Check if user is a principal
    if not Principal.objects.filter(user=request.user).exists():
        return Response(
            {"error": "Access Denied. Only principals can view this data."}, 
            status=status.HTTP_403_FORBIDDEN
        )

    total_students = Student.objects.count()
    total_teachers = Teacher.objects.count()
    total_subjects = Subject.objects.count()
    total_classes = Class.objects.count()
    pending_leaves = LeaveApplication.objects.filter(status='Pending').count()
    exams_this_month = ExamDetail.objects.filter(
        exam_date__month=now().month, 
        exam_date__year=now().year
    ).count()

    data = {
        "total_students": total_students,
        "total_teachers": total_teachers,
        "total_subjects": total_subjects,
        "total_classes": total_classes,
        "pending_leaves": pending_leaves,
        "exams_this_month": exams_this_month,
    }
    
    return Response(data, status=status.HTTP_200_OK)