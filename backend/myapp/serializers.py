from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *
from datetime import datetime
from django.shortcuts import get_object_or_404


# Serializer for the CustomUser model
class UserSerializer(serializers.ModelSerializer):
    # Optionally include a derived role field
    role = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = (
            'username',
            'email',
            'password',
            'first_name',
            'last_name',
            'is_master',
            'is_principal',
            'is_teacher',
            'is_student',
            'is_accountant',
            'role'
            )
        # Ensure the password field is write-only (won't be returned in API responses)
        extra_kwargs = {
            'password': {'write_only': True},
            'is_master': {'read_only': True},
            'is_principal': {'read_only': True},
            'is_teacher': {'read_only': True},
            'is_student': {'read_only': True},
            'is_accountant': {'read_only': True},
        }

    def get_role(self, obj):
        if obj.is_master:
            return "Master"
        elif obj.is_principal:
            return "Principal"
        elif obj.is_teacher:
            return "Teacher"
        elif obj.is_student:
            return "Student"
        elif obj.is_accountant:
            return "Accountant'"
        return "Unknown"

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
    
# Serializer for user login
class LoginSerializer(serializers.Serializer):
    # Username field for login
    username = serializers.CharField()
    # Password field for login
    password = serializers.CharField()

# Serializer for user logout
class LogoutSerializer(serializers.Serializer):
    # Refresh token field for logout
    refresh = serializers.CharField()

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ['id', 'section_name']
        extra_kwargs = {'school_class': {'required': False}}  # Make school_class optional in input

    def create(self, validated_data):
        """
        Assign the school_class automatically when creating a section.
        """
        class_id = self.context.get('class_id')  # Retrieve class_id from serializer context
        school_class = get_object_or_404(Class, id=class_id)  # Fetch the class instance
        validated_data['school_class'] = school_class  # Assign class instance
        return super().create(validated_data)  # Proceed with creation


# Serializer for the subjects
class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'subject_code', 'subject_name', 'is_credit', 'credit_hours', 'is_optional']


class ClassSerializer(serializers.ModelSerializer):
    subjects = serializers.ListField(
        child=serializers.DictField(),  # Accepts a list of dictionaries for subjects
        write_only=True
    )
    optional_subjects = serializers.ListField(
        child=serializers.DictField(),  # Accepts a list of dictionaries for optional subjects
        write_only=True, required=False  # Optional field
    )

    subject_details = SubjectSerializer(source='subjects', many=True, read_only=True)
    optional_subject_details = SubjectSerializer(source='optional_subjects', many=True, read_only=True)

    class Meta:
        model = Class
        fields = ['id', 'class_code', 'class_name', 'subjects', 'optional_subjects', 'subject_details', 'optional_subject_details']

    def create(self, validated_data):
        subjects_data = validated_data.pop('subjects', [])
        optional_subjects_data = validated_data.pop('optional_subjects', [])

        # Create the class instance
        class_instance = Class.objects.create(**validated_data)

        # Handle subjects
        for subject_data in subjects_data:
            subject, _ = Subject.objects.get_or_create(
                subject_code=subject_data['subject_code'],
                defaults={'subject_name': subject_data['subject_name']}
            )
            class_instance.subjects.add(subject)

        # Handle optional subjects
        for optional_subject_data in optional_subjects_data:
            optional_subject, _ = Subject.objects.get_or_create(
                subject_code=optional_subject_data['subject_code'],
                defaults={'subject_name': optional_subject_data['subject_name']}
            )
            class_instance.optional_subjects.add(optional_subject)

        return class_instance

    def update(self, instance, validated_data):
        subjects_data = validated_data.pop('subjects', None)
        optional_subjects_data = validated_data.pop('optional_subjects', None)

        instance.class_code = validated_data.get('class_code', instance.class_code)
        instance.class_name = validated_data.get('class_name', instance.class_name)
        instance.save()

        # Update subjects if provided
        if subjects_data is not None:
            instance.subjects.clear()
            for subject_data in subjects_data:
                subject, _ = Subject.objects.get_or_create(
                    subject_code=subject_data['subject_code'],
                    defaults={'subject_name': subject_data['subject_name']}
                )
                instance.subjects.add(subject)

        # Update optional subjects if provided
        if optional_subjects_data is not None:
            instance.optional_subjects.clear()
            for optional_subject_data in optional_subjects_data:
                optional_subject, _ = Subject.objects.get_or_create(
                    subject_code=optional_subject_data['subject_code'],
                    defaults={'subject_name': optional_subject_data['subject_name']}
                )
                instance.optional_subjects.add(optional_subject)

        return instance


class ClassDetailSerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True, read_only=True)

    class Meta:
        model = Class
        fields = ['id', 'class_code', 'class_name', 'sections']

