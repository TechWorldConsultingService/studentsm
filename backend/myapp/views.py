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
from django.utils.dateparse import parse_date
from rest_framework.exceptions import NotFound



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
                'classes': request.data.get('classes'),
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
        serializer = LeaveApplicationSerializer(data=data)
        
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


# API view to update the status of a leave application
class LeaveApplicationStatusUpdateView(APIView):

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
    def get(self, request, pk, format=None):
        """
        Handle GET requests to retrieve the details of a specific Class by primary key.
        """
        class_instance = get_object_or_404(Class, pk=pk)  # Retrieve the Class instance by primary key
        serializer = ClassSerializer(class_instance)  # Serialize the Class instance
        return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data with 200 OK status

    def put(self, request, pk, format=None):
        """
        Handle PUT requests to update a specific Class by primary key.
        """
        class_instance = get_object_or_404(Class, pk=pk)  # Retrieve the Class instance by primary key
        serializer = ClassSerializer(class_instance, data=request.data)  # Deserialize and validate data for updating
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data with 200 OK status
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Return validation errors with 400 Bad Request status

    def delete(self, request, pk, format=None):
        """
        Handle DELETE requests to remove a specific Class by primary key.
        """
        class_instance = get_object_or_404(Class, pk=pk)  # Retrieve the Class instance by primary key
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
from .models import Event
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


class AssignmentUploadView(APIView):

    def post(self, request, format=None):
        """
        Handle POST requests to upload an assignment.
        Automatically assigns the logged-in student.
        """
        serializer = AssignmentSerializer(data=request.data)
        if serializer.is_valid():
            # Automatically assign the student based on the logged-in user
            serializer.save(student=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class AssignmentListView(APIView):

    def get(self, request, format=None):
        """
        Retrieve a list of all assignments, optionally filtered by subject or student.
        """
        subject = request.query_params.get('subject', None)
        student = request.query_params.get('student', None)
        
        assignments = Assignment.objects.all()

        if subject:
            assignments = assignments.filter(subject=subject)

        if student:
            assignments = assignments.filter(student__id=student)

        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class AssignmentDetailView(APIView):
    def get(self, request, pk, format=None):
        """
        Retrieve a specific assignment by its primary key.
        """
        try:
            assignment = Assignment.objects.get(pk=pk)
        except Assignment.DoesNotExist:
            raise NotFound("Assignment not found.")

        serializer = AssignmentSerializer(assignment)
        return Response(serializer.data, status=status.HTTP_200_OK)