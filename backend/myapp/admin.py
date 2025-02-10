from django.contrib import admin
from django import forms
from .models import *

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
    list_display = ("student", "date", "status", "recorded_by")  # Display key fields
    list_filter = ("date", "status",)  # Use actual fields
    search_fields = ("student__user__username", "recorded_by__user__username")  # Search by student or teacher
    ordering = ("-date",)  # Show latest attendance first

    def student(self, obj):
        return obj.student.user.username  # Show student username

    def recorded_by(self, obj):
        return obj.recorded_by.user.username if obj.recorded_by else "N/A"  # Show teacher name

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

'''
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
    search_fields = ['fee_record__student__user__username', 'transaction_id'] '''


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



from .models import FeeCategory, FeeStructure, PaymentTransaction

# Admin configuration for FeeCategory
@admin.register(FeeCategory)
class FeeCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'amount', 'per_months')
    search_fields = ('name',)
    list_filter = ('per_months',)
    ordering = ('name',)
    fields = ('name', 'amount', 'per_months')


# Inline configuration for FeeCategory in FeeStructure
class FeeCategoryInline(admin.TabularInline):
    model = FeeStructure.fee_categories.through
    extra = 1


# Admin configuration for FeeStructure
@admin.register(FeeStructure)
class FeeStructureAdmin(admin.ModelAdmin):
    list_display = ('id', 'student_class', 'monthly_fee', 'total_fee')
    search_fields = ('student_class__class_name',)
    list_filter = ('student_class',)
    ordering = ('student_class',)
    fields = ('student_class', 'monthly_fee', 'fee_categories')
    inlines = [FeeCategoryInline]


# Admin configuration for PaymentTransaction
@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'payment_no', 'total_amount', 'paid_amount', 'remaining_dues', 'created_at')
    search_fields = ('payment_no', 'student__user__username', 'student__user__first_name')
    list_filter = ('created_at', 'student__class_code__class_name')  # Corrected field
    ordering = ('-created_at',)
    fields = ('student', 'months', 'fee_structure', 'total_amount', 'paid_amount', 'remaining_dues', 'payment_no', 'created_at')
    readonly_fields = ('total_amount', 'remaining_dues', 'payment_no', 'created_at')


from django.contrib import admin
from .models import Exam, ExamDetail, StudentResult
from django.contrib import admin

# Exam admin customization
@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')  # Display ID and name for exams
    search_fields = ('name',)  # Allow searching by exam name
    ordering = ('id',)  # Order by ID (default behavior)

# ExamDetail admin customization
@admin.register(ExamDetail)
class ExamDetailAdmin(admin.ModelAdmin):
    list_display = ('id', 'exam', 'subject', 'class_assigned', 'full_marks', 'pass_marks', 'exam_date', 'created_by')
    search_fields = ('exam__name', 'subject__subject_name', 'class_assigned__class_name', 'created_by__username')
    list_filter = ('exam', 'subject', 'class_assigned', 'exam_date')
    ordering = ('-exam_date',)

   



# StudentResult admin customization
@admin.register(StudentResult)
class StudentResultAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'get_student_name',
        'get_exam_name',
        'get_subject_name',
        'practical_marks',
        'theory_marks',
        'total_marks',
        'percentage',
        'gpa',
        'created_at',
    )  # Show key fields and computed values
    search_fields = (
        'student__user__username',
        'exam_detail__exam__name',
        'exam_detail__subject__subject_name',
    )  # Enable search by student, exam, and subject
    list_filter = ('exam_detail__exam', 'exam_detail__subject', 'created_at')  # Add useful filters
    ordering = ('-created_at',)  # Order by creation date (latest first)

    def get_student_name(self, obj):
        """Display the student's username."""
        return obj.student.user.username
    get_student_name.short_description = 'Student Name'

    def get_exam_name(self, obj):
        """Display the exam name."""
        return obj.exam_detail.exam.name
    get_exam_name.short_description = 'Exam Name'

    def get_subject_name(self, obj):
        """Display the subject name."""
        return obj.exam_detail.subject.subject_name
    get_subject_name.short_description = 'Subject Name'


@admin.register(StudentOverallResult)
class StudentOverallResultAdmin(admin.ModelAdmin):
    # Display these fields in the list view
    list_display = ('student', 'exam', 'total_marks_obtained', 'total_full_marks', 'percentage', 'gpa', 'grade', 'updated_at')

    # Add filters to make it easier to filter by specific fields
    list_filter = ('exam', 'grade', 'updated_at')

    # Enable search functionality for specific fields
    search_fields = ('student__user__username', 'exam__name')

    # Sort by most recent result


@admin.register(Notes)
class NotesAdmin(admin.ModelAdmin):
    list_display = ('title', 'chapter', 'subject', 'class_code', 'created_by', 'created_at')
    list_filter = ('subject', 'class_code', 'created_at', 'created_by')
    search_fields = ('title', 'chapter', 'description', 'created_by__username')
    readonly_fields = ('created_at',)