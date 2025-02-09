from django.db import models
from django.conf import settings
from django.utils import timezone
from accounts.models import CustomUser
from django.utils.timezone import now
from decimal import Decimal
from django.core.exceptions import ValidationError

# For creating Post/reel type content
class Post(models.Model):
    POST_TYPES = [
        ('Congratulation', 'Congratulation'),
        ('Notice', 'Notice'),
        ('Event', 'Event'),
        ('General', 'General'),
    ]
    
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="posts")  #post to the user who created it.
    title = models.CharField(max_length=255)  #A concise title for the post
    caption = models.TextField(null=True, blank=True)  #Optional description for the post.
    post_type = models.CharField(max_length=50, choices=POST_TYPES, default='General')  #Categorizes the post (e.g., Congratulation, Notice, Event, General).
    image = models.ImageField(upload_to='posts/images/', null=True, blank=True) #Allows uploading of multimedia content (optional).
    video = models.FileField(upload_to='posts/videos/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True) # Automatically managed timestamps for auditing purposes
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} by {self.creator.username}"

class Policies(models.Model):
    policies = models.CharField(max_length=2000, unique=True)

class Subject(models.Model):
    subject_code = models.CharField(max_length=50, unique=True)
    subject_name = models.CharField(max_length=100)

    def __str__(self):
        return self.subject_name
    
class Class(models.Model):
    class_code = models.CharField(max_length=50, unique=True)
    class_name = models.CharField(max_length=100)
    subjects = models.ManyToManyField(Subject, related_name='classes')

    def __str__(self):
        return self.class_name
    
class Teacher(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15, unique=True)
    address = models.CharField(max_length=255)
    date_of_joining = models.DateField() 
    gender = models.CharField(max_length=6, choices=[('male', 'male'), ('female', 'female'), ('other', 'other')])
    subjects = models.ManyToManyField(Subject, related_name='teachers')
    classes = models.ManyToManyField(Class, related_name='teachers')
    class_teacher = models.ForeignKey(Class, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        # return self.user.username
        return self.user.username
    
    def delete(self, *args, **kwargs):
        self.user.delete()  # Delete the associated user
        super().delete(*args, **kwargs)  # Call the parent delete method

class Principal(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15, unique=True)
    address = models.CharField(max_length=255)
    gender = models.CharField(max_length=6, choices=[('male', 'male'), ('female', 'female'), ('other', 'other')])
   
    def __str__(self):
        return self.user.username

    def delete(self, *args, **kwargs):
        self.user.delete()  # Delete the associated user
        super().delete(*args, **kwargs)  # Call the parent delete method

class Student(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15, unique=True)
    address = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=6, choices=[('male', 'male'), ('female', 'female'), ('other', 'other')])
    parents = models.CharField(max_length=15)
    class_code = models.ForeignKey(Class, on_delete=models.SET_NULL, related_name='students', null=True, blank=True)
    roll_no = models.CharField(max_length=10, unique=True, null=True, blank=True)  # Add Roll Number Field

    def __str__(self):
        return f"User ID: {self.user.id}, Username: {self.user.username}"
    
    def delete(self, *args, **kwargs):
        self.user.delete()
        super().delete(*args, **kwargs)

class Staff(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15, unique=True)
    address = models.CharField(max_length=255)
    date_of_joining = models.DateField()
    gender = models.CharField(max_length=6, choices=[('male', 'male'), ('female', 'female'), ('other', 'other')])
    role = models.CharField(max_length=255)

    def __str__(self):
        return f"User ID: {self.user.id}, Username: {self.user.username}, Role: {self.role}"
    
    def delete(self, *args, **kwargs):
        self.user.delete()  # Delete the associated user
        super().delete(*args, **kwargs)  # Call the parent delete method

class LeaveApplication(models.Model):
    applicant_type = models.CharField(max_length=10)
    applicant_name = models.CharField(max_length=10)
    applicant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    applied_on = models.DateField(default=timezone.now)
    leave_date = models.DateField()
    message = models.TextField()
    status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Disapproved', 'Disapproved')], default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class DailyAttendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='daily_attendance')
    date = models.DateField(default=timezone.now)
    status = models.BooleanField(default=True)  # True = Present, False = Absent
    recorded_by = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, blank=True)  # Who took attendance?

    def __str__(self):
        return f"{self.student.user.username} - {self.date} - {'Present' if self.status else 'Absent'}"

from django.conf import settings