# Serializer for the Teacher model
class TeacherSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    subjects = serializers.ListField(child=serializers.DictField(), write_only=True)
    subject_details = SubjectSerializer(source='subjects', many=True, read_only=True)

    classes = serializers.PrimaryKeyRelatedField(queryset=Class.objects.all(), many=True)
    classes_section = serializers.PrimaryKeyRelatedField(queryset=Section.objects.all(), many=True, required=False)

    class_teacher = serializers.PrimaryKeyRelatedField(queryset=Class.objects.all(), allow_null=True, required=False)
    class_teacher_section = serializers.PrimaryKeyRelatedField(queryset=Section.objects.all(), allow_null=True, required=False)

    class Meta:
        model = Teacher
        fields = [ 'id', 'user', 'phone', 'address', 'date_of_joining', 'gender', 'subjects', 'subject_details', 'classes', 'classes_section', 'class_teacher', 'class_teacher_section']
    
    def convert_bs_to_ad(self, bs_date):
        """Convert BS date (YYYY/MM/DD) to AD date (YYYY-MM-DD)"""
        if isinstance(bs_date, str) and '/' in bs_date:
            try:
                bs_year, bs_month, bs_day = map(int, bs_date.split('/'))
                bs_date_obj = nepali_datetime.date(bs_year, bs_month, bs_day)
                return bs_date_obj.to_datetime_date()  # Return as a datetime.date object
            except ValueError:
                raise serializers.ValidationError({"date_of_joining": "Invalid BS date format. Use YYYY/MM/DD."})
        return bs_date  # If it's already in AD, return as is

    def to_internal_value(self, data):
        """Preprocess date_of_joining before default validation"""
        if 'date_of_joining' in data and isinstance(data['date_of_joining'], str):
            data['date_of_joining'] = self.convert_bs_to_ad(data['date_of_joining'])  # Convert BS to AD before validation
        return super().to_internal_value(data)
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        subjects_data = validated_data.pop('subjects', [])
        classes = validated_data.pop('classes', [])
        classes_section = validated_data.pop('classes_section', [])
        class_teacher = validated_data.pop('class_teacher', None)
        class_teacher_section = validated_data.pop('class_teacher_section', None)

        user_data['is_teacher'] = True
        user_serializer = UserSerializer(data=user_data)

        if user_serializer.is_valid():
            user = user_serializer.save()
            user.is_teacher = True
            user.save()

            teacher = Teacher.objects.create(
                user=user,
                class_teacher=class_teacher,
                class_teacher_section=class_teacher_section,
                **validated_data
            )
            
            teacher.classes.set(classes)
            teacher.classes_section.set(classes_section)

            subject_instances = []
            for subject_data in subjects_data:
                subject, _ = Subject.objects.get_or_create(
                    subject_code=subject_data['subject_code'],
                    defaults={'subject_name': subject_data['subject_name']}
                )
                subject_instances.append(subject)

            teacher.subjects.set(subject_instances)
            teacher.save()
            return teacher
        else:
            raise serializers.ValidationError(user_serializer.errors)

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        subjects_data = validated_data.pop('subjects', [])
        classes = validated_data.pop('classes', [])
        classes_section = validated_data.pop('classes_section', [])
        class_teacher = validated_data.pop('class_teacher', None)
        class_teacher_section = validated_data.pop('class_teacher_section', None)

        user_serializer = UserSerializer(instance=instance.user, data=user_data, partial=True)
        if user_serializer.is_valid():
            user = user_serializer.save()
            user.is_teacher = True
            user.save()
        else:
            raise serializers.ValidationError(user_serializer.errors)

        instance.classes.set(classes)
        instance.classes_section.set(classes_section)

        subject_instances = []
        for subject_data in subjects_data:
            subject, _ = Subject.objects.get_or_create(
                subject_code=subject_data['subject_code'],
                defaults={'subject_name': subject_data['subject_name']}
            )
            subject_instances.append(subject)
        instance.subjects.set(subject_instances)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if class_teacher is not None:
            instance.class_teacher = class_teacher
        if class_teacher_section is not None:
            instance.class_teacher_section = class_teacher_section

        instance.save()
        return instance

class GetTeacherSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    subject_details = SubjectSerializer(source='subjects', many=True, read_only=True)
    class_details = ClassSerializer(source='classes', many=True, read_only=True)
    class_teacher_details = serializers.SerializerMethodField()
    class_teacher_section_details = serializers.SerializerMethodField()
    classes_section_details = serializers.SerializerMethodField()

    class Meta:
        model = Teacher
        fields = [
            'id', 'user', 'phone', 'address', 'date_of_joining', 'gender',
            'subject_details', 'class_details', 'class_teacher_details',
            'class_teacher_section_details', 'classes_section_details'
        ]

    def get_class_teacher_details(self, obj):
        if obj.class_teacher:
            return {
                "id": obj.class_teacher.id,
                "class_code": obj.class_teacher.class_code,
                "class_name": obj.class_teacher.class_name
            }
        return None

    def get_class_teacher_section_details(self, obj):
        if obj.class_teacher_section:
            return {
                "id": obj.class_teacher_section.id,
                "section_name": obj.class_teacher_section.section_name
            }
        return None

    def get_classes_section_details(self, obj):
        if obj.classes_section:
            return {
                "id": obj.classes_section.id,
                "section_name": obj.classes_section.section_name
            }
        return None




# Serializer for the Principal model
class PrincipalSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Nested serializer for the user associated with the principal

    class Meta:
        model = Principal
        # Define which fields should be included in the serialized output
        fields = ['id','user', 'phone', 'address', 'gender']
        # Ensure password is write-only (won't be returned in response)
        extra_kwargs = {'user.password': {'write_only': True}}

    def create(self, validated_data):
        # Extract user data from the validated data
        user_data = validated_data.pop('user')
        # Mark the user as a principal
        user_data['is_principal'] = True
        # Serialize the user data
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            # Save the user and get the created user instance
            user = user_serializer.save()
            # Create and save the Principal instance
            principal = Principal.objects.create(user=user, **validated_data)
            return principal
        else:
            # Raise validation error if user data is invalid
            raise serializers.ValidationError(user_serializer.errors)
        
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        
        # Update user instance only with provided fields
        user_serializer = UserSerializer(instance.user, data=user_data, partial=True)
        if user_serializer.is_valid():
            user_serializer.save()
        else:
            raise serializers.ValidationError(user_serializer.errors)

        # Update the Principal instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    
