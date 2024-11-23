from django.db import models
from django.conf import settings
from django.utils import timezone

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
    class_teacher = models.ForeignKey(Class, related_name="class_teacher", on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
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
    classes = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='students')
   
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
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='assignments/')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, null=True, blank=True, related_name='assignment')
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} by {self.student.username}"
    