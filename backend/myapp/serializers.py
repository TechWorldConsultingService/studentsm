from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *
from accounts.models import *

# Serializer for the CustomUser model
class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        # Define which fields should be included in the serialized output
        fields = ('username', 'email', 'password', 'first_name', 'last_name', 'is_master', 'is_principal', 'is_teacher', 'is_student')
        # Ensure the password field is write-only (won't be returned in API responses)
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user

# Serializer for the Teacher model
class TeacherSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Nested serializer for the user associated with the teacher

    class Meta:
        model = Teacher
        # Define which fields should be included in the serialized output
        fields = ['user', 'phone', 'address', 'date_of_joining']
        # Ensure password is write-only (won't be returned in response)
        extra_kwargs = {'user.password': {'write_only': True}}

    def create(self, validated_data):
        # Extract user data from the validated data
        user_data = validated_data.pop('user')
        # Mark the user as a teacher
        user_data['is_teacher'] = True
        # Serialize the user data
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            # Save the user and get the created user instance
            user = user_serializer.save()
            # Create and save the Teacher instance
            teacher = Teacher.objects.create(user=user, **validated_data)
            return teacher
        else:
            # Raise validation error if user data is invalid
            raise serializers.ValidationError(user_serializer.errors)

# Serializer for the Principal model
class PrincipalSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Nested serializer for the user associated with the principal

    class Meta:
        model = Principal
        # Define which fields should be included in the serialized output
        fields = ['user', 'phone', 'address']
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

# Serializer for the Student model
class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Nested serializer for the user associated with the student
    parents = serializers.PrimaryKeyRelatedField(queryset=Parent.objects.all(), many=True)  # Handle multiple parent relationships


    class Meta:
        model = Student
        # Define which fields should be included in the serialized output
        fields = ['user', 'phone', 'address', 'date_of_birth', 'parents']
        # Ensure password is write-only (won't be returned in response)
        extra_kwargs = {'user.password': {'write_only': True}}

    def create(self, validated_data):
        # Extract user and parents data from the validated data
        user_data = validated_data.pop('user')
        parents_data = validated_data.pop('parents')
        # Mark the user as a student
        user_data['is_student'] = True
        # Serialize the user data
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            # Save the user and get the created user instance
            user = user_serializer.save()
            # Create and save the Student instance
            student = Student.objects.create(user=user, **validated_data)
            # Set the parents for the student
            student.parents.set(parents_data)
            return student
        else:
            # Raise validation error if user data is invalid
            raise serializers.ValidationError(user_serializer.errors)


# Serializer for the leave application model
class LeaveApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveApplication
        fields = ['applicant', 'applicant_type', 'applied_on', 'leave_date', 'message', 'status', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Ensure the applicant and applicant_type are set from the view
        return LeaveApplication.objects.create(**validated_data)