from django.contrib import admin
from django import forms

from .models import (
    Teacher, Principal, Student, LeaveApplication, Subject, 
    Class, DailyAttendance, Event, LessonAttendance, Post, 
    # StaffLocation, 
    Staff, Assignment, Syllabus, Fees, FeePaymentHistory, DiscussionPost, DiscussionComment,
)

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'creator', 'title', 'caption', 'created_at')  # Fields to display in the list view
    list_filter = ('creator', 'created_at')  # Add filters for easy navigation
    search_fields = ('title', 'caption', 'creator__username')  # Enable search by title, caption, or creator username
    ordering = ('-created_at',)  # Default ordering (newest posts first)
    date_hierarchy = 'created_at'  # Adds a date-based drill-down for `created_at`

@admin.register(Teacher)
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
@admin.register(Principal)
class PrincipalAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'phone', 'address', 'gender')
    search_fields = ('user__username', 'phone', 'address')
    list_filter = ('gender',)

# Student admin customization
@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'phone', 'address', 'date_of_birth', 'gender', 'class_code')
    search_fields = ('user__username', 'phone', 'address')
    list_filter = ['class_code']


# LeaveApplication admin customization
@admin.register(LeaveApplication)
class LeaveApplicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'applicant','applicant_name', 'applicant_type', 'applied_on', 'leave_date', 'status')
    search_fields = ('applicant__username', 'message')
    list_filter = ('status', 'applied_on', 'leave_date')

# Subject admin customization
@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'subject_name', 'subject_code')
    search_fields = ('subject_name', 'subject_code')

# Class admin customization
@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ('id', 'class_name', 'class_code')
    search_fields = ('class_name', 'class_code')

# DailyAttendance admin customization
@admin.register(DailyAttendance)
class DailyAttendanceAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'date', 'status')
    list_filter = ('date', 'status')
    search_fields = ('student__user__username',)

# LessonAttendance admin customization
@admin.register(LessonAttendance)
class LessonAttendanceAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'subject', 'date', 'status')
    list_filter = ('date', 'status', 'subject')
    search_fields = ('student__user__username', 'subject__name')

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'start_time', 'end_time')
    list_filter = ('title', 'description')
    # search_fields = ('student__user__username', 'subject__name')

@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'phone', 'address', 'gender', 'role', 'date_of_joining')
    search_fields = ('user__username', 'phone', 'address', 'role')
    list_filter = ('gender', 'role', 'date_of_joining')


class AssignmentForm(forms.ModelForm):
    class Meta:
        model = Assignment
        fields = ['teacher','class_assigned','subject','assignment_name','description','due_date']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Default queryset for subject
        self.fields['subject'].queryset = Subject.objects.none()

        if 'teacher' in self.data and 'class_assigned' in self.data:
            try:
                teacher_id = int(self.data.get('teacher'))
                class_id = int(self.data.get('class_assigned'))
                teacher = Teacher.objects.get(id=teacher_id)
                print("teacherr:",teacher)
                class_obj = Class.objects.get(id=class_id)
                # Filter subjects: taught by the teacher AND available in the class
                self.fields['subject'].queryset = Subject.objects.filter(teachers=teacher,classes=class_obj)

            except (ValueError, TypeError, Teacher.DoesNotExist, Class.DoesNotExist):
                pass
        elif self.instance.pk:
            # Populate when editing an existing assignment
            teacher = self.instance.teacher
            class_obj = self.instance.class_assigned
            # self.fields['subject'].queryset = Teacher.objects.filter(classes=class_obj).values_list("subjects",flat=True)
            self.fields['subject'].queryset = Subject.objects.filter(teachers=teacher,classes=class_obj)


            # self.fields['teacher'].queryset = Teacher.objects.filter(classes=class_obj).values_list("teacher",flat=True)
            self.fields['teacher'].queryset = Teacher.objects.filter(classes=class_obj)

    def clean(self):
        cleaned_data = super().clean()
        teacher = cleaned_data.get('teacher')
        class_assigned = cleaned_data.get('class_assigned')
        subject = cleaned_data.get('subject')

        if subject and not subject.classes.filter(id=class_assigned.id).exists():
            raise forms.ValidationError("The selected subject is not available in the assigned class.")
        return cleaned_data
        
@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    form = AssignmentForm  # Link the custom form
    list_display = ('id', 'description', 'subject')  # Columns to display in the list view
    # list_filter = ('subject','student')  # Filters for the sidebar
    search_fields = ('title', 'subject')  # Searchable fields

@admin.register(Syllabus)
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


# @admin.register(StaffLocation)
# class StaffLocationAdmin(admin.ModelAdmin):
#     list_display = ['staff','latitude','altitude']



# DiscussionPost admin customization
@admin.register(DiscussionPost)
class DiscussionPostAdmin(admin.ModelAdmin):
    list_display = ('id', 'topic', 'created_by', 'created_at')  # Fields displayed in the admin list view
    list_filter = ('created_at', 'topic')  # Filters on the sidebar
    search_fields = ('topic__title', 'content', 'created_by__username')  # Search functionality

# DiscussionComment admin customization
@admin.register(DiscussionComment)
class DiscussionCommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'post', 'created_by', 'parent', 'created_at')  # Fields displayed in the admin list view
    list_filter = ('created_at', 'post')  # Filters on the sidebar
    search_fields = ('post__content', 'content', 'created_by__username')  # Search functionality