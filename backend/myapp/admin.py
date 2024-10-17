from django.contrib import admin

from .models import *

# Register your models here.
admin.site.register(Teacher)
admin.site.register(Principal)
admin.site.register(Parent)
admin.site.register(Student)
admin.site.register(LeaveApplication)
admin.site.register(Subject)
admin.site.register(Class)
admin.site.register(Enrollment)
admin.site.register(Attendance)
admin.site.register(Grade)
admin.site.register(Timetable)