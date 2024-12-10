from django.contrib import admin

from .models import *

# Register your models here.
from django.contrib import admin
from .models import Teacher, Principal, Student, LeaveApplication, Subject, Class, DailyAttendance,Event, LessonAttendance, Post

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'creator', 'title', 'caption', 'created_at')  # Fields to display in the list view
    list_filter = ('creator', 'created_at')  # Add filters for easy navigation
    search_fields = ('title', 'caption', 'creator__username')  # Enable search by title, caption, or creator username
    ordering = ('-created_at',)  # Default ordering (newest posts first)
    date_hierarchy = 'created_at'  # Adds a date-based drill-down for `created_at`

class TeacherAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'get_first_name', 'phone', 'address', 'gender', 'class_teacher')
    search_fields = ('user__username', 'phone', 'address')
    list_filter = ('date_of_joining', 'gender')

    def get_first_name(self, obj):
        return obj.user.first_name  # Fetch first_name from the related User model
    get_first_name.short_description = 'First Name'

    # Custom display methods for Many-to-Many fields
    def get_subjects(self, obj):
        return ", ".join([subject.subject_name for subject in obj.subjects.all()])
    get_subjects.short_description = 'Subjects'

    def get_classes(self, obj):
        return ", ".join([class_obj.class_name for class_obj in obj.classes.all()])
    get_classes.short_description = 'Classes'

# Principal admin customization
class PrincipalAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'phone', 'address', 'gender')
    search_fields = ('user__username', 'phone', 'address')
    list_filter = ('gender',)

# Student admin customization
class StudentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'phone', 'address', 'date_of_birth', 'gender', 'class_code')
    search_fields = ('user__username', 'phone', 'address')
    list_filter = ['class_code']

# LeaveApplication admin customization
class LeaveApplicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'applicant','applicant_name', 'applicant_type', 'applied_on', 'leave_date', 'status')
    search_fields = ('applicant__username', 'message')
    list_filter = ('status', 'applied_on', 'leave_date')

# Subject admin customization
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'subject_name', 'subject_code')
    search_fields = ('subject_name', 'subject_code')

# Class admin customization
class ClassAdmin(admin.ModelAdmin):
    list_display = ('id', 'class_name', 'class_code')
    search_fields = ('class_name', 'class_code')

# DailyAttendance admin customization
class DailyAttendanceAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'date', 'status')
    list_filter = ('date', 'status')
    search_fields = ('student__user__username',)

# LessonAttendance admin customization
class LessonAttendanceAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'subject', 'date', 'status')
    list_filter = ('date', 'status', 'subject')
    search_fields = ('student__user__username', 'subject__name')

class EventAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'start_time', 'end_time')
    list_filter = ('title', 'description')
    # search_fields = ('student__user__username', 'subject__name')

class StaffAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'phone', 'address', 'gender', 'role', 'date_of_joining')
    search_fields = ('user__username', 'phone', 'address', 'role')
    list_filter = ('gender', 'role', 'date_of_joining')

class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'description', 'subject')  # Columns to display in the list view
    # list_filter = ('subject','student')  # Filters for the sidebar
    search_fields = ('title', 'subject')  # Searchable fields

class SyllabusAdmin(admin.ModelAdmin):
    list_display = ('class_assigned', 'subject', 'teacher', 'completion_percentage', 'created_at', 'updated_at')
    search_fields = ('class_assigned__class_name', 'subject__subject_name', 'teacher__user__username', 'topics')
    list_filter = ('class_assigned', 'subject', 'teacher', 'created_at', 'updated_at')
    readonly_fields = ('completion_percentage', 'created_at', 'updated_at')

    def completion_percentage(self, obj):
        return obj.get_completion_percentage()
    completion_percentage.short_description = 'Completion (%)'

class FeePaymentHistoryInline(admin.TabularInline):
    model = FeePaymentHistory
    extra = 0
    readonly_fields = ['payment_date']
    fields = ['amount_paid', 'payment_date', 'mode_of_payment', 'transaction_id', 'notes']

@admin.register(Fees)
class FeesAdmin(admin.ModelAdmin):
    list_display = ['student', 'total_amount', 'amount_paid', 'pending_amount', 'due_date', 'status']
    list_filter = ['status', 'due_date']
    search_fields = ['student__user__username', 'student__user__email']
    readonly_fields = ['pending_amount', 'status', 'created_at', 'updated_at']
    inlines = [FeePaymentHistoryInline]

    def get_queryset(self, request):
        """
        Customize queryset to prefetch related student data for efficiency.
        """
        queryset = super().get_queryset(request)
        return queryset.select_related('student__user')

@admin.register(FeePaymentHistory)
class FeePaymentHistoryAdmin(admin.ModelAdmin):
    list_display = ['fee_record', 'amount_paid', 'payment_date', 'mode_of_payment', 'transaction_id']
    list_filter = ['mode_of_payment', 'payment_date']
    search_fields = ['fee_record__student__user__username', 'transaction_id']

# Registering models
admin.site.register(Teacher, TeacherAdmin)
admin.site.register(Principal, PrincipalAdmin)
admin.site.register(Student, StudentAdmin)
admin.site.register(LeaveApplication, LeaveApplicationAdmin)
admin.site.register(Subject, SubjectAdmin)
admin.site.register(Class, ClassAdmin)
admin.site.register(DailyAttendance, DailyAttendanceAdmin)
admin.site.register(LessonAttendance, LessonAttendanceAdmin)
admin.site.register(Event, EventAdmin)
admin.site.register(Staff, StaffAdmin)
admin.site.register(Assignment, AssignmentAdmin)
admin.site.register(Syllabus, SyllabusAdmin)

