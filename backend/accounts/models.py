from django.db import models
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
