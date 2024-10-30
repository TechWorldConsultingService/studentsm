from django.shortcuts import render
from django.contrib.auth import authenticate, login as auth_login
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
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

User = get_user_model()


# def get_user_role(user):
#     if user.is_principal:
#         return "principal"
#     elif user.is_teacher:
#         return "teacher"
#     elif user.is_master:
#         return "master"
#     elif user.is_student:
#         return "student"
#     return "unknown"
def get_user_role(user):
    if getattr(user, 'is_principal', False):
        return "principal"
    elif getattr(user, 'is_teacher', False):
        return "teacher"
    elif getattr(user, 'is_master', False):
        return "master"
    elif getattr(user, 'is_student', False):
        return "student"
    return "unknown"

@csrf_exempt
def login(request):
    if request.method == "POST":

        try:
            body = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'msg': 'Invalid JSON data'}, status=400)


        username = body.get('username')
        password = body.get('password')
        


        print(f"Username: {username}, Password: {password}")
        user = authenticate(request, username=username, password=password)
        print(user)
  
        if user is not None:
            auth_login(request,user)
            #role-base redirection or success message
            role = get_user_role(user)

            if role == 'principal':
                #redirect to principal dashboard
                return JsonResponse({
                    'msg':  'Login Successful',
                    'role': role,
                    'username':username,
                    # 'redirect': '/principaldashboard',
                })
            elif role == 'student':
                #redirect to student dashboard
                return JsonResponse({
                    'msg':  'Login Successful',
                    'role': role,
                    'username':username,
                    # 'phone':phone,
                    'email':user.email,
                    'first_name':user.first_name,
                    'last_name':user.last_name,
                    # 'address':'nepal',
                    'address':'nepal'



                    # 'redirect': '/studentdashboard'
                })
            elif role == 'teacher':
                #redirect to teacher dashboard
                return JsonResponse({
                    'msg':  'Login Successful',
                    'role': role,
                    # 'redirect': '/teacherdashboard'
                })
            else:
                return JsonResponse({
                    'msg': 'Login Successful',
                    'role':role,
                    # 'redirect':'/masterdashboard'
                },status=200)            
        else:
            # return render(request,'myapp/login.html')
            return JsonResponse({'msg': 'Invalid credentials'}, status=401)
    return render(request, 'myapp/login.html')

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
            
            teacher_data = {
                'phone': request.data.get('phone'),
                'address': request.data.get('address'),
                'date_of_joining': request.data.get('date_of_joining'),
                'gender': request.data.get('gender'),
                'user': user_data
            }
        
        # Serialize teacher data and validate
        teacher_serializer = TeacherSerializer(data=teacher_data)
        
        if teacher_serializer.is_valid():
            # Save the teacher instance and return success response
            teacher = teacher_serializer.save()
            teacher.user.is_teacher = True

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
                'user': user_data
            }
        
        # Serialize student data and validate
        student_serializer = StudentSerializer(data=student_data)
        
        if student_serializer.is_valid():
            # Save the student instance and return success response
            student = student_serializer.save()
            student.user.is_student = True
            return Response(student_serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Return error response if validation fails
            return Response(student_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
        students = Student.objects.all()  # Retrieve all student instances
        serializer = StudentSerializer(students, many=True)  # Serialize the student data
        return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data with 200 OK status
    

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
        
# API view to list all leave applications for the principal
class TotalLeaveApplicationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        """
        Handle GET requests to retrieve all leave applications for the current user.
        """
        # Get all leave applications for the current user
        applications = LeaveApplication.objects.all()
        # Serialize the leave applications
        serializer = LeaveApplicationSerializer(applications, many=True)
        # Return the serialized data
        return Response(serializer.data)

# API view to list all leave applications for the current user
class LeaveApplicationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        """
        Handle GET requests to retrieve all leave applications for the current user.
        """
        # Get all leave applications for the current user
        applications = LeaveApplication.objects.filter(applicant=request.user)
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
            'applicant_type': applicant_type
        }

        # Create a new leave application for the current user
        serializer = LeaveApplicationSerializer(data=data)
        
        if serializer.is_valid():
            # Save the leave application
            leave_application = serializer
            leave_application.save()
            # Return the serialized data
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # Return validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API view to retrieve details of a specific leave application
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

# API view to delete a specific leave application
class LeaveApplicationDeleteView(APIView):
    permission_classes = [IsAuthenticated]

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
            # Save the new Subject instance
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
            # Save the updated Subject instance
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
 

class ClassListCreateView(APIView):
    """
    API view to list all classes or create a new class.
    """

    def get(self, request, format=None):
        """
        Handle GET requests to retrieve a list of all classes.
        """
        # Retrieve all instances of the Class model
        classes = Class.objects.all()
        
        # Serialize the list of Class instances into JSON format
        serializer = ClassSerializer(classes, many=True)
        
        # Return the serialized data with an HTTP 200 OK status
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        """
        Handle POST requests to create a new Class instance.
        """
        # Deserialize incoming data into a ClassSerializer instance
        serializer = ClassSerializer(data=request.data)
        
        # Check if the provided data is valid according to the ClassSerializer
        if serializer.is_valid():
            # Save the new Class instance to the database
            serializer.save()
            
            # Return the serialized data for the created instance with HTTP 201 Created status
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # Return validation errors with HTTP 400 Bad Request status if data is invalid
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ClassDetailView(APIView):
    """
    API view to retrieve, update, or delete a specific class by primary key.
    """

    def get(self, request, pk, format=None):
        """
        Handle GET requests to retrieve the details of a specific Class by primary key.
        """
        # Retrieve the Class instance by primary key or return 404 if not found
        class_instance = get_object_or_404(Class, pk=pk)
        
        # Serialize the retrieved Class instance into JSON format
        serializer = ClassSerializer(class_instance)
        
        # Return the serialized data with HTTP 200 OK status
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk, format=None):
        """
        Handle PUT requests to update a specific Class by primary key.
        """
        # Retrieve the Class instance by primary key or return 404 if not found
        class_instance = get_object_or_404(Class, pk=pk)
        
        # Deserialize and validate the provided data for updating the Class instance
        serializer = ClassSerializer(class_instance, data=request.data)
        
        # Check if the provided data is valid according to the ClassSerializer
        if serializer.is_valid():
            # Save the updated Class instance to the database
            serializer.save()
            
            # Return the serialized data for the updated instance with HTTP 200 OK status
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        # Return validation errors with HTTP 400 Bad Request status if data is invalid
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        """
        Handle DELETE requests to remove a specific Class by primary key.
        """
        # Retrieve the Class instance by primary key or return 404 if not found
        class_instance = get_object_or_404(Class, pk=pk)
        
        # Delete the retrieved Class instance from the database
        class_instance.delete()
        
        # Return a success message with HTTP 204 No Content status, as no further content is needed
        return Response({"message": "Class successfully deleted"}, status=status.HTTP_204_NO_CONTENT)