class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # If you want to track who created the event
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
class Assignment(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, null=True, blank=True, related_name='assignments')
    class_assigned = models.ForeignKey(Class, on_delete=models.CASCADE,blank=True, null=True, related_name="assignments")
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, blank=True, null=True, related_name="assignments" )
    assignment_name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    assigned_on = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField(null=True, blank=True)
    # submitted = models.BooleanField(default=False)  # To track whether a student has submitted their assignment
    
    def __str__(self):
        return f"{self.assignment_name} for {self.class_assigned.class_name} due {self.due_date}"

class AssignmentSubmission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name="submissions")
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="submissions")  # CustomUser reference
    submission_file = models.FileField(upload_to='assignments/', null=True, blank=True)
    written_submission = models.TextField(null=True, blank=True)  # field for written submissions
    submitted_on = models.DateTimeField(auto_now_add=True)
    review_text = models.TextField(null=True, blank=True)
    is_checked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.student.username} - {self.assignment.assignment_name}"    

class Syllabus(models.Model):
    class_assigned = models.ForeignKey(Class, on_delete=models.CASCADE, related_name="syllabus")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="syllabus")
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name="syllabus")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.class_assigned} - {self.subject} - {self.teacher.user.username}"

class Chapter(models.Model):
    syllabus = models.ForeignKey(Syllabus, on_delete=models.CASCADE, related_name="chapters")
    name = models.CharField(max_length=255)
    def __str__(self):
        return self.name

class Topic(models.Model):
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name="topics")
    name = models.CharField(max_length=255)
    is_completed = models.BooleanField(default=False)  # Mark topic completion
    def __str__(self):
        return self.name
    
class Subtopic(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name="subtopics")
    name = models.CharField(max_length=255)
    is_completed = models.BooleanField(default=False)  # Mark subtopic completion
    def __str__(self):
        return self.name

class DiscussionPost(models.Model):
    topic = models.CharField(max_length=255)
    content = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post by {self.created_by.username} in {self.topic}"

class DiscussionComment(models.Model):
    post = models.ForeignKey(DiscussionPost, on_delete=models.CASCADE, related_name="comments")
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name="replies")
    content = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.created_by.username} on {self.post.content[:20]}"


class FeeCategory(models.Model):
    name = models.CharField(max_length=100)  # e.g., Sports Fee, Exam Fee
    amount = models.DecimalField(max_digits=10, decimal_places=2)  # Amount for this fee
    per_months = models.BooleanField(default=True)  # Flag to decide if the fee is multiplied by months
    
    def __str__(self):
        return self.name

class FeeStructure(models.Model):
    student_class = models.ForeignKey('Class', on_delete=models.CASCADE)  # Class the fee structure belongs to
    monthly_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Renamed base_amount to monthly_fee
    fee_categories = models.ManyToManyField(FeeCategory)  # Many fee categories for each fee structure

    def __str__(self):
        return f"Fee Structure for {self.student_class.class_name}"

    def total_fee(self):
        # Ensure monthly_fee is not None and convert to Decimal
        monthly_fee = self.monthly_fee if self.monthly_fee is not None else Decimal('0.00')

        # Calculate total fee for all categories
        fee_categories_total = sum(fee.amount for fee in self.fee_categories.all())
        
        return monthly_fee + fee_categories_total

from decimal import Decimal
from django.utils.timezone import now

class PaymentTransaction(models.Model):
    MONTH_CHOICES = [
        ('Baisakh', 'Baisakh'),
        ('Jestha', 'Jestha'),
        ('Ashar', 'Ashar'),
        ('Shrawan', 'Shrawan'),
        ('Bhadra', 'Bhadra'),
        ('Ashwin', 'Ashwin'),
        ('Kartik', 'Kartik'),
        ('Mangsir', 'Mangsir'),
        ('Poush', 'Poush'),
        ('Magh', 'Magh'),
        ('Falgun', 'Falgun'),
        ('Chaitra', 'Chaitra'),
    ]

    student = models.ForeignKey('Student', on_delete=models.CASCADE)
    months = models.JSONField(default=list)  # Allow multiple months selection
    fee_structure = models.ForeignKey(FeeStructure, on_delete=models.CASCADE, null=True)
    other_fee = models.ForeignKey(FeeCategory, on_delete=models.CASCADE, null=True, blank=True)  # Additional fee
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, editable=False, default=0)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    remaining_dues = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    payment_no = models.CharField(max_length=20, unique=True, editable=False, default=None)

    def __str__(self):
        return f"Transaction {self.payment_no} for {self.student} ({self.total_amount})"


class Exam(models.Model):
    name = models.CharField(max_length=100)  # Example: "Mid-Term Exam 2024"
    is_timetable_published = models.BooleanField(default=False)  # Flag for timetable publication
    is_result_published = models.BooleanField(default=False)  # Flag for result publication

    def __str__(self):
        return self.name

