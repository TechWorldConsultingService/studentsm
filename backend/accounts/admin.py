from django.contrib import admin
from .models import *
# Register your models here.
@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_master', 'is_principal', 'is_teacher', 'is_student', 'is_accountant', 'is_active')
    search_fields = ('username', 'email')