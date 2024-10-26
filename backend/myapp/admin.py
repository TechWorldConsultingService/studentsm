from django.contrib import admin

from .models import *

# Register your models here.
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'phone', 'address', 'date_of_joining', 'gender')

admin.site.register(Teacher,TeacherAdmin)
admin.site.register(Principal)
admin.site.register(Student)
admin.site.register(LeaveApplication)
admin.site.register(Subject)
admin.site.register(Class)
admin.site.register(Enrollment)
admin.site.register(Attendance)
admin.site.register(Grade)
admin.site.register(Timetable)