# from django import forms
# from django.contrib import admin
# from .models import Assignment, Subject, Teacher, Class

# class AssignmentForm(forms.ModelForm):
#     class Meta:
#         model = Assignment
#         fields = ['teacher','class_assigned','subject','assignment_name','description','due_date']

#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)

#         # Default queryset for subject
#         self.fields['subject'].queryset = Subject.objects.none()

#         if 'teacher' in self.data and 'class_assigned' in self.data:
#             try:
#                 teacher_id = int(self.data.get('teacher'))
#                 class_id = int(self.data.get('class_assigned'))
#                 teacher = Teacher.objects.get(id=teacher_id)
#                 class_obj = Class.objects.get(id=class_id)

#                 # Filter subjects: taught by the teacher AND available in the class
#                 self.fields['subject'].queryset = teacher.subjects.filter(classes=class_obj)

#             except (ValueError, TypeError, Teacher.DoesNotExist, Class.DoesNotExist):
#                 pass
#         elif self.instance.pk:
#             # Populate when editing an existing assignment
#             teacher = self.instance.teacher
#             class_obj = self.instance.class_assigned
#             self.fields['subject'].queryset = teacher.subjects.filter(classes=class_obj)

#     def clean(self):
#         cleaned_data = super().clean()
#         teacher = cleaned_data.get('teacher')
#         class_assigned = cleaned_data.get('class_assigned')
#         subject = cleaned_data.get('subject')

#         if subject and not subject.classes.filter(id=class_assigned.id).exists():
#             raise forms.ValidationError("The selected subject is not available in the assigned class.")
#         return cleaned_data

# class AssignmentAdmin(admin.ModelAdmin):
#     form = AssignmentForm  # Attach the custom form
#     list_display = ('id','assignment_name', 'teacher', 'class_assigned', 'subject', 'due_date', 'assigned_on')
#     list_filter = ('teacher', 'class_assigned', 'subject')
#     search_fields = ('assignment_name', 'teacher__user__username', 'class_assigned__class_name', 'subject__subject_name')

# admin.site.register(Assignment, AssignmentAdmin)