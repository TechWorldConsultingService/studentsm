from django.db import models
from django.conf import settings
from django.utils import timezone
from accounts.models import CustomUser
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
 
class Principal(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15, unique=True)
    address = models.CharField(max_length=255)
    gender = models.CharField(max_length=6, choices=[('male', 'male'), ('female', 'female'), ('other', 'other')])
   
    def __str__(self):
        return self.user.username
    

class Student(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15, unique=True)
    address = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=6, choices=[('male', 'male'), ('female', 'female'), ('other', 'other')])
    parents = models.CharField(max_length=15)
    class_code = models.ForeignKey(Class, on_delete=models.SET_NULL, related_name='students', null=True, blank=True)
   
    def __str__(self):
        return f"User ID: {self.user.id}, Username: {self.user.username}"

class Staff(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15, unique=True)
    address = models.CharField(max_length=255)
    date_of_joining = models.DateField()
    gender = models.CharField(max_length=6, choices=[('male', 'male'), ('female', 'female'), ('other', 'other')])
    role = models.CharField(max_length=255)

    def __str__(self):
        return f"User ID: {self.user.id}, Username: {self.user.username}, Role: {self.role}"

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
    status = models.CharField(max_length=10, choices=[('Present', 'Present'), ('Absent', 'Absent')])

    def __str__(self):
        return f"{self.student.user.username} - {self.date}"

class LessonAttendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='lesson_attendance')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='lesson_attendance')
    date = models.DateField(default=timezone.now)
    status = models.CharField(max_length=10, choices=[('Present', 'Present'), ('Absent', 'Absent')])

    def __str__(self):
        return f"{self.student.user.username} - {self.subject.name} - {self.date}"

class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    class_assigned = models.ForeignKey(Class, on_delete=models.CASCADE)
    date_enrolled = models.DateField()

    def __str__(self):
        return f'{self.student} in {self.class_assigned}'

class Grade(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    class_assigned = models.ForeignKey(Class, on_delete=models.CASCADE)
    grade = models.CharField(max_length=5)

    def __str__(self):
        return f'{self.student} - {self.subject} - {self.grade}'


class Timetable(models.Model):
    class_assigned = models.ForeignKey(Class, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    day_of_week = models.CharField(max_length=10, choices=[('Monday', 'Monday'), ('Tuesday', 'Tuesday'), ('Wednesday', 'Wednesday'), ('Thursday', 'Thursday'), ('Friday', 'Friday')])
    start_time = models.TimeField()
    end_time = models.TimeField()

    def __str__(self):
        return f'{self.class_assigned} - {self.subject} on {self.day_of_week}'


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
    # student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Assuming user model is used for students
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="submissions")  # CustomUser reference
    submission_file = models.FileField(upload_to='assignments/', null=True, blank=True)
    submitted_on = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.student.username} - {self.assignment.assignment_name}"    

class Syllabus(models.Model):
    class_assigned = models.ForeignKey(Class, on_delete=models.CASCADE, related_name="syllabus",null=False, blank=False,default=1)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="syllabus",null=False, blank=False, default=1)
    # teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name="syllabus",null=False, blank=False)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name="syllabus",null=False, default=1)
    topics = models.TextField()  # A comma-separated list of topics/chapters
    completed_topics = models.TextField(blank=True, null=True)  # A comma-separated list of completed topics
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_completion_percentage(self):
        all_topics = [topic.strip() for topic in self.topics.split(",") if topic.strip()]
        completed = [topic.strip() for topic in self.completed_topics.split(",") if topic.strip()]
        if not all_topics:
            return 0
        return round((len(completed) / len(all_topics)) * 100, 2)

    def ____str____(self):
        teacher_name = self.teacher.user.username if self.teacher and self.teacher.user else "No Teacher Assigned"
        # return f"{self.class_assigned} - {self.subject} - {self.teacher.user.username}"
        return f"{self.class_assigned} - {self.subject} - {teacher_name}"

class Fees(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='fees')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)  # Total fee amount
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Total amount paid
    pending_amount = models.DecimalField(max_digits=10, decimal_places=2, editable=False)  # Computed field for pending fees
    due_date = models.DateField()  # The last date for fee payment
    last_payment_date = models.DateField(null=True, blank=True)  # Date of the last payment
    status = models.CharField(max_length=20, choices=[('Paid', 'Paid'), ('Pending', 'Pending')], default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)  # Record creation timestamp
    updated_at = models.DateTimeField(auto_now=True)  # Record update timestamp

    def save(self, *args, **kwargs):
        # Automatically calculate the pending amount
        self.pending_amount = self.total_amount - self.amount_paid
        self.status = 'Paid' if self.pending_amount <= 0 else 'Pending'
        super(Fees, self).save(*args, **kwargs)

    def ____str____(self):
        return f"{self.student.user.username} - Total: {self.total_amount} - Pending: {self.pending_amount}"

class FeePaymentHistory(models.Model):
    fee_record = models.ForeignKey(Fees, on_delete=models.CASCADE, related_name='payment_history')
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)  # Payment amount
    payment_date = models.DateField(default=timezone.now)  # Date of payment
    mode_of_payment = models.CharField(
        max_length=20, 
        choices=[('Cash', 'Cash'), ('Card', 'Card'), ('Online', 'Online')], 
        default='Online'
    )
    transaction_id = models.CharField(max_length=255, null=True, blank=True)  # Transaction ID for reference
    notes = models.TextField(null=True, blank=True)  # Additional notes about the payment

    def ____str____(self):
        return f"{self.fee_record.student.user.username} - Paid: {self.amount_paid} on {self.payment_date}"
    

from django.db import models
from django.contrib.auth.models import User

class StaffLocation(models.Model):
    staff = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Replace with your staff  model if needed
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    altitude = models.DecimalField(max_digits=9, decimal_places=6)
    timestamp = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.staff.username} - {self.timestamp}"



class DiscussionTopic(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class DiscussionPost(models.Model):
    topic = models.ForeignKey(DiscussionTopic, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post by {self.created_by.username} in {self.topic.title}"


class DiscussionComment(models.Model):
    post = models.ForeignKey(DiscussionPost, on_delete=models.CASCADE, related_name="comments")
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name="replies")
    content = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.created_by.username} on {self.post.content[:20]}"
