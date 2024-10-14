from django.db import models
from django.conf import settings
from django.utils import timezone

class Teacher(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15, unique=True)
    address = models.CharField(max_length=255)
    date_of_joining = models.DateField()

    def __str__(self):
        return self.user.username


class Principal(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15, unique=True)
    address = models.CharField(max_length=255)

    def __str__(self):
        return self.user.username


class Parent(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15, unique=True)
    address = models.CharField(max_length=255)

    def __str__(self):
        return self.user.username


class Student(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15, unique=True)
    address = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    parents = models.ManyToManyField(Parent, related_name='children')

   
    def __str__(self):
        return f"User ID: {self.user.id}, Username: {self.user.username}"



class LeaveApplication(models.Model):
    applicant_type = models.CharField(max_length=10)
    applicant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    applied_on = models.DateField(default=timezone.now())
    leave_date = models.DateField()
    message = models.TextField()
    status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Disapproved', 'Disapproved')], default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Subject(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='subjects')

    def __str__(self):
        return self.name


class Class(models.Model):
    name = models.CharField(max_length=50)
    start_date = models.DateField()
    end_date = models.DateField()
    teachers = models.ManyToManyField(Teacher, related_name='classes')
    subjects = models.ManyToManyField(Subject, related_name='classes')

    def __str__(self):
        return self.name


class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    class_assigned = models.ForeignKey(Class, on_delete=models.CASCADE)
    date_enrolled = models.DateField()

    def __str__(self):
        return f'{self.student} in {self.class_assigned}'


class Attendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    class_attended = models.ForeignKey(Class, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=10, choices=[('Present', 'Present'), ('Absent', 'Absent')])

    def __str__(self):
        return f'{self.student} - {self.class_attended} on {self.date}'


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
