from django.contrib import admin

from .models import *

# Register your models here.
from django.contrib import admin
from .models import Teacher, Principal, Student, LeaveApplication, Subject, Class, DailyAttendance, LessonAttendance

# Teacher admin customization
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'phone', 'address', 'date_of_joining', 'gender')
    search_fields = ('user__username', 'phone', 'address')
    list_filter = ('date_of_joining', 'gender')

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
    list_display = ('id', 'user', 'phone', 'address', 'date_of_birth', 'gender', 'classes')
    search_fields = ('user__username', 'phone', 'address')
    list_filter = ('classes', 'gender')

# LeaveApplication admin customization
class LeaveApplicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'applicant', 'applicant_type', 'applied_on', 'leave_date', 'status')
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

# Registering models
admin.site.register(Teacher, TeacherAdmin)
admin.site.register(Principal, PrincipalAdmin)
admin.site.register(Student, StudentAdmin)
admin.site.register(LeaveApplication, LeaveApplicationAdmin)
admin.site.register(Subject, SubjectAdmin)
admin.site.register(Class, ClassAdmin)
admin.site.register(DailyAttendance, DailyAttendanceAdmin)
admin.site.register(LessonAttendance, LessonAttendanceAdmin)