class ExamDetail(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="exam_details")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    class_assigned = models.ForeignKey(Class, on_delete=models.CASCADE, null=True, blank=True, related_name='exam_details')  # Automatically filled based on subject
    full_marks = models.PositiveIntegerField(null=True)
    pass_marks = models.PositiveIntegerField(null=True)
    exam_date = models.DateField()
    exam_time = models.TimeField(null=True)  # New field for exam time
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        if not self.class_assigned:  # Auto-assign class based on the subject_code
            try:
                self.class_assigned = self.subject.classes.first()
                if not self.class_assigned:
                    raise ValueError(f"The subject '{self.subject.subject_code}' is not associated with any class.")
            except Exception as e:
                raise ValueError(str(e))
        
        super().save(*args, **kwargs)  # Save after setting the class_assigned

    def __str__(self):
        return f"{self.exam.name} - {self.subject.subject_code} ({self.class_assigned.class_name})"

    class Meta:
        unique_together = ('exam', 'subject', 'class_assigned')  # Prevent duplicate exam details

class StudentResult(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="results")
    exam_detail = models.ForeignKey(ExamDetail, on_delete=models.CASCADE, related_name="results")
    practical_marks = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    theory_marks = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    total_marks = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    gpa = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    grade = models.CharField(max_length=5, null=True, blank=True)  # New Grade Field
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Calculate total_marks
        self.total_marks = (self.practical_marks or 0) + (self.theory_marks or 0)

        # Ensure total_marks do not exceed full_marks
        if self.total_marks > self.exam_detail.full_marks:
            raise ValueError(
                f"Total marks ({self.total_marks}) cannot be greater than the full marks ({self.exam_detail.full_marks}) of the subject."
            )

        # Calculate percentage
        if self.exam_detail.full_marks:
            self.percentage = (self.total_marks / self.exam_detail.full_marks) * 100
        else:
            self.percentage = 0

        # Assign GPA based on percentage
        if self.percentage >= 90:
            self.gpa = 4.0
            self.grade = "A+"
        elif self.percentage >= 80:
            self.gpa = 3.5
            self.grade = "A"
        elif self.percentage >= 70:
            self.gpa = 3.0
            self.grade = "B+"
        elif self.percentage >= 60:
            self.gpa = 2.5
            self.grade = "B"
        elif self.percentage >= 50:
            self.gpa = 2.0
            self.grade = "C+"
        elif self.percentage >= 40:
            self.gpa = 1.5
            self.grade = "C"
        elif self.percentage >= 35:
            self.gpa = 1.0
            self.grade = "D"
        else:
            self.gpa = 0.0
            self.grade = "NG"  # Not Graded

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student.user.username} - {self.exam_detail.subject.subject_name}"

    class Meta:
        unique_together = ('student', 'exam_detail')  # Prevent duplicate entries for the same exam detail.

class StudentOverallResult(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="exam_results")
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="exam_results")
    total_marks_obtained = models.FloatField(default=0.0)
    total_full_marks = models.FloatField(default=0.0)
    percentage = models.FloatField(default=0.0)
    gpa = models.FloatField(default=0.0)
    grade = models.CharField(max_length=3, default="NG")  # NG = Not Graded
    rank = models.IntegerField(null=True, blank=True)  # This field will store the rank
    updated_at = models.DateTimeField(auto_now=True)  # Auto update when changes happen

    class Meta:
        unique_together = ("student", "exam")  # Ensures one result per student per exam

    def __str__(self):
        return f"{self.student.user.username} - {self.exam.name}: {self.grade}"


    

class Message(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"From {self.sender} to {self.receiver} at {self.timestamp}"
    


def validate_file_size(value):
    max_size = 5 * 1024 * 1024  # 5MB limit
    if value.size > max_size:
        raise ValidationError("File size cannot exceed 5MB.")

class Notes(models.Model):
    chapter = models.CharField(max_length=255)  # Chapter name
    title = models.CharField(max_length=255)  # Note title
    description = models.TextField(blank=True)  # Optional description
    file = models.FileField(upload_to='notes/', validators=[validate_file_size], null=True, blank=True)  # File upload
    subject = models.ForeignKey('Subject', on_delete=models.CASCADE, related_name='notes')  # Link to Subject
    class_code = models.ForeignKey('Class', on_delete=models.CASCADE, related_name='notes')  # Auto-fetch class
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Auto-set teacher
    created_at = models.DateTimeField(auto_now_add=True)  # Auto timestamp

    class Meta:
        ordering = ['-created_at']  # Newest first

    def __str__(self):
        return f"{self.title} - {self.chapter} ({self.created_by.username})"