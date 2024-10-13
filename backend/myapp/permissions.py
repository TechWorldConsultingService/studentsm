from rest_framework.permissions import BasePermission

# Custom permission to check if the user is a student or teacher
class IsStudentOrTeacher(BasePermission):
    def has_permission(self, request, view):
        """
        Return True if the user is either a student or a teacher.
        """
        return request.user.is_student or request.user.is_teacher

# Custom permission to check if the user is a principal
class IsPrincipal(BasePermission):
    def has_permission(self, request, view):
        """
        Return True if the user is a principal.
        """
        return request.user.is_principal