# Serializer for the Student model
import nepali_datetime

class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class_code = serializers.PrimaryKeyRelatedField(queryset=Class.objects.all())
    class_code_section = serializers.PrimaryKeyRelatedField(queryset=Section.objects.all(), allow_null=True, required=False)
    optional_subjects = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.filter(is_optional=True), many=True, required=False)  # ✅ Add optional subjects

    class Meta:
        model = Student
        fields = ['id', 'user', 'phone', 'address', 'date_of_birth', 'parents', 'gender', 'class_code', 'class_code_section', 'roll_no', 'optional_subjects']

    def convert_bs_to_ad(self, bs_date):
        """Convert BS date (YYYY/MM/DD) to AD date (YYYY-MM-DD)"""
        if isinstance(bs_date, str) and '/' in bs_date:
            try:
                bs_year, bs_month, bs_day = map(int, bs_date.split('/'))
                bs_date_obj = nepali_datetime.date(bs_year, bs_month, bs_day)
                ad_date_obj = bs_date_obj.to_datetime_date()  # Correct conversion method
                return ad_date_obj.strftime('%Y-%m-%d')  # Convert to string format
            except ValueError:
                raise serializers.ValidationError({"date_of_birth": "Invalid BS date format. Use YYYY/MM/DD."})
        return bs_date  # If it's already in AD, return as is

    def to_internal_value(self, data):
        """Preprocess date_of_birth before default validation"""
        if 'date_of_birth' in data and isinstance(data['date_of_birth'], str):
            data['date_of_birth'] = self.convert_bs_to_ad(data['date_of_birth'])  # Convert BS to AD before validation
        return super().to_internal_value(data)

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        class_instance = validated_data.pop('class_code')
        section_instance = validated_data.pop('class_code_section', None)
        optional_subjects = validated_data.pop('optional_subjects', [])

        user_data['is_student'] = True

        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            student = Student.objects.create(user=user, class_code=class_instance, class_code_section=section_instance, **validated_data)
            student.optional_subjects.set(optional_subjects)  # ✅ Assign optional subjects
            return student
        else:
            raise serializers.ValidationError(user_serializer.errors)

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        class_instance = validated_data.pop('class_code', None)
        section_instance = validated_data.pop('class_code_section', None)
        optional_subjects = validated_data.pop('optional_subjects', None)

        user_serializer = UserSerializer(instance=instance.user, data=user_data, partial=True)
        if user_serializer.is_valid():
            user = user_serializer.save()
            user.is_student = True
            user.save()
        else:
            raise serializers.ValidationError(user_serializer.errors)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if class_instance:
            instance.class_code = class_instance
        if section_instance:
            instance.class_code_section = section_instance
        if optional_subjects is not None:
            instance.optional_subjects.set(optional_subjects)  # ✅ Update optional subjects

        return instance



class GetStudentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class_details = serializers.SerializerMethodField()
    optional_subjects = serializers.SerializerMethodField()  # ✅ Add field for optional subjects

    class Meta:
        model = Student
        fields = ['id', 'user', 'phone', 'address', 'date_of_birth', 'parents', 'gender', 'class_details', 'roll_no', 'optional_subjects']

    def get_class_details(self, obj):
        if obj.class_code:
            return {
                "id": obj.class_code.id,
                "class_code": obj.class_code.class_code,
                "class_name": obj.class_code.class_name
            }
        return None

    def get_optional_subjects(self, obj):
        return [{"id": sub.id, "subject_code": sub.subject_code, "subject_name": sub.subject_name} for sub in obj.optional_subjects.all()]


class AccountantSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Nested serializer for the user associated with the staff

    class Meta:
        model = Accountant
        fields = ['id', 'user', 'phone', 'address', 'date_of_joining', 'gender']
        extra_kwargs = {'user.password': {'write_only': True}}

    def convert_bs_to_ad(self, bs_date):
        """Convert BS date (YYYY/MM/DD) to AD date (YYYY-MM-DD)"""
        if isinstance(bs_date, str) and '/' in bs_date:
            try:
                bs_year, bs_month, bs_day = map(int, bs_date.split('/'))
                bs_date_obj = nepali_datetime.date(bs_year, bs_month, bs_day)
                ad_date_obj = bs_date_obj.to_datetime_date()  # Correct conversion method
                return ad_date_obj.strftime('%Y-%m-%d')  # Convert to string format
            except ValueError:
                raise serializers.ValidationError({"date_of_joining": "Invalid BS date format. Use YYYY/MM/DD."})
        return bs_date  # If it's already in AD, return as is

    def to_internal_value(self, data):
        """Preprocess date_of_joining before default validation"""
        if 'date_of_joining' in data and isinstance(data['date_of_joining'], str):
            data['date_of_joining'] = self.convert_bs_to_ad(data['date_of_joining'])  # Convert BS to AD before validation
        return super().to_internal_value(data)

    def create(self, validated_data):
        user_data = validated_data.pop('user')  # Extract user data
        # Mark the user as an accountant
        user_data['is_accountant'] = True
        # Serialize the user data
        user_serializer = UserSerializer(data=user_data)

        if user_serializer.is_valid():
            # Save the user and get the created user instance
            user = user_serializer.save()
            # Create and save the Accountant instance
            accountant = Accountant.objects.create(user=user, **validated_data)  # Create accountant profile
            return accountant
        else:
            raise serializers.ValidationError(user_serializer.errors)
        
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user_serializer = UserSerializer(instance=instance.user, data=user_data, partial=True)
        if user_serializer.is_valid():
            user = user_serializer.save()
            user.is_accountant = True  # Ensure is_accountant is set to True on update
            user.save()
        else:
            raise serializers.ValidationError(user_serializer.errors)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance



