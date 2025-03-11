from rest_framework import generics, permissions
from rest_framework.permissions import BasePermission
from .models import Post
from .serializers import PostSerializer
from django.core.exceptions import PermissionDenied


# Custom permission to check if the user is a student or teacher
class IsStudentOrTeacher(BasePermission):
    """
    Allow access to students and teachers.
    """

    def has_permission(self, request, view):
        return hasattr(request.user, 'student') or hasattr(request.user, 'teacher')

# Custom permission to check if the user is a principal
class IsPrincipal(BasePermission):
    """
    Allow only principals to access certain views.
    """

    def has_permission(self, request, view):
        return hasattr(request.user, 'principal')


class IsPrincipalOrTeacher(BasePermission):
    """
    Custom permission to allow only principals and teachers to create posts.
    """
    def has_permission(self, request, view):
        return hasattr(request.user, 'principal') or hasattr(request.user, 'teacher')

class IsTeacher(BasePermission):
    """
    Allow only teachers to access certain views.
    """

    def has_permission(self, request, view):
        return hasattr(request.user, 'teacher')

class IsStudent(BasePermission):
    """
    Allow only students to upload their assignments.
    """

    def has_permission(self, request, view):
        # Allow only students
        return hasattr(request.user, 'student')