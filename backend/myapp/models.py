from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.timezone import now
from decimal import Decimal
from django.core.exceptions import ValidationError
import os
from django.contrib.auth.models import AbstractUser
# Create your models here.

class CustomUser(AbstractUser):
    # Add custom fields here to represent the different roles
    is_master = models.BooleanField(default=False)
    is_principal = models.BooleanField(default=False)
    is_teacher = models.BooleanField(default=False)
    is_student = models.BooleanField(default=False)
    is_accountant = models.BooleanField(default=False)
    # is_driver = models.BooleanField(default=False)


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
    

class DateSetting(models.Model):
    is_ad = models.BooleanField(default=True)  # True = AD, False = BS

    def save(self, *args, **kwargs):
        # Ensure only one instance exists
        self.pk = 1
        super(DateSetting, self).save(*args, **kwargs)

    @classmethod
    def get_instance(cls):
        instance, _ = cls.objects.get_or_create(pk=1)
        return instance

    def __str__(self):
        return f"Date Format: {'AD' if self.is_ad else 'BS'}"


class Policies(models.Model):
    policies = models.CharField(max_length=2000, unique=True)

class Subject(models.Model):
    subject_code = models.CharField(max_length=50, unique=True)
    subject_name = models.CharField(max_length=100)
    is_credit = models.BooleanField(default=True, null=True, blank=True)  # True = Credit, False = Non-Credit
    credit_hours = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)  # Credit hours
    is_optional = models.BooleanField(default=False, null=True, blank=True)  # ✅ New field: True = Optional, False = Compulsory

    def __str__(self):
        return self.subject_name
       
class Class(models.Model):
    class_code = models.CharField(max_length=50, unique=True)
    class_name = models.CharField(max_length=100)
    subjects = models.ManyToManyField(Subject, related_name="classes")
    optional_subjects = models.ManyToManyField(Subject, related_name="optional_classes", blank=True)  # ✅ Select optional subjects

    def __str__(self):
        return self.class_name
    
class Section(models.Model):
    school_class = models.ForeignKey(Class, on_delete=models.CASCADE, related_name="sections")
    section_name = models.CharField(max_length=10)  # e.g., "A", "B", "C"
    def __str__(self):
        return f"{self.school_class.class_name} - {self.section_name}"
    
class Teacher(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15, unique=True)
    address = models.CharField(max_length=255)
    date_of_joining = models.DateField() 
    gender = models.CharField(max_length=6, choices=[('male', 'male'), ('female', 'female'), ('other', 'other')])
    subjects = models.ManyToManyField(Subject, related_name='teachers')
    classes = models.ManyToManyField(Class, related_name='teachers')
    classes_section = models.ManyToManyField(Section, blank=True, related_name="teacher_sections")
    class_teacher = models.ForeignKey(Class, on_delete=models.SET_NULL, null=True, blank=True)
    class_teacher_section = models.ForeignKey(Section, on_delete=models.SET_NULL, null=True, blank=True, related_name="classteachersection")

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
    class_code_section = models.ForeignKey(Section, on_delete=models.SET_NULL, null=True, blank=True, related_name="studentsection")
    roll_no = models.CharField(max_length=10, null=True, blank=True)  
    optional_subjects = models.ManyToManyField(Subject, blank=True)

    def __str__(self):
        return f"User ID: {self.user.id}, Username: {self.user.username}"
    
    def delete(self, *args, **kwargs):
        self.user.delete()
        super().delete(*args, **kwargs)

class Accountant(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15, unique=True)
    address = models.CharField(max_length=255)
    date_of_joining = models.DateField()
    gender = models.CharField(max_length=6, choices=[('male', 'male'), ('female', 'female'), ('other', 'other')])

    def __str__(self):
        return f"User ID: {self.user.id}, Username: {self.user.username}"
    
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
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="events")  # If you want to track who created the event

    def __str__(self):
        return f"{self.title} ({self.start_time} - {self.end_time})"
    
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