class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'creator', 'title', 'caption', 'image', 'video', 'created_at']
        read_only_fields = ['id', 'creator', 'created_at']

# Serializer for the leave application model

class LeaveApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveApplication
        fields = ['id', 'applicant', 'applicant_name', 'applicant_type', 'applied_on', 'leave_date', 'message', 'status', 'created_at', 'updated_at']
        read_only_fields = ['applicant', 'applicant_type', 'applicant_name', 'applied_on', 'status']

    def convert_bs_to_ad(self, bs_date):
        """Convert BS date (YYYY/MM/DD) to AD date (YYYY-MM-DD)"""
        if isinstance(bs_date, str) and '/' in bs_date:
            try:
                bs_year, bs_month, bs_day = map(int, bs_date.split('/'))
                bs_date_obj = nepali_datetime.date(bs_year, bs_month, bs_day)
                ad_date_obj = bs_date_obj.to_datetime_date()  # Correct conversion method
                return ad_date_obj.strftime('%Y-%m-%d')  # Convert to string format
            except ValueError:
                raise serializers.ValidationError({"leave_date": "Invalid BS date format. Use YYYY/MM/DD."})
        return bs_date  # If it's already in AD, return as is

    def to_internal_value(self, data):
        """Preprocess leave_date before default validation"""
        if 'leave_date' in data and isinstance(data['leave_date'], str):
            data['leave_date'] = self.convert_bs_to_ad(data['leave_date'])  # Convert BS to AD before validation
        return super().to_internal_value(data)

    def validate_leave_date(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError("Leave date cannot be in the past.")
        return value

    def create(self, validated_data):
        # Ensure the applicant and applicant_type are set from the view
        user = self.context['request'].user  # Extract the user from the serializer context
        validated_data['applicant'] = user
        validated_data['applicant_type'] = 'Student' if user.is_student else 'Teacher'
        validated_data['applicant_name'] = user.get_full_name()
        return LeaveApplication.objects.create(**validated_data)



from .models import Event

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'start_time', 'end_time', 'created_by', 'created_at']



from .models import Assignment, AssignmentSubmission

import nepali_datetime
from rest_framework import serializers
from .models import Assignment, Teacher, Class, Subject

class AssignmentSerializer(serializers.ModelSerializer):
    class_assigned = serializers.SlugRelatedField(
        queryset=Class.objects.all(),  # Fetch class based on `class_name`
        slug_field='class_name'        # Use `class_name` for representation and lookup
    )

    class Meta:
        model = Assignment
        fields = ['id', 'teacher', 'subject', 'class_assigned', 'assignment_name', 'description', 'due_date', 'assigned_on']
        read_only_fields = ['teacher']  # Make `teacher` read-only

    def convert_bs_to_ad(self, bs_date):
        """Convert BS date (YYYY/MM/DD) to AD date (YYYY-MM-DD)"""
        if isinstance(bs_date, str) and '/' in bs_date:
            try:
                bs_year, bs_month, bs_day = map(int, bs_date.split('/'))
                bs_date_obj = nepali_datetime.date(bs_year, bs_month, bs_day)
                ad_date_obj = bs_date_obj.to_datetime_date()  # Correct conversion method
                return ad_date_obj.strftime('%Y-%m-%d')  # Convert to string format
            except ValueError:
                raise serializers.ValidationError({"due_date": "Invalid BS date format. Use YYYY/MM/DD."})
        return bs_date  # If it's already in AD, return as is

    def to_internal_value(self, data):
        """Preprocess due_date before default validation"""
        if 'due_date' in data and isinstance(data['due_date'], str):
            data['due_date'] = self.convert_bs_to_ad(data['due_date'])  # Convert BS to AD before validation
        return super().to_internal_value(data)

    def create(self, validated_data):
        teacher = self.context.get('teacher')
        if not teacher:
            raise serializers.ValidationError("Teacher is required for creating an assignment.")
        return Assignment.objects.create(teacher=teacher, **validated_data)


class AssignmentSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentSubmission
        fields = ['id','assignment', 'student', 'submission_file','written_submission', 'submitted_on','review_text','is_checked']

class SubtopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtopic
        fields = ['id', 'name', 'is_completed']


class TopicSerializer(serializers.ModelSerializer):
    subtopics = SubtopicSerializer(many=True, required=False)

    class Meta:
        model = Topic
        fields = ['id', 'name', 'is_completed', 'subtopics']

    def create(self, validated_data):
        subtopics_data = validated_data.pop('subtopics', [])
        topic = Topic.objects.create(**validated_data)
        for subtopic_data in subtopics_data:
            Subtopic.objects.create(topic=topic, **subtopic_data)
        return topic

    def update(self, instance, validated_data):
        subtopics_data = validated_data.pop('subtopics', [])
        instance.name = validated_data.get('name', instance.name)
        instance.is_completed = validated_data.get('is_completed', instance.is_completed)
        instance.save()

        # Update subtopics
        for subtopic_data in subtopics_data:
            subtopic, created = Subtopic.objects.update_or_create(
                topic=instance, name=subtopic_data['name'],
                defaults={'is_completed': subtopic_data.get('is_completed', False)}
            )
        return instance


class ChapterSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True, required=False)

    class Meta:
        model = Chapter
        fields = ['id', 'name', 'topics']

    def create(self, validated_data):
        topics_data = validated_data.pop('topics', [])
        chapter = Chapter.objects.create(**validated_data)
        for topic_data in topics_data:
            subtopics_data = topic_data.pop('subtopics', [])
            topic = Topic.objects.create(chapter=chapter, **topic_data)

            for subtopic_data in subtopics_data:
                Subtopic.objects.create(topic=topic, **subtopic_data)

        return chapter


class SyllabusSerializer(serializers.ModelSerializer):
    chapters = ChapterSerializer(many=True, required=False)
    subject_name = serializers.CharField(source='subject.subject_name', read_only=True)
    teacher_name = serializers.CharField(source='teacher.user.username', read_only=True)
    class_name = serializers.CharField(source='class_assigned.class_name', read_only=True)

    class Meta:
        model = Syllabus
        fields = ['id', 'class_assigned', 'class_name', 'subject', 'subject_name', 'teacher', 'teacher_name', 'chapters', 'created_at', 'updated_at']

    def create(self, validated_data):
        chapters_data = validated_data.pop('chapters', [])
        syllabus = Syllabus.objects.create(**validated_data)

        for chapter_data in chapters_data:
            topics_data = chapter_data.pop('topics', [])
            chapter = Chapter.objects.create(syllabus=syllabus, **chapter_data)

            for topic_data in topics_data:
                subtopics_data = topic_data.pop('subtopics',[])
                topic = Topic.objects.create(chapter=chapter, **topic_data)

                for subtopic_data in subtopics_data:
                    Subtopic.objects.create(topic=topic, **subtopic_data)
        return syllabus

class DiscussionPostSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = DiscussionPost
        fields = ['id', 'topic', 'content', 'created_by', 'created_at']


class DiscussionCommentSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')
    replies = serializers.SerializerMethodField()

    class Meta:
        model = DiscussionComment
        fields = ['id', 'post', 'parent', 'content', 'created_by', 'created_at', 'replies']

    def get_replies(self, obj):
        replies = DiscussionComment.objects.filter(parent=obj)
        return DiscussionCommentSerializer(replies, many=True).data


class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ['id', 'name', 'is_timetable_published', 'is_result_published']



import nepali_datetime

class ExamDetailSerializer(serializers.ModelSerializer):
    created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = ExamDetail
        fields = ['exam', 'subject', 'full_marks', 'pass_marks', 'exam_date', 'exam_time', 'class_assigned', 'created_by']
        read_only_fields = ['class_assigned', 'created_by']

    def convert_bs_to_ad(self, bs_date):
        """Convert BS date (YYYY/MM/DD) to AD date (YYYY-MM-DD)"""
        if isinstance(bs_date, str) and '/' in bs_date:
            try:
                bs_year, bs_month, bs_day = map(int, bs_date.split('/'))
                bs_date_obj = nepali_datetime.date(bs_year, bs_month, bs_day)
                ad_date_obj = bs_date_obj.to_datetime_date()  # Correct conversion method
                return ad_date_obj.strftime('%Y-%m-%d')  # Convert to string format
            except ValueError:
                raise serializers.ValidationError({"exam_date": "Invalid BS date format. Use YYYY/MM/DD."})
        return bs_date  # If it's already in AD, return as is

    def to_internal_value(self, data):
        """Preprocess exam_date before default validation"""
        if 'exam_date' in data and isinstance(data['exam_date'], str):
            data['exam_date'] = self.convert_bs_to_ad(data['exam_date'])  # Convert BS to AD before validation
        return super().to_internal_value(data)

    def validate(self, data):
        # Check if class_assigned needs to be automatically filled based on the subject
        if not data.get('class_assigned'):
            subject = data.get('subject')
            associated_classes = subject.classes.all()
            if associated_classes.count() == 1:
                data['class_assigned'] = associated_classes.first()
            elif associated_classes.count() > 1:
                raise serializers.ValidationError(f"The subject '{subject.subject_name}' is associated with multiple classes. Please specify the class explicitly.")
            else:
                raise serializers.ValidationError(f"The subject '{subject.subject_name}' is not associated with any class.")
        return data

    def update(self, instance, validated_data):
        # Check if the request context is passed and set the 'created_by' accordingly
        request = self.context.get('request')
        if request and request.user:
            instance.created_by = request.user
        # Call the parent `update` method to save the validated data
        return super().update(instance, validated_data)



class GetExamDetailSerializer(serializers.ModelSerializer):
    exam = serializers.SerializerMethodField()  # Field to fetch exam details
    subject_details = serializers.SerializerMethodField()  # Field to fetch subject details
    class_details = serializers.SerializerMethodField()  # Field to fetch class details

    class Meta:
        model = ExamDetail
        fields = ['id', 'exam', 'full_marks', 'pass_marks', 'exam_date', 'exam_time', 'subject_details', 'class_details']  # Added exam_time

    def get_exam(self, obj):
        return {
            "id": obj.exam.id,
            "name": obj.exam.name,
        }

    def get_subject_details(self, obj):
        return {
            "id": obj.subject.id,
            "subject_code": obj.subject.subject_code,
            "subject_name": obj.subject.subject_name
        }

    def get_class_details(self, obj):
        return {
            "id": obj.class_assigned.id,
            "class_code": obj.class_assigned.class_code,
            "class_name": obj.class_assigned.class_name,
            "subject_details": [
                {
                    "id": subject.id,
                    "subject_code": subject.subject_code,
                    "subject_name": subject.subject_name
                }
                for subject in obj.class_assigned.subjects.all()
            ]
        }



class StudentResultSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')  # To show the creator's username

    class Meta:
        model = StudentResult
        fields = [
            'id', 'student', 'exam_detail', 'practical_marks', 'theory_marks',
            'total_marks', 'percentage', 'gpa', 'created_by', 'created_at'
        ]

class GetStudentResultSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')  # Display the creator's username
    student_details = serializers.SerializerMethodField()  # Fetch student details
    exam_detail = serializers.SerializerMethodField()  # Fetch detailed exam information

    class Meta:
        model = StudentResult
        fields = [
            'id', 'student_details', 'exam_detail', 'practical_marks', 'theory_marks',
            'total_marks', 'percentage', 'gpa', 'created_by', 'created_at'
        ]

    def get_student_details(self, obj):
        student = obj.student
        return {
            "id": student.id,
            "username": student.user.username,
            "email": student.user.email,
            "full_name": f"{student.user.first_name} {student.user.last_name}",
            "gender": student.gender,
            "address": student.address,
            "phone": student.phone,
            "date_of_birth": student.date_of_birth
        }

    def get_exam_detail(self, obj):
        exam_detail = obj.exam_detail
        return {
            "id": exam_detail.id,
            "exam": {
                "id": exam_detail.exam.id,
                "name": exam_detail.exam.name
            },
            "subject": {
                "id": exam_detail.subject.id,
                "subject_code": exam_detail.subject.subject_code,
                "subject_name": exam_detail.subject.subject_name
            },
            "class_assigned": {
                "id": exam_detail.class_assigned.id,
                "class_code": exam_detail.class_assigned.class_code,
                "class_name": exam_detail.class_assigned.class_name
            },
            "full_marks": exam_detail.full_marks,
            "pass_marks": exam_detail.pass_marks,
            "exam_date": exam_detail.exam_date
        }

from .models import Message
class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    receiver_username = serializers.CharField(source='receiver.username', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'content', 'timestamp', 'is_read', 'sender_username', 'receiver_username']



class NotesSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')  # Show teacher's username
    class_code = serializers.SerializerMethodField()  # Auto-fetch class name

    class Meta:
        model = Notes
        fields = '__all__'

    def get_class_code(self, obj):  
        return obj.class_code.class_name if obj.class_code else None  # Fetch class name

    def create(self, validated_data):
        request = self.context.get('request')  # Get the request object

        if not request or not request.user:
            raise serializers.ValidationError("User must be authenticated to create a note.")

        subject = validated_data.get('subject')
        related_classes = subject.classes.all()  # Fetch all classes linked to the subject

        if not related_classes.exists():
            raise serializers.ValidationError("This subject is not assigned to any class.")

        # Assign first available class and set logged-in user as the creator
        validated_data['class_code'] = related_classes.first()
        validated_data['created_by'] = request.user  

        return super().create(validated_data)
    
class GetNotesSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')  # Show teacher's username
    class_code = serializers.SerializerMethodField()  # Fetch class details
    subject = serializers.SerializerMethodField()  # Fetch subject details

    class Meta:
        model = Notes
        fields = '__all__'

    def get_class_code(self, obj):
        """Return class details (id, class_name, class_code)"""
        if obj.class_code:
            return {
                "id": obj.class_code.id,
                "class_name": obj.class_code.class_name,
                "class_code": obj.class_code.class_code,
            }
        return None

    def get_subject(self, obj):
        """Return subject details instead of just the ID"""
        if obj.subject:
            return {
                "id": obj.subject.id,
                "subject_name": obj.subject.subject_name,
                "subject_code": obj.subject.subject_code,
            }
        return None



class DailyAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyAttendance
        fields = ['student', 'date', 'status', 'recorded_by']


class AttendanceDetailSerializer(serializers.ModelSerializer):
    student = GetStudentSerializer()
    status = serializers.BooleanField()

    class Meta:
        model = DailyAttendance
        fields = ['student', 'status', 'date']


class StudentListAttendanceSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    class_details = serializers.SerializerMethodField()
    pre_balance = serializers.SerializerMethodField()  # New field for balance

    class Meta:
        model = Student
        fields = ['id', 'full_name', 'roll_no', 'parents', 'class_details', 'pre_balance']  # Added pre_balance

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip()

    def get_class_details(self, obj):
        if obj.class_code:
            return {
                "id": obj.class_code.id,
                "class_name": obj.class_code.class_name,
                "class_code": obj.class_code.class_code,
            }
        return None

    def get_pre_balance(self, obj):
        """ Fetch the last transaction balance of the student. """
        last_transaction = (
            StudentTransaction.objects.filter(student=obj)
            .order_by('-transaction_date')
            .first()
        )
        return last_transaction.balance if last_transaction else 0  # Default to 0 if no transaction


    
class SimpleAttendanceSerializer(serializers.ModelSerializer):
    student = StudentListAttendanceSerializer()
    date = serializers.DateField()
    status = serializers.BooleanField()

    class Meta:
        model = DailyAttendance
        fields = ['student', 'date', 'status']


class FeeCategoryNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeCategoryName
        fields = ('id', 'name')

class FeeCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeCategory
        fields = ['class_assigned', 'fee_category_name', 'amount']

class GetFeeCategorySerializer(serializers.ModelSerializer):
    class_assigned = ClassDetailSerializer()  # Nest Class details
    fee_category_name = FeeCategoryNameSerializer()  # Nest Fee Category details

    class Meta:
        model = FeeCategory
        fields = ['id', 'class_assigned', 'fee_category_name', 'amount']

class TransportationFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransportationFee
        fields = ('id', 'place', 'amount')

class StudentBillFeeCategorySerializer(serializers.ModelSerializer):
    fee_category_name = serializers.CharField(source='fee_category.fee_category_name.name', read_only=True)
    amount = serializers.DecimalField(source='fee_category.amount', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = StudentBillFeeCategory
        fields = ['id', 'fee_category', 'fee_category_name', 'amount', 'scholarship']


from decimal import Decimal
from rest_framework import serializers
from .models import Student, StudentBill, StudentTransaction, StudentBillFeeCategory

class StudentBillSerializer(serializers.ModelSerializer):
    fee_categories = serializers.ListField(write_only=True)  # Accept a list of fee categories

    class Meta:
        model = StudentBill
        fields = ['id', 'student', 'month', 'date', 'bill_number', 'fee_categories', 'transportation_fee', 'remarks', 'subtotal', 'discount', 'total_amount']
        extra_fields = ['pre_balance', 'post_balance']

    def get_pre_balance(self, obj):
        last_transaction = obj.student.transactions.order_by('-transaction_date').first()
        return last_transaction.balance if last_transaction else 0

    def get_post_balance(self, obj):
        return self.get_pre_balance(obj) + obj.total_amount  # Adding the bill amount

    def create(self, validated_data):
        fee_categories_data = validated_data.pop('fee_categories', [])  # Extract fee categories

        # Create the bill first
        bill = StudentBill.objects.create(**validated_data)

        # Add fee categories with scholarship status
        for fee_data in fee_categories_data:
            StudentBillFeeCategory.objects.create(
                student_bill=bill,
                fee_category_id=fee_data['fee_category'],  # Ensure this is an ID
                scholarship=fee_data.get('scholarship', False)  # Default to False if not provided
            )

        # Calculate and save totals
        bill.calculate_totals()

        # Fetch the last transaction for the student based on transaction_date
        last_transaction = (
            StudentTransaction.objects.filter(student=bill.student)
            .order_by('-transaction_date')
            .first()
        )

        # Default to 0 balance if no previous transaction exists
        last_balance = last_transaction.balance if last_transaction else Decimal('0.00')

        # Add bill amount to the last balance
        new_balance = last_balance + Decimal(str(bill.total_amount))

        # Create the corresponding StudentTransaction instance for the bill
        StudentTransaction.objects.create(
            student=bill.student,
            transaction_type='bill',
            bill=bill,
            balance=new_balance,
            transaction_date=bill.date  # Set the transaction date to the bill's date
        )

        return bill


class GetStudentBillSerializer(serializers.ModelSerializer):
    student = serializers.SerializerMethodField()
    fee_categories = serializers.SerializerMethodField()
    transportation_fee = serializers.SerializerMethodField()
    pre_balance = serializers.SerializerMethodField()
    post_balance = serializers.SerializerMethodField()

    class Meta:
        model = StudentBill
        fields = [
            'student', 'month','bill_number', 'date', 'fee_categories', 'transportation_fee',
            'remarks', 'subtotal', 'discount', 'total_amount',
            'pre_balance', 'post_balance'  # Added pre and post balance
        ]

    def get_student(self, obj):
        return {
            'id': obj.student.id,
            'name': obj.student.user.get_full_name(),
            'roll_no': obj.student.roll_no,
            'class': obj.student.class_code.class_name,
            'phone': obj.student.phone,
            'address': obj.student.address,
            'date_of_birth': obj.student.date_of_birth,
            'gender': obj.student.gender,
            'parents': obj.student.parents
        }

    def get_fee_categories(self, obj):
        fee_categories = obj.studentbillfeecategory_set.all()
        return [
            {
                'id': fc.fee_category.id,
                'fee_category': fc.fee_category.fee_category_name.name,
                'amount': "0" if fc.scholarship else str(fc.fee_category.amount),  # Set amount to "0" if scholarship is True
                'scholarship': fc.scholarship
            }
            for fc in fee_categories
        ]


    def get_transportation_fee(self, obj):
        if obj.transportation_fee:
            return {
                'id': obj.transportation_fee.id,
                'name': obj.transportation_fee.place,
                'amount': str(obj.transportation_fee.amount)
            }
        return None

    def get_pre_balance(self, obj):
        last_transaction = StudentTransaction.objects.filter(
            student=obj.student, transaction_date__lt=obj.date
        ).order_by('-transaction_date').first()

        return last_transaction.balance if last_transaction else 0

    def get_post_balance(self, obj):
        return self.get_pre_balance(obj) + obj.total_amount  # Adding the bill amount


class StudentPaymentSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())
    created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())  
    amount_paid = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    pre_balance = serializers.SerializerMethodField()
    post_balance = serializers.SerializerMethodField()

    class Meta:
        model = StudentPayment
        fields = ('id', 'student', 'created_by', 'date', 'payment_number', 'amount_paid', 'remarks', 'pre_balance', 'post_balance')

    def get_pre_balance(self, obj):
        """Fetch last transaction balance before this payment."""
        last_transaction = (
            StudentTransaction.objects.filter(student=obj.student)
            .order_by('-transaction_date')
            .only("balance")  # Fetch only balance field
            .first()
        )
        return last_transaction.balance if last_transaction else Decimal('0.00')

    def get_post_balance(self, obj):
        """Calculate post balance dynamically."""
        return self.get_pre_balance(obj) - obj.amount_paid

    def validate(self, data):
        """Ensure amount paid is non-negative."""
        if data.get("amount_paid", Decimal("0.00")) < 0:
            raise serializers.ValidationError("Amount paid cannot be negative.")
        return data

    def create(self, validated_data):
        """Process payment creation and update transactions."""
        request = self.context.get("request")
        pre_balance = self.context.get("pre_balance", Decimal("0.00"))  # Pass from API view
        validated_data["created_by"] = request.user if request else None

        # Create payment
        payment = StudentPayment.objects.create(**validated_data)
        post_balance = pre_balance - payment.amount_paid

        # Create corresponding transaction
        StudentTransaction.objects.create(
            student=payment.student,
            transaction_type="payment",
            payment=payment,
            balance=post_balance,
            transaction_date=payment.date
        )

        return payment


