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


# Serializer for the subjects
class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'subject_code', 'subject_name']


class ClassSerializer(serializers.ModelSerializer):
    # subjects = SubjectSerializer(many=True)
    subjects = serializers.ListField(
        child = serializers.DictField(), # Accept a list of dictionaries
        write_only=True  # Only for input, won't include in the response
    )
    subject_details = SubjectSerializer(source='subjects', many=True, read_only=True)

    class Meta:
        model = Class
        fields = ['id', 'class_code', 'class_name', 'subjects','subject_details']  # Define fields to include in the serialized output
    
    def create(self, validated_data):
        # Extract the nested subjects data
        subjects_data = validated_data.pop('subjects', [])

        # Create the class instance
        class_instance = Class.objects.create(**validated_data)

        # Create or get Subject instances and add them to the class
        for subject_data in subjects_data:
            # Find or create the subject
            # subject, created = Subject.objects.get_or_create(**subject_data)
            subject, _ = Subject.objects.get_or_create(
                subject_code=subject_data['subject_code'],
                defaults={'subject_name': subject_data['subject_name']}
            )

            class_instance.subjects.add(subject)

        return class_instance
    def update(self, instance, validated_data):
        subjects_data = validated_data.pop('subjects', [])
        instance.class_code = validated_data.get('class_code', instance.class_code)
        instance.class_name = validated_data.get('class_name', instance.class_name)
        instance.save()

        if subjects_data:
            # Clear existing subjects if updating
            instance.subjects.clear()
            # Add new subjects to the class
            for subject_data in subjects_data:
                # Find or create the subject
                subject, _ = Subject.objects.get_or_create(
                    subject_code=subject_data['subject_code'],
                    defaults={'subject_name': subject_data['subject_name']}
                )
                # Associate subject with the class
                instance.subjects.add(subject)

        return instance
    
# Serializer for the Teacher model
class TeacherSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Nested serializer for the user associated with the teacher
    # subjects = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all(), many=True)
    # subjects = SubjectSerializer(many=True)  # Nested serializer for subjects
    
    subjects = serializers.ListField(
        child = serializers.DictField(), # Accept a list of dictionaries
        write_only=True  # Only for input, won't include in the response
    )
    subject_details = SubjectSerializer(source='subjects', many=True, read_only=True)
    # classes = serializers.PrimaryKeyRelatedField(queryset=Class.objects.all(), many=True)
    # classes = ClassSerializer(many=True)  # Nested serializer for classes
    classes = serializers.ListField(
        child = serializers.DictField(), # Accept a list of dictionaries
        write_only=True  # Only for input, won't include in the response
    )
    class_details = ClassSerializer(source='classes', many=True, read_only=True)
    
    class_teacher = serializers.PrimaryKeyRelatedField(queryset=Class.objects.all(), allow_null=True, required=False)

    class Meta:
        model = Teacher
        fields = ['id','user', 'phone', 'address', 'date_of_joining', 'gender', 'subjects','subject_details', 'classes','class_details','class_teacher']
        extra_kwargs = {'user.password': {'write_only': True}}

    def create(self, validated_data):
        # Extract user data from the validated data
        user_data = validated_data.pop('user')
        subjects_data = validated_data.pop('subjects', [])
        classes_data = validated_data.pop('classes', [])
        class_teacher = validated_data.pop('class_teacher', None)

        # Create the user associated with the teacher
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            user.is_teacher = True
            user.save()
            # Create the Teacher instance without subjects and classes
            teacher = Teacher.objects.create(user=user, **validated_data)
            
            
            # Create or get Subject instances
            subject_instances = []
            for subject_data in subjects_data:
                subject, _ = Subject.objects.get_or_create(
                subject_code=subject_data['subject_code'],
                defaults={'subject_name': subject_data['subject_name']}
            )
            subject_instances.append(subject)

            # Assign subjects to the teacher
            teacher.subjects.set(subject_instances)

            # Create or get Class instances
            class_instances = []
            for class_data in classes_data:
                class_instance, _ = Class.objects.get_or_create(
                    class_code=class_data['class_code'],
                    defaults={'class_name': class_data['class_name']}
                )
                class_instances.append(class_instance)

            # Assign classes to the teacher
            teacher.classes.set(class_instances)




            # Assign class_teacher if provided
            if class_teacher:
                teacher.class_teacher = class_teacher
            teacher.save()

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
    subjects = SubjectSerializer(many=True, source='classes.subjects', read_only=True)  # Dynamically get subjects from the associated class
    #parents = serializers.PrimaryKeyRelatedField(queryset=Parent.objects.all(), many=True)  # Handle multiple parent relationships
    class_code = serializers.PrimaryKeyRelatedField(queryset=Class.objects.all())
    
    class Meta:
        model = Student
        # Define which fields should be included in the serialized output
        fields = ['id','user', 'phone', 'address', 'date_of_birth', 'parents', 'gender',
                'class_code','subjects'
                ]
        # Ensure password is write-only (won't be returned in response)
        extra_kwargs = {'user.password': {'write_only': True}}

    def validate_classes(self, value):
        """
        Validate the `classes` value and retrieve the corresponding class instance.
        """
        try:
            class_instance = Class.objects.get(classes=value)
            return class_instance
        except Class.DoesNotExist:
            raise serializers.ValidationError(f"Class with code '{value}' does not exist.")
        # return class_instance

    def create(self, validated_data):
        # Extract user and parents data from the validated data
        user_data = validated_data.pop('user')
        class_instance = validated_data.pop('class_code')
        # Mark the user as a student
        user_data['is_student'] = True

        # Serialize the user data
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            # Save the user and get the created user instance
            user = user_serializer.save()

            # Create and save the Student instance
            student = Student.objects.create(user=user, class_code=class_instance, **validated_data)
            # student.classes.add(class_instance) # Use `add()` to associate the class
            return student
        else:
            # Raise validation error if user data is invalid
            raise serializers.ValidationError(user_serializer.errors)
        
    def update(self, instance, validated_data):
        # Extract user data and classes
        user_data = validated_data.pop('user', {})
        class_instance = validated_data.pop('classes', None)

        # Update user data
        user_serializer = UserSerializer(instance=instance.user, data=user_data, partial=True)
        if user_serializer.is_valid():
            user = user_serializer.save()
            user.is_student = True  # Ensure is_student is set to True on update
            user.save()
        else:
            raise serializers.ValidationError(user_serializer.errors)

        # Update other fields of the Student instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if class_instance:
            # instance.classes.set([class_instances])  # Update associated classes
            instance.classes = class_instance  # Update associated class
        return instance
       
class StaffSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Nested serializer for the user associated with the staff

    class Meta:
        model = Staff
        fields = ['id','user', 'phone', 'address', 'date_of_joining', 'gender', 'role']
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
        read_only_fields = ['applicant', 'applicant_type', 'applicant_name', 'applied_on', 'status']

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



from .models import Assignment, AssignmentSubmission

class AssignmentSerializer(serializers.ModelSerializer):
    class_assigned = serializers.SlugRelatedField(
        queryset=Class.objects.all(),  # Fetch class based on `class_name`
        slug_field='class_name'        # Use `class_name` for representation and lookup
    )

    class Meta:
        model = Assignment
        fields = ['id','teacher','subject', 'class_assigned', 'assignment_name', 'description', 'due_date', 'assigned_on']
        read_only_fields = ['teacher']  # Make `teacher` read-only

    def create(self, validated_data):
        teacher = self.context.get('teacher')
        if not teacher:
            raise serializers.ValidationError("Teacher is required for creating an assignment.")
        # teacher = validated_data.pop('teacher', None)
        return Assignment.objects.create(teacher=teacher, **validated_data)

class AssignmentSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentSubmission
        fields = ['assignment', 'student', 'submission_file', 'submitted_on']

class SyllabusSerializer(serializers.ModelSerializer):
    completion_percentage = serializers.SerializerMethodField()
    subject_name = serializers.CharField(source='subject.subject_name', read_only=True)
    teacher_name = serializers.CharField(source='teacher.user.username', read_only=True)
    class_name = serializers.CharField(source='class_assigned.class_name', read_only=True)

    class Meta:
        model = Syllabus
        # fields = '__all__'
        fields = [
            'id',
            'class_assigned',
            'class_name',
            'subject',
            'subject_name',
            'teacher',
            'teacher_name',
            'topics',
            'completed_topics',
            'completion_percentage',
            'created_at',
            'updated_at'
        ]
        # fields = ['id', 'class_assigned', 'subject', 'teacher', 'topics', 'completed_topics', 'completion_percentage', 'created_at', 'updated_at']
        extra_kwargs = {
            'class_assigned': {'read_only': True},
            'subject': {'read_only': True},
            'teacher': {'read_only': True},
            'topics': {'required': True}
        }

    def get_completion_percentage(self, obj):
        return obj.get_completion_percentage()

class FeePaymentHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FeePaymentHistory
        fields = [
            'id',
            'fee_record',
            'amount_paid',
            'payment_date',
            'mode_of_payment',
            'transaction_id',
            'notes'
        ]
        read_only_fields = ['id', 'payment_date']

class FeesSerializer(serializers.ModelSerializer):
    payment_history = FeePaymentHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Fees
        fields = [
            'id',
            'student',
            'total_amount',
            'amount_paid',
            'pending_amount',
            'due_date',
            'last_payment_date',
            'status',
            'created_at',
            'updated_at',
            'payment_history',
        ]
        read_only_fields = ['id', 'pending_amount', 'status', 'created_at', 'updated_at']

    def update(self, instance, validated_data):
        """
        Override the update method to handle updating the amount_paid and recalculate pending_amount.
        """
        instance.amount_paid = validated_data.get('amount_paid', instance.amount_paid)
        instance.save()
        return instance
    
# from rest_framework import serializers
# from .models import StaffLocation

# class StaffLocationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = StaffLocation
#         fields = ['staff', 'latitude', 'longitude', 'timestamp']




class DiscussionTopicSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = DiscussionTopic
        fields = ['id', 'title', 'description', 'created_by', 'created_at']


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