from django.db.models import Count, Q
class Syllabus(models.Model):
    class_assigned = models.ForeignKey(Class, on_delete=models.CASCADE, related_name="syllabus")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="syllabus")
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name="syllabus")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.class_assigned} - {self.subject} - {self.teacher.user.username}"

    def get_completion_percentage(self):
        total_topics = self.chapters.aggregate(total=Count("topics"))["total"] or 0
        total_subtopics = self.chapters.aggregate(total=Count("topics__subtopics"))["total"] or 0

        completed_topics = self.chapters.aggregate(
            completed=Count("topics", filter=Q(topics__is_completed=True))
        )["completed"] or 0

        completed_subtopics = self.chapters.aggregate(
            completed=Count("topics__subtopics", filter=Q(topics__subtopics__is_completed=True))
        )["completed"] or 0

        total_completed = completed_topics + completed_subtopics
        total_items = total_topics + total_subtopics

        if total_items == 0:
            return 0
        return (total_completed / total_items) * 100

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
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return f"Post by {self.created_by.username} in {self.topic}"

class DiscussionComment(models.Model):
    post = models.ForeignKey(DiscussionPost, on_delete=models.CASCADE, related_name="comments")
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name="replies")
    content = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return f"Comment by {self.created_by.username} on {self.post.content[:20]}"

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



def validate_file_size(value):
    """Validate file size and type."""
    
    # File size validation (max 5MB)
    max_size = 5 * 1024 * 1024  # 5MB limit
    if value.size > max_size:
        raise ValidationError("File size cannot exceed 5MB.")
    
    # File type validation
    valid_extensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']
    ext = os.path.splitext(value.name)[1].lower()  # Get the file extension and convert to lowercase
    if ext not in valid_extensions:
        raise ValidationError(f"File type '{ext}' is not allowed. Please upload a PDF, Word, PNG, or JPG file.")

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
    


from django.contrib.auth import get_user_model

User = get_user_model()

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_messages")
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} -> {self.receiver}: {self.message}"
    
class FeeCategoryName(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

class FeeCategory(models.Model):
    class_assigned = models.ForeignKey(Class, on_delete=models.CASCADE, null=True, related_name="fee_categories")
    fee_category_name = models.ForeignKey(FeeCategoryName, on_delete=models.CASCADE, related_name="fee_categories")
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.fee_category_name.name} - {self.class_assigned.class_name} (${self.amount})"

class TransportationFee(models.Model):
    place = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.place} - ${self.amount}"

class StudentBill(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="bills")
    month = models.CharField(max_length=20)  # e.g., "January" 
    date = models.DateTimeField(auto_now_add=True)
    bill_number = models.CharField(max_length=10, unique=True, blank=True)
    fee_categories = models.ManyToManyField(FeeCategory, through="StudentBillFeeCategory", related_name="feecategory_bills")
    transportation_fee = models.ForeignKey(TransportationFee, on_delete=models.CASCADE, related_name="student_bills", null=True, blank=True)
    remarks = models.TextField(blank=True, null=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def save(self, *args, **kwargs):
        if not self.date:
            self.date = now()

        if not self.bill_number:
            year = str(self.date.year)
            attempt = 1  # Track retry attempts
            
            while True:
                existing_bills_count = StudentBill.objects.count()
                bill_number = f"{year}B{str(existing_bills_count + attempt).zfill(2)}"

                # Ensure uniqueness
                if not StudentBill.objects.filter(bill_number=bill_number).exists():
                    self.bill_number = bill_number
                    break
                
                attempt += 1  # Increment and retry if duplicate

        super().save(*args, **kwargs)

    def calculate_totals(self):
        subtotal = 0

        # Calculate subtotal from fee categories
        for fee_entry in self.studentbillfeecategory_set.all():
            fee_amount = fee_entry.fee_category.amount if not fee_entry.scholarship else 0
            subtotal += fee_amount

        # Add transportation fee if exists
        if self.transportation_fee:
            subtotal += self.transportation_fee.amount

        # Apply discount and calculate total amount
        total = subtotal - self.discount
        self.subtotal = subtotal
        self.total_amount = max(total, 0)  # Ensure total is not negative

        # Debugging: Print the calculated values
        print(f"Subtotal: {subtotal}, Discount: {self.discount}, Total Amount: {self.total_amount}")

        # Save the updated totals
        self.save()

class StudentBillFeeCategory(models.Model):
    student_bill = models.ForeignKey(StudentBill, on_delete=models.CASCADE)
    fee_category = models.ForeignKey(FeeCategory, on_delete=models.CASCADE)
    scholarship = models.BooleanField(default=False)  # Stored permanently

    def __str__(self):
        status = "with Scholarship" if self.scholarship else "Full Fee"
        return f"{self.fee_category.fee_category_name.name} - {status}"

class StudentPayment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="payments")
    date = models.DateTimeField(auto_now_add=True)
    payment_number = models.CharField(max_length=10, unique=True, blank=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    remarks = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)

    def save(self, *args, **kwargs):
        # Ensure date is set to the current date if not already set
        if not self.date:
            self.date = timezone.now()
        if not self.payment_number:  # Generate payment number only if not set
            year = str(self.date.year)
            attempt = 1  # Track retry attempts
            # Find the next payment number for this student by counting existing payments
            while True:
                existing_payments_count = StudentPayment.objects.filter(student=self.student).count()
                payment_number = f"{year}P{str(existing_payments_count + 1).zfill(2)}"  # Format: 2025P01, 2025P02, etc.

                if not StudentPayment.objects.filter(payment_number=payment_number).exists():
                    self.payment_number = payment_number  # Unique for each student 
                    break  

                attempt += 1  # Increment and retry if duplicate     
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Payment {self.payment_number} - {self.student.user.username} - {self.amount_paid}"