class GetStudentPaymentSerializer(serializers.ModelSerializer):
    student = serializers.SerializerMethodField()
    created_by = serializers.CharField(source="created_by.username", read_only=True)  # Show username
    pre_balance = serializers.SerializerMethodField()
    post_balance = serializers.SerializerMethodField()

    class Meta:
        model = StudentPayment
        fields = [
            'student', 'created_by', 'date', 'payment_number', 'amount_paid', 'remarks',
            'pre_balance', 'post_balance'
        ]

    def get_student(self, obj):
        return {
            'id': obj.student.id,
            'name': obj.student.user.get_full_name(),
            'roll_no': obj.student.roll_no,
            'class': obj.student.class_code.class_name,
            'phone': obj.student.phone,
            'address': obj.student.address,
            'date_of_birth': obj.student.date_of_birth,
            'gender': obj.student.gender,
            'parents': obj.student.parents
        }

    def get_pre_balance(self, obj):
        last_transaction = StudentTransaction.objects.filter(
            student=obj.student, transaction_date__lt=obj.date
        ).order_by('-transaction_date').first()
        return last_transaction.balance if last_transaction else 0

    def get_post_balance(self, obj):
        return self.get_pre_balance(obj) - obj.amount_paid

class StudentTransactionSerializer(serializers.ModelSerializer):
    bill = serializers.SerializerMethodField()
    bill_number = serializers.SerializerMethodField()
    payment = serializers.SerializerMethodField()
    payment_number = serializers.SerializerMethodField()
    total_amount = serializers.SerializerMethodField()
    paid_amount = serializers.SerializerMethodField()
    month = serializers.SerializerMethodField()  # New field for month
    remarks = serializers.SerializerMethodField()  # New field for remarks

    class Meta:
        model = StudentTransaction
        fields = [
            "transaction_type", "bill", "bill_number", "payment", "payment_number", 
            "balance", "transaction_date", "total_amount", "paid_amount", "month", "remarks"
        ]

    def get_bill(self, obj):
        return obj.bill.id if obj.bill else None

    def get_bill_number(self, obj):
        return obj.bill.bill_number if obj.bill else None

    def get_payment(self, obj):
        return obj.payment.id if obj.payment else None

    def get_payment_number(self, obj):
        return obj.payment.payment_number if obj.payment else None

    def get_total_amount(self, obj):
        """ Return total amount if it's a bill; otherwise, return None. """
        return obj.bill.total_amount if obj.transaction_type == "bill" and obj.bill else None

    def get_paid_amount(self, obj):
        """ Return paid amount if it's a payment; otherwise, return None. """
        return obj.payment.amount_paid if obj.transaction_type == "payment" and obj.payment else None

    def get_month(self, obj):
        """ Return the month from the bill; set to None if it's a payment. """
        return obj.bill.month if obj.transaction_type == "bill" and obj.bill else None

    def get_remarks(self, obj):
        """ Return remarks from either bill or payment based on transaction type. """
        if obj.transaction_type == "bill" and obj.bill:
            return obj.bill.remarks
        elif obj.transaction_type == "payment" and obj.payment:
            return obj.payment.remarks
        return None


class CommunicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Communication
        fields = ["id", "sender", "receiver", "message", "receiver_role", "sent_at"]
        read_only_fields = ["id", "sender", "sent_at"]

    def validate(self, data):
        """
        Ensure that either receiver OR receiver_role is provided.
        """
        receiver = data.get("receiver")
        receiver_role = data.get("receiver_role")

        if not receiver and not receiver_role:
            raise serializers.ValidationError("Either receiver or receiver_role must be provided.")
        
        return data

    def create(self, validated_data):
        """
        Assign the sender as the logged-in user before saving.
        """
        validated_data["sender"] = self.context["request"].user
        return super().create(validated_data)

class GetCommunicationSerializer(serializers.ModelSerializer):
    """Serializer to get full details of sender & receiver instead of just IDs"""
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True, allow_null=True)

    class Meta:
        model = Communication
        fields = '__all__'  # Includes sender & receiver as full objects


class FinanceSummarySerializer(serializers.Serializer):
    total_fees_collected = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_outstanding_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_transaction_count = serializers.IntegerField()