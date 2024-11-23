from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class CustomUser(AbstractUser):
    # Add custom fields here to represent the different roles
    is_master = models.BooleanField(default=False)
    is_principal = models.BooleanField(default=False)
    is_teacher = models.BooleanField(default=False)
    is_student = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

class test1(models.Model):
        phone = models.CharField(max_length=15, unique=True)
        address = models.CharField(max_length=255)
        gender = models.CharField(max_length=6, choices=[('male', 'male'), ('female', 'female'), ('other', 'other')])
    
        def __str__(self):
            return self.gender