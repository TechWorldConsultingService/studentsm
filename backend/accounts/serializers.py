from rest_framework import serializers
from accounts.models import *

# Serializer for the CustomUser model
class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        # Fields to be included in the serialized representation
        fields = ('username', 'email', 'password', 'first_name', 'last_name', 'is_master', 'is_principal', 'is_teacher', 'is_student')
        # Ensure password is write-only (won't be returned in response)
        extra_kwargs = {'password': {'write_only': True}}

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

# Serializer for user registration
class RegisterSerializer(serializers.ModelSerializer):
    # Password field (write-only to avoid being returned in responses)
    password = serializers.CharField(write_only=True)
    # Role field with predefined choices
    role = serializers.ChoiceField(choices=[('master', 'Master'), ('principal', 'Principal'), ('teacher', 'Teacher'), ('student', 'Student')])

    class Meta:
        model = CustomUser
        # Fields to be included in the serialized representation
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'role']
        # Ensure password is write-only (won't be returned in response)
        extra_kwargs = {'password': {'write_only': True}}

    # Method to create a new user with the provided validated data
    def create(self, validated_data):
        # Extract role from validated data
        role = validated_data.pop('role')
        # Create a new user instance with the remaining validated data
        user = CustomUser(**validated_data)
        
        # Set the appropriate role based on the provided role
        if role == 'master':
            user.is_master = True
        elif role == 'principal':
            user.is_principal = True
        elif role == 'teacher':
            user.is_teacher = True
        elif role == 'student':
            user.is_student = True
        
        # Set the user's password
        user.set_password(validated_data['password'])
        # Save the user instance to the database
        user.save()
        return user

