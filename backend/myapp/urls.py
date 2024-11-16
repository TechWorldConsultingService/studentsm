
from django.contrib import admin
from django.urls import path,include
from . import views

from .views import *

urlpatterns = [
    # Admin site URL
    # path('dashboard/', admin.site.urls),  # URL for the Django admin dashboard


    # API endpoints for user registration
    path('api/register/teacher/', RegisterTeacherView.as_view(), name='register-teacher'),  # URL for teacher registration API
    path('api/register/principal/', RegisterPrincipalView.as_view(), name='register-principal'),  # URL for principal registration API
    path('api/register/student/', RegisterStudentView.as_view(), name='register-student'),  # URL for student registration API
    path('api/register/staff/', RegisterStaffView.as_view(), name='register_staff'), # URL for staff registration API
    
     # API endpoints for user lists
    path('api/teachers/', TeacherListView.as_view(), name='teacher-list'),  # Endpoint for listing teachers
    path('api/principals/', PrincipalListView.as_view(), name='principal-list'),  # Endpoint for listing principals
    path('api/students/', StudentListView.as_view(), name='student-list'),  # Endpoint for listing students
    path('api/staffs/', StaffListView.as_view(), name='staff_list'), # Endpoint for listing staffs

     # API endpoints for viewing details of a specific record
    path('api/teachers/<int:pk>/', TeacherDetailView.as_view(), name='teacher-detail'),  # Endpoint for viewing a specific teacher
    path('api/principals/<int:pk>/', PrincipalDetailView.as_view(), name='principal-detail'),  # Endpoint for viewing a specific principal
    path('api/students/<int:pk>/', StudentDetailView.as_view(), name='student-detail'),  # Endpoint for viewing a specific student
    path('api/staff/<int:pk>/', StaffDetailView.as_view(), name='staff_detail'), # Endpoint for viewing a specific staff

    # API endpoints for deleting a specific record
    path('api/teachers/<int:pk>/delete/', TeacherDeleteView.as_view(), name='teacher-delete'),  # Endpoint for deleting a specific teacher
    path('api/principals/<int:pk>/delete/', PrincipalDeleteView.as_view(), name='principal-delete'),  # Endpoint for deleting a specific principal
    path('api/students/<int:pk>/delete/', StudentDeleteView.as_view(), name='student-delete'),  # Endpoint for deleting a specific student
    path('api/staff/<int:pk>/delete/', StaffDeleteView.as_view(), name='staff_delete'), # Endpoint for deleting a specific staff

    # API endpoints for leave applications
    path('api/total-leave-applications/', TotalLeaveApplicationListView.as_view(), name='total-leave-application-list'),  # Endpoint for listing all leave applications for the principal
    path('api/leave-applications/', LeaveApplicationListView.as_view(), name='leave-application-list'),  # Endpoint for listing all leave applications for the current user
    path('api/leave-applications/create/', LeaveApplicationCreateView.as_view(), name='leave-application-create'),  # Endpoint for creating a new leave application
    path('api/leave-applications/<int:pk>/', LeaveApplicationDetailView.as_view(), name='leave-application-detail'),  # Endpoint for retrieving details of a specific leave application by ID
    path('api/leave-applications/<int:pk>/delete/', LeaveApplicationDeleteView.as_view(), name='leave-application-delete'),  # Endpoint for deleting a specific leave application by ID

    # API endpoints for subjects
    path('api/subjects/', SubjectListCreateView.as_view(), name='subject-list-create'),  # Endpoint for listing and creating subjects
    path('api/subjects/<int:pk>/', SubjectDetailView.as_view(), name='subject-detail'),  # Endpoint for subject details, update, and delete

    # API endpoints for classes
    path('api/classes/', ClassListCreateView.as_view(), name='class-list-create'),  # Endpoint for listing and creating classes
    path('api/classes/<int:pk>/', ClassDetailView.as_view(), name='class-detail'),  # Endpoint for class details, update, and delete

    # Daily Attendance URLs
    path('api/classes/<int:class_id>/daily-attendance/', DailyAttendanceView.as_view(), name='daily-attendance-create'),
    path('api/classes/<int:class_id>/daily-attendance/<str:date>/', DailyAttendanceView.as_view(), name='daily-attendance-list'),

    # Lesson Attendance URLs
    path('api/classes/<int:class_id>/subjects/<int:subject_id>/lesson-attendance/', LessonAttendanceView.as_view(), name='lesson-attendance-create'),
    path('api/classes/<int:class_id>/subjects/<int:subject_id>/lesson-attendance/<str:date>/', LessonAttendanceView.as_view(), name='lesson-attendance-list'),

    path('api/events/', EventListView.as_view(), name='event-list'),
    path('api/events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),


     path('api/assignments/upload/', AssignmentUploadView.as_view(), name='assignment-upload'),  # For students to upload assignments
    path('api/assignments/', AssignmentListView.as_view(), name='assignment-list'),  # To list all assignments
    path('api/assignments/<int:pk>/', AssignmentDetailView.as_view(), name='assignment-detail'),  # For viewing a specific assignment

]


