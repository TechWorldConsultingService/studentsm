
from django.contrib import admin
from django.urls import path,include
from . import views

from .views import *

urlpatterns = [
    # Admin site URL
    path('dashboard/', admin.site.urls),  # URL for the Django admin dashboard

    # Login page URL
    # path('', views.login, name='login'),  # URL for the login page, mapped to the `login` view function
    path('api/login/', views.login, name='login'),  # URL for the login page, mapped to the `login` view function

    # API endpoints for user registration
    path('api/register/teacher/', RegisterTeacherView.as_view(), name='register-teacher'),  # URL for teacher registration API
    path('api/register/principal/', RegisterPrincipalView.as_view(), name='register-principal'),  # URL for principal registration API
    path('api/register/student/', RegisterStudentView.as_view(), name='register-student'),  # URL for student registration API
    
     # API endpoints for user lists
    path('api/teachers/', TeacherListView.as_view(), name='teacher-list'),  # Endpoint for listing teachers
    path('api/principals/', PrincipalListView.as_view(), name='principal-list'),  # Endpoint for listing principals
    path('api/students/', StudentListView.as_view(), name='student-list'),  # Endpoint for listing students

     # API endpoints for viewing details of a specific record
    path('api/teachers/<int:pk>/', TeacherDetailView.as_view(), name='teacher-detail'),  # Endpoint for viewing a specific teacher
    path('api/principals/<int:pk>/', PrincipalDetailView.as_view(), name='principal-detail'),  # Endpoint for viewing a specific principal
    path('api/students/<int:pk>/', StudentDetailView.as_view(), name='student-detail'),  # Endpoint for viewing a specific student

    # API endpoints for deleting a specific record
    path('api/teachers/<int:pk>/delete/', TeacherDeleteView.as_view(), name='teacher-delete'),  # Endpoint for deleting a specific teacher
    path('api/principals/<int:pk>/delete/', PrincipalDeleteView.as_view(), name='principal-delete'),  # Endpoint for deleting a specific principal
    path('api/students/<int:pk>/delete/', StudentDeleteView.as_view(), name='student-delete'),  # Endpoint for deleting a specific student

    # API endpoints for leave applications
    path('api/total-leave-applications/', TotalLeaveApplicationListView.as_view(), name='total-leave-application-list'),  # Endpoint for listing all leave applications for the principal
    path('api/leave-applications/', LeaveApplicationListView.as_view(), name='leave-application-list'),  # Endpoint for listing all leave applications for the current user
    path('api/leave-applications/create/', LeaveApplicationCreateView.as_view(), name='leave-application-create'),  # Endpoint for creating a new leave application
    path('api/leave-applications/<int:pk>/', LeaveApplicationDetailView.as_view(), name='leave-application-detail'),  # Endpoint for retrieving details of a specific leave application by ID
    path('api/leave-applications/<int:pk>/delete/', LeaveApplicationDeleteView.as_view(), name='leave-application-delete'),  # Endpoint for deleting a specific leave application by ID
]


