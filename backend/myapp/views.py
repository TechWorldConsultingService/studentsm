from django.shortcuts import render
from django.contrib.auth import authenticate, login as auth_login
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,permissions
from django.contrib.auth.models import User
from .models import *
from .models import Class,Subject,Fees,Teacher
from .serializers import * 
from .serializers import FeesSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import *
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
import json
from django.utils.dateparse import parse_date
from rest_framework.exceptions import NotFound
from rest_framework.generics import UpdateAPIView
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView


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
        # Determine if the request data is in JSON format or form-data
        if request.content_type == 'application/json':
            # Handle JSON data
            user_data = request.data.get('user')
            if not user_data:
                # Return an error if user data is missing
                return Response({"error": "User data not provided"}, status=status.HTTP_400_BAD_REQUEST)
            
            student_data = request.data
        else:
            # Handle form-data
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
                'user': user_data,
            }
        
        # Serialize student data and validate
        student_serializer = StudentSerializer(data=student_data)
        
        if student_serializer.is_valid():
            # Save the student instance and return success response
            student = student_serializer.save()
            student.user.is_student = True
            student.user.save()
            
            return Response(student_serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Return error response if validation fails
            return Response(student_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View for handling staff registration
class RegisterStaffView(APIView):
    def post(self, request, format=None):
        # Determine if the request data is in JSON format or form-data
        if request.content_type == 'application/json':
            # Handle JSON data
            user_data = request.data.get('user')
            if not user_data:
                # Return an error if user data is missing
                return Response({"error": "User data not provided"}, status=status.HTTP_400_BAD_REQUEST)

            staff_data = request.data
        else:
            # Handle form-data
            user_data = {
                'username': request.data.get('user.username'),
                'password': request.data.get('user.password'),
                'email': request.data.get('user.email'),
                'first_name': request.data.get('user.first_name'),
                'last_name': request.data.get('user.last_name'),
            }

            staff_data = {
                'phone': request.data.get('phone'),
                'address': request.data.get('address'),
                'date_of_joining': request.data.get('date_of_joining'),
                'gender': request.data.get('gender'),
                'role': request.data.get('role'),
                'user': user_data,
            }

        # Serialize staff data and validate
        staff_serializer = StaffSerializer(data=staff_data)

        if staff_serializer.is_valid():
            # Save the staff instance and return success response
            staff = staff_serializer.save()
            staff.user.is_staff = True
            staff.user.save()

            return Response(staff_serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Return error response if validation fails
            return Response(staff_serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# API view to list all teachers
class TeacherListView(APIView):
    def get(self, request, format=None):
        teachers = Teacher.objects.all()  # Retrieve all teacher instances
        serializer = TeacherSerializer(teachers, many=True)  # Serialize the teacher data
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

        # Retrieve class ID from query parameters
        class_id = request.query_params.get('class_id')

        if class_id:
            # Filter students by class if class_id is provided
            students = Student.objects.filter(classes__id=class_id)
        else:
            # Retrieve all students if no class_id is provided
            students = Student.objects.all()

        # students = Student.objects.all()  # Retrieve all student instances
        serializer = StudentSerializer(students, many=True)  # Serialize the student data
        return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data with 200 OK status

# List all staff members
class StaffListView(APIView):
    """
    Handle GET requests to list all staff members.
    """
    def get(self, request, format=None):
        staff = Staff.objects.all()  # Retrieve all staff records
        serializer = StaffSerializer(staff, many=True)  # Serialize the data for multiple staff records
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
            serializer = TeacherSerializer(teacher)
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
            serializer = StudentSerializer(student)
            # Return serialized data with 200 OK status
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Student.DoesNotExist:
            # Return error message with 404 Not Found status if Student does not exist
            return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)
        

# Retrieve specific staff member details
class StaffDetailView(APIView):
    """
    Handle GET requests to retrieve details of a specific staff member by primary key.
    """
    def get(self, request, pk, format=None):
        try:
            staff = Staff.objects.get(pk=pk)  # Retrieve staff record by primary key
            serializer = StaffSerializer(staff)  # Serialize the staff data
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Staff.DoesNotExist:
            # Return an error response if staff member is not found
            return Response({"error": "Staff not found"}, status=status.HTTP_404_NOT_FOUND)

        

# API view to delete specific teacher
class TeacherDeleteView(APIView):
    def delete(self, request, pk, format=None):
        """
        Handle DELETE requests to remove a specific Teacher by primary key.
        """
        try:
            # Retrieve the Teacher instance by primary key
            teacher = Teacher.objects.get(pk=pk)
            # Delete the Teacher instance
            teacher.delete()
            # Return success message with 204 No Content status
            return Response({"message": "Teacher deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Teacher.DoesNotExist:
            # Return error message with 404 Not Found status if Teacher does not exist
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
class StaffDeleteView(APIView):
    """
    Handle DELETE requests to delete a specific staff member by primary key.
    """
    def delete(self, request, pk, format=None):
        try:
            staff = Staff.objects.get(pk=pk)  # Retrieve staff record by primary key
            staff.delete()  # Delete the staff record
            return Response({"message": "Staff deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Staff.DoesNotExist:
            # Return an error response if staff member is not found
            return Response({"error": "Staff not found"}, status=status.HTTP_404_NOT_FOUND)
        

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

# API view to update staff info
class StaffUpdateAPIView(APIView):
    def put(self, request, pk):
        try:
            # Try to retrieve the staff object by primary key (pk)
            staff = Staff.objects.get(pk=pk)
        except Staff.DoesNotExist:
            # Return an error response if the staff does not exist
            return Response({"error": "Staff not found."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the incoming data, allowing partial updates
        serializer = StaffSerializer(staff, data=request.data, partial=True)
        if serializer.is_valid():
            # If the data is valid, save the updated staff instance
            staff = serializer.save()
            # Return the updated staff's data in the response
            return Response(StaffSerializer(staff).data)
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
        
# API view to list all leave applications for the principal
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from .models import LeaveApplication
# from .serializers import LeaveApplicationSerializer

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
            # print(f"Teacher's class_teacher: {teacher.class_teacher}")

            # Filter leave applications for students in the teacher's class
            leave_applications = LeaveApplication.objects.filter(
                applicant_type="Student", 
                applicant__in=Student.objects.filter(class_code=teacher.class_teacher).values_list('user', flat=True)
                # applicant__student__classes=teacher.class_teacher
            )
            # print(f"Leave applications for teacher: {leave_applications}")
            
        elif role == 'Student':
            # Students can view only their leave applications
            # leave_applications = LeaveApplication.objects.filter(applicant=user)
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
        Handle GET requests to retrieve all leave applications for the current user.
        """
        try:
            student = Student.objects.get(user=request.user)
        except Student.DoesNotExist:
            return Response(
                {"error": "No student profile associated with the current user."},
                status=404,
            )

        # Get all leave applications for the current user
        applications = LeaveApplication.objects.filter(applicant=student.user)
        # Serialize the leave applications
        serializer = LeaveApplicationSerializer(applications, many=True)
        # Return the serialized data
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
    def get(self, request, format=None):
        """
        Handle GET requests to retrieve a list of all subjects.
        """
        subjects = Subject.objects.all()  # Retrieve all Subject instances
        serializer = SubjectSerializer(subjects, many=True)  # Serialize Subject data
        return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data with 200 OK status

    def post(self, request, format=None):
        """
        Handle POST requests to create a new Subject instance.
        """
        serializer = SubjectSerializer(data=request.data)  # Deserialize Subject data
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Return serialized data with 201 Created status
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Return validation errors with 400 Bad Request status

# API view to retrieve, update, or delete a specific subject
class SubjectDetailView(APIView):
    def get(self, request, pk, format=None):
        """
        Handle GET requests to retrieve the details of a specific Subject by primary key.
        """
        subject = get_object_or_404(Subject, pk=pk)  # Retrieve the Subject instance by primary key
        serializer = SubjectSerializer(subject)  # Serialize the Subject instance
        return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data with 200 OK status

    def put(self, request, pk, format=None):
        """
        Handle PUT requests to update a specific Subject by primary key.
        """
        subject = get_object_or_404(Subject, pk=pk)  # Retrieve the Subject instance by primary key
        serializer = SubjectSerializer(subject, data=request.data)  # Deserialize and validate data for updating
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data with 200 OK status
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Return validation errors with 400 Bad Request status

    def delete(self, request, pk, format=None):
        """
        Handle DELETE requests to remove a specific Subject by primary key.
        """
        subject = get_object_or_404(Subject, pk=pk)  # Retrieve the Subject instance by primary key
        subject.delete()  # Delete the Subject instance
        return Response({"message": "Subject successfully deleted"}, status=status.HTTP_204_NO_CONTENT)  # Return success message with 204 No Content status


# API view to list all classes or create a new class
class ClassListCreateView(APIView):
    def get(self, request, format=None):
        """
        Handle GET requests to retrieve a list of all classes.
        """
        classes = Class.objects.all()  # Retrieve all Class instances
        serializer = ClassSerializer(classes, many=True)  # Serialize Class data
        return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data with 200 OK status

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
    # def get(self, request, pk, format=None):
    def get(self, request, class_code, format=None):
        """
        Handle GET requests to retrieve the details of a specific Class by primary key.
        """
        # class_instance = get_object_or_404(Class, pk=pk)  # Retrieve the Class instance by class_code
        class_instance = get_object_or_404(Class, class_code=class_code)  # Retrieve the Class instance by class_code
        serializer = ClassSerializer(class_instance)  # Serialize the Class instance
        return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data with 200 OK status

    # def put(self, request, pk, format=None):
    def put(self, request, class_code, format=None):
        """
        Handle PUT requests to update a specific Class by primary key.
        """
        class_instance = get_object_or_404(Class, class_code=class_code)  # Retrieve the Class instance by primary key
        serializer = ClassSerializer(class_instance, data=request.data)  # Deserialize and validate data for updating
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data with 200 OK status
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Return validation errors with 400 Bad Request status

    # def delete(self, request, pk, format=None):
    def delete(self, request, class_code, format=None):
        """
        Handle DELETE requests to remove a specific Class by primary key.
        """
        class_instance = get_object_or_404(Class, class_code=class_code)  # Retrieve the Class instance by primary key
        class_instance.delete()  # Delete the Class instance
        return Response({"message": "Class successfully deleted"}, status=status.HTTP_204_NO_CONTENT)  # Return success message with 204 No Content status



# Daily Attendance API View
class DailyAttendanceView(APIView):
    def post(self, request, class_id, format=None):
        """
        Record daily attendance for all students in a specific class.
        """
        students = Student.objects.filter(classes__id=class_id)
        attendance_data = request.data.get('attendance', [])
        
        for data in attendance_data:
            data['date'] = timezone.now().date()  # Today's date for daily attendance
            serializer = DailyAttendanceSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Daily attendance recorded successfully."}, status=status.HTTP_201_CREATED)

    def get(self, request, class_id, date=None, format=None):
        """
        Retrieve daily attendance records for a specific class and optionally filter by date.
        """
        students = Student.objects.filter(classes__id=class_id)
        attendance = DailyAttendance.objects.filter(student__in=students)

        if date:
            attendance_date = parse_date(date)
            if attendance_date:
                attendance = attendance.filter(date=attendance_date)
            else:
                return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = DailyAttendanceSerializer(attendance, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Lesson Attendance API View
class LessonAttendanceView(APIView):
    def post(self, request, class_id, subject_id, format=None):
        """
        Record lesson-wise attendance for all students in a specific class and subject.
        """
        students = Student.objects.filter(classes__id=class_id)
        attendance_data = request.data.get('attendance', [])

        for data in attendance_data:
            data['subject'] = subject_id
            data['date'] = timezone.now().date()  # Today's date for lesson attendance
            serializer = LessonAttendanceSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Lesson attendance recorded successfully."}, status=status.HTTP_201_CREATED)

    def get(self, request, class_id, subject_id, date=None, format=None):
        """
        Retrieve lesson attendance records for a specific class, subject, and optionally filter by date.
        """
        students = Student.objects.filter(classes__id=class_id)
        attendance = LessonAttendance.objects.filter(student__in=students, subject__id=subject_id)

        if date:
            attendance_date = parse_date(date)
            if attendance_date:
                attendance = attendance.filter(date=attendance_date)
            else:
                return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = LessonAttendanceSerializer(attendance, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



from rest_framework import generics
from .models import Event,Assignment
from .serializers import EventSerializer
from rest_framework.permissions import IsAuthenticated

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

from .serializers import AssignmentSerializer

from rest_framework.permissions import AllowAny
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import AssignmentSerializer
from .models import Subject, Class

class AssignHomeworkView(APIView):
    """
    Allow teachers to assign homework to students of a specific class and subject.
    """
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        """
        Assign homework to a specific class and subject.
        """
        teacher = request.user

        # Use the serializer for validation and creation
        serializer = AssignmentSerializer(data=request.data)
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

            # Ensure teacher is authorized for the class
            if not hasattr(teacher, 'teacher') or not class_instance in teacher.teacher.classes.all():
                return Response(
                    {"error": f"You are not authorized to assign homework for the class '{class_instance.class_name}'."},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Save the assignment
            assignment = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # Return validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from rest_framework.views import APIView
from .models import Teacher, Class, Subject

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
        # Check if the student is trying to submit a valid assignment
        assignment_id = request.data.get('assignment_id')
        submission_file = request.FILES.get('submission_file')

        if not assignment_id:
            return Response(
                {"error": "Assignment ID are required."},
                status=status.HTTP_400_BAD_REQUEST)

        if not submission_file:
            return Response(
                {"error": "Submission file are required."},
                status=status.HTTP_400_BAD_REQUEST)

        assignment = get_object_or_404(Assignment, id=assignment_id)
        student = get_object_or_404(Student, user=request.user)

        if student.class_code != assignment.class_assigned:
            return Response(
                {"error": "This assignment is not for your class."}, 
                status=status.HTTP_403_FORBIDDEN)

        # Check if the student has already submitted
        if AssignmentSubmission.objects.filter(
            assignment=assignment,student=student
            ).exists():
            return Response(
                {"error": "You have already submitted this assignment."}, 
                status=status.HTTP_400_BAD_REQUEST)

        # Create submission
        submission = AssignmentSubmission.objects.create(
            assignment=assignment,
            student=student,  # Use CustomUser instance
            submission_file=submission_file
        )

        serializer = AssignmentSubmissionSerializer(submission)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

class ReviewAssignmentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        # user = request.user

        # Ensure the user is a teacher
        try:
            teacher = user.teacher # Assuming a OneToOneField relationship exists between Teacher and AUTH_USER_MODEL
        except Teacher.DoesNotExist:
            return Response({"error": "You are not authorized to view this content."}, status=status.HTTP_403_FORBIDDEN)

        # Fetch assignments related to the teacher's subjects
        # assignments = Assignment.objects.filter(subject__teachers=teacher_instance)
        assignments = Assignment.objects.filter(subject__teachers=teacher)

        # Prepare data for response
        data = []

        for assignment in assignments:
            submissions = AssignmentSubmission.objects.filter(assignment=assignment)
            data.append({
                "assignment": AssignmentSerializer(assignment).data,
                "submissions": AssignmentSubmissionSerializer(submissions, many=True).data
            })
        
        return Response(data, status=status.HTTP_200_OK)

class SyllabusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        syllabus = Syllabus.objects.all()
        serializer = SyllabusSerializer(syllabus, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
    # Ensure the logged-in user is a teacher
        if not hasattr(request.user, 'teacher'):
            return Response({"error": "Only teachers can create a syllabus."}, status=status.HTTP_403_FORBIDDEN)

        # Automatically set the teacher field to the logged-in user
        teacher = request.user.teacher

        # Fetch class and subject based on the provided IDs
        class_assigned_id = request.data.get('class_assigned')
        subject_id = request.data.get('subject')

        if not class_assigned_id or not subject_id:
            return Response(
                {"error": "Both 'class_assigned' and 'subject' fields are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            class_assigned = Class.objects.get(id=class_assigned_id)
            subject = Subject.objects.get(id=subject_id)
        except (Class.DoesNotExist, Subject.DoesNotExist) as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Prepare data for serialization
        data = request.data.copy()
        data['teacher'] = teacher.id

        serializer = SyllabusSerializer(data=data)

        if serializer.is_valid():
            serializer.save(class_assigned=class_assigned, subject=subject, teacher=teacher)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SyllabusPerClassView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, class_code, *args, **kwargs):
        try:
            # Fetch the Class object using the class_code
            class_instance = Class.objects.get(class_code=class_code)
            
            # Fetch the syllabus related to the class
            syllabus = Syllabus.objects.filter(class_assigned=class_instance)
            
            if not syllabus:
                return Response({"error": "Syllabus not found for this class."}, status=status.HTTP_404_NOT_FOUND)
            
            serializer = SyllabusSerializer(syllabus, many=True)
            return Response(serializer.data)

        except Class.DoesNotExist:
            return Response({"error": "Class with this code not found."}, status=status.HTTP_404_NOT_FOUND)

class SyllabusDetailView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk, *args, **kwargs):
        try:
            syllabus = Syllabus.objects.get(pk=pk)
        except Syllabus.DoesNotExist:
            return Response({"error": "Syllabus not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = SyllabusSerializer(syllabus)
        return Response(serializer.data)

    def patch(self, request, pk, *args, **kwargs):
        try:
            syllabus = Syllabus.objects.get(pk=pk)
        except Syllabus.DoesNotExist:
            return Response({"error": "Syllabus not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = SyllabusSerializer(syllabus, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class SyllabusUpdateView(UpdateAPIView):
    queryset = Syllabus.objects.all()
    serializer_class = SyllabusSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        """
        Perform the update while ensuring only the teacher who created the syllabus can update it.
        """
        syllabus = self.get_object()
        # Ensure the logged-in user is the teacher of the syllabus
        if self.request.user != syllabus.teacher.user:
            raise PermissionDenied("You do not have permission to update this syllabus.")
        serializer.save()

class SyllabusDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk=None, *args, **kwargs):
        # Check if a specific syllabus ID is provided
        if pk:
            try:
                syllabus = Syllabus.objects.get(pk=pk)
                # Ensure only the teacher who created the syllabus can delete it
                if request.user != syllabus.teacher.user:
                    return Response(
                        {"error": "You do not have permission to delete this syllabus."},
                        status=status.HTTP_403_FORBIDDEN
                    )
                syllabus.delete()
                return Response(
                    {"message": "Syllabus deleted successfully."},
                    status=status.HTTP_200_OK
                )
            except Syllabus.DoesNotExist:
                return Response({"error": "Syllabus not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            # For bulk delete, ensure the user is a teacher
            if not hasattr(request.user, 'teacher'):
                return Response(
                    {"error": "Only teachers can delete all syllabi."},
                    status=status.HTTP_403_FORBIDDEN
                )
            # Delete all syllabi created by the logged-in teacher
            teacher_syllabi = Syllabus.objects.filter(teacher=request.user.teacher)
            count = teacher_syllabi.delete()[0]  # delete() returns a tuple (number of objects deleted, _)
            return Response(
                {"message": f"Deleted {count} syllabus entries."},
                status=status.HTTP_200_OK
            )
        
# List and Create Fees
class FeeListCreateView(ListCreateAPIView):
    queryset = Fees.objects.all()
    serializer_class = FeesSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Retrieve, Update, and Delete Specific Fee
class FeeDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Fees.objects.all()
    serializer_class = FeesSerializer

    def get(self, request, pk, *args, **kwargs):
        fee = get_object_or_404(Fees, pk=pk)
        serializer = self.serializer_class(fee)
        return Response(serializer.data)

    def put(self, request, pk, *args, **kwargs):
        fee = get_object_or_404(Fees, pk=pk)
        serializer = self.serializer_class(fee, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        fee = get_object_or_404(Fees, pk=pk)
        fee.delete()
        return Response({"message": "Fee record deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

# List Fees for a Specific Student
class StudentFeeListView(ListAPIView):
    serializer_class = FeesSerializer

    def get_queryset(self):
        student_id = self.kwargs['student_id']
        return Fees.objects.filter(student_id=student_id)

    def get(self, request, student_id, *args, **kwargs):
        fees = self.get_queryset()
        serializer = self.serializer_class(fees, many=True)
        return Response(serializer.data)

# List Pending Fees for a Specific Student
class StudentPendingFeesView(ListAPIView):
    serializer_class = FeesSerializer

    def get_queryset(self):
        student_id = self.kwargs['student_id']
        return Fees.objects.filter(student_id=student_id, status='pending')

    def get(self, request, student_id, *args, **kwargs):
        pending_fees = self.get_queryset()
        serializer = self.serializer_class(pending_fees, many=True)
        return Response(serializer.data)
    
from rest_framework.permissions import AllowAny
class UpdateStaffLocationView(APIView):
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]

    def get(self, request):
        # locations = StaffLocation.objects.all()  # Assuming all staff locations
        # serializer = StaffLocationSerializer(locations, many=True)
        # return Response({"locations": serializer.data})
        staff_locations = StaffLocation.objects.all()
        locations = [
            {
                'staff': location.staff.user.username,
                'latitude': location.latitude,
                'longitude': location.longitude,
                'timestamp': location.timestamp
            }
            for location in staff_locations
            # print(locations)
        ]
        # data = {"message": "Staff locations retrieved successfully"}
        print(locations)

        return Response({"locations":locations})

    def post(self, request):
        serializer = StaffLocationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(staff=request.user.staff)
            return Response({"message": "Location updated successfully"})
        return Response(serializer.errors, status=400)