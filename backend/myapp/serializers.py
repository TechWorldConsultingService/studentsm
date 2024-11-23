from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *
from accounts.models import *
from .models import Post


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
            'is_staff',
            'role'
            )
        # Ensure the password field is write-only (won't be returned in API responses)
        extra_kwargs = {
            'password': {'write_only': True},
            'is_master': {'read_only': True},
            'is_principal': {'read_only': True},
            'is_teacher': {'read_only': True},
            'is_student': {'read_only': True},
            'is_staff': {'read_only': True},
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
        elif obj.is_staff:
            return "Staff"
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

# Serializer for the Teacher model
class TeacherSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Nested serializer for the user associated with the teacher

    class Meta:
        model = Teacher
        fields = ['user', 'phone', 'address', 'date_of_joining', 'gender', 'subjects', 'classes','class_teacher']
        extra_kwargs = {'user.password': {'write_only': True}}

    def create(self, validated_data):
        # Extract user data from the validated data
        user_data = validated_data.pop('user')
        subjects_data = validated_data.pop('subjects', [])
        classes_data = validated_data.pop('classes', [])

        # Create the user associated with the teacher
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            # Create the Teacher instance without subjects and classes
            teacher = Teacher.objects.create(user=user, **validated_data)
            
            # Assign subjects and classes using .set() to handle many-to-many relationships
            if subjects_data:
                teacher.subjects.set(subjects_data)
            if classes_data:
                teacher.classes.set(classes_data)

            return teacher
        else:
            raise serializers.ValidationError(user_serializer.errors)
        
    def update(self, instance, validated_data):
        # Extract and update user data
        user_data = validated_data.pop('user', {})
        user_serializer = UserSerializer(instance=instance.user, data=user_data, partial=True)
        if user_serializer.is_valid():
            user = user_serializer.save()
            # Ensure the user is marked as a teacher
            user.is_teacher = True
            user.save()
        else:
            raise serializers.ValidationError(user_serializer.errors)

        # Update the Teacher instance
        for attr, value in validated_data.items():
            if attr in ['subjects', 'classes']:
                getattr(instance, attr).set(value)  # Update many-to-many relationships
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance


# Serializer for the Principal model
class PrincipalSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Nested serializer for the user associated with the principal

    class Meta:
        model = Principal
        # Define which fields should be included in the serialized output
        fields = ['user', 'phone', 'address', 'gender']
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
        user_serializer = UserSerializer(instance=instance.user, data=user_data, partial=True)
        if user_serializer.is_valid():
            user = user_serializer.save()
            user.is_principal = True  # Ensure is_principal is set to True on update
            user.save()
        else:
            raise serializers.ValidationError(user_serializer.errors)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

# Serializer for the Student model
class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Nested serializer for the user associated with the student
    #parents = serializers.PrimaryKeyRelatedField(queryset=Parent.objects.all(), many=True)  # Handle multiple parent relationships


    class Meta:
        model = Student
        # Define which fields should be included in the serialized output
        fields = ['user', 'phone', 'address', 'date_of_birth', 'parents', 'gender', 'classes']
        # Ensure password is write-only (won't be returned in response)
        extra_kwargs = {'user.password': {'write_only': True}}

    def create(self, validated_data):
        # Extract user and parents data from the validated data
        user_data = validated_data.pop('user')
        # Mark the user as a student
        user_data['is_student'] = True
        # Serialize the user data
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            # Save the user and get the created user instance
            user = user_serializer.save()
            # Create and save the Student instance
            student = Student.objects.create(user=user, **validated_data)


            return student
        else:
            # Raise validation error if user data is invalid
            raise serializers.ValidationError(user_serializer.errors)
        
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user_serializer = UserSerializer(instance=instance.user, data=user_data, partial=True)
        if user_serializer.is_valid():
            user = user_serializer.save()
            user.is_student = True  # Ensure is_student is set to True on update
            user.save()
        else:
            raise serializers.ValidationError(user_serializer.errors)

        for attr, value in validated_data.items():
                setattr(instance, attr, value)
        instance.save()
        return instance
        


class StaffSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Nested serializer for the user associated with the staff

    class Meta:
        model = Staff
        fields = ['user', 'phone', 'address', 'date_of_joining', 'gender', 'role']
        extra_kwargs = {'user.password': {'write_only': True}}

    def create(self, validated_data):
        user_data = validated_data.pop('user')  # Extract user data
        # Mark the user as a student
        user_data['is_staff'] = True
        # Serialize the user data
        user_serializer = UserSerializer(data=user_data)

        if user_serializer.is_valid():
            # Save the user and get the created user instance
            user = user_serializer.save()
            # Create and save the Student instance
            staff = Staff.objects.create(user=user, **validated_data)  # Create staff profile
            return staff
        else:
            raise serializers.ValidationError(user_serializer.errors)
        
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user_serializer = UserSerializer(instance=instance.user, data=user_data, partial=True)
        if user_serializer.is_valid():
            user = user_serializer.save()
            user.is_staff = True  # Ensure is_staff is set to True on update
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
        fields = ['id','applicant','applicant_name', 'applicant_type', 'applied_on', 'leave_date', 'message', 'status', 'created_at', 'updated_at']

    def validate_leave_date(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError("Leave date cannot be in the past.")
        return value

    def create(self, validated_data):
        # Ensure the applicant and applicant_type are set from the view
        return LeaveApplication.objects.create(**validated_data)

# Serializer for the subjects
class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'subject_code', 'subject_name']


class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ['id', 'class_code', 'class_name']  # Define fields to include in the serialized output


class DailyAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyAttendance
        fields = ['student', 'date', 'status']

class LessonAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonAttendance
        fields = ['student', 'subject', 'date', 'status']


from .models import Event

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'start_time', 'end_time', 'created_by', 'created_at']


class AssignmentSerializer(serializers.ModelSerializer):
    # You can either use the default representation of the ForeignKey (which will be the primary key of the related model)
    subject = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all())  # This will handle the ForeignKey

    class Meta:
        model = Assignment
        fields = ['id', 'student', 'title', 'file', 'subject', 'submitted_at']
        read_only_fields = ['student', 'submitted_at']