class StudentTransaction(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="transactions")
    transaction_type = models.CharField(max_length=10, choices=[('bill', 'Bill'), ('payment', 'Payment')])
    bill = models.ForeignKey(StudentBill, on_delete=models.CASCADE, null=True, blank=True, related_name="transactions")
    payment = models.ForeignKey(StudentPayment, on_delete=models.CASCADE, null=True, blank=True, related_name="transactions")
    balance = models.DecimalField(max_digits=10, decimal_places=2)  # Auto-managed
    transaction_date = models.DateTimeField(null=True, blank=True)  # Use bill/payment date

    def __str__(self):
        return f"{self.transaction_type.capitalize()} - Balance: {self.balance}"



class Communication(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sent_communications")
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.CASCADE, related_name="received_communications")
    message = models.TextField()
    receiver_role = models.CharField(max_length=255, choices=(
        ('teacher', 'Teacher'),
        ('student', 'Student'),
        ('accountant', 'Accountant'),
        ('teacher_student', 'Teacher and Student'),
        ('teacher_accountant', 'Teacher and Accountant'),
        ('student_accountant', 'Student and Accountant'),
        ('all', 'All'),),null=True,blank=True)
    sent_at = models.DateTimeField(auto_now_add=True)
    class_field = models.ForeignKey('Class', null=True, blank=True, on_delete=models.SET_NULL, related_name="communications")

    def __str__(self):
        return f"Message from {self.sender.username} to {self.receiver.username if self.receiver else self.receiver_role}"



class Quiz(models.Model):
    title = models.CharField(max_length=255)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="quizzes")
    highest_scorer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="highest_quiz_scores")
    highest_score = models.IntegerField(default=0)

    def update_highest_score(self, user, new_score):
        if new_score > self.highest_score:
            self.highest_score = new_score
            self.highest_scorer = user
            self.save()

    def __str__(self):
        return self.title

# class Question(models.Model):
class QuizQuestion(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
    question_text = models.TextField()
    option1 = models.CharField(max_length=255)
    option2 = models.CharField(max_length=255)
    option3 = models.CharField(max_length=255)
    option4 = models.CharField(max_length=255)
    correct_answer = models.CharField(max_length=255)

    def __str__(self):
        return self.question_text
    
class QuizScore(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="quiz_scores")
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="scores")
    score = models.IntegerField()

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.quiz.update_highest_score(self.user, self.score)

    def __str__(self):
        return f"{self.user.username} - {self.score} in {self.quiz.title}"
    

class Task(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="tasks")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    due_date = models.DateField()
    is_completed = models.BooleanField(default=False)
    completion_percentage = models.IntegerField(default=0)  # 0 to 100
    order = models.IntegerField(default=0)  # For drag-and-drop ordering

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
