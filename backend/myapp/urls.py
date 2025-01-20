
from django.contrib import admin
from django.urls import path,include
from . import views
from django.conf import settings
from django.conf.urls.static import static
from .views import *
from .views import (
    AssignHomeworkView,
    FilterSubjectsView,
    StudentAssignmentsView,
    SubmitStudentAssignmentView,
    ReviewAssignmentsView,
)

urlpatterns = [
    # Admin site URL
    # path('dashboard/', admin.site.urls),  # URL for the Django admin dashboard

    # API endpoint for posts
    path('api/posts/', PostListCreateView.as_view(), name='post-list-create'),

    # API endpoints for user registration
    path('api/register/teacher/', RegisterTeacherView.as_view(), name='register-teacher'),  # URL for teacher registration API
    path('api/register/principal/', RegisterPrincipalView.as_view(), name='register-principal'),  # URL for principal registration API
    path('api/register/student/', RegisterStudentView.as_view(), name='register-student'),  # URL for student registration API
    path('api/register/staff/', RegisterStaffView.as_view(), name='register_staff'), # URL for staff registration API
    
     # API endpoints for user lists
    path('api/teachers/', TeacherListView.as_view(), name='teacher-list'),  # Endpoint for listing teachers
    path('api/principals/', PrincipalListView.as_view(), name='principal-list'),  # Endpoint for listing principals
    path('api/students/', StudentListView.as_view(), name='student-list'),  # Endpoint for listing students
    path('api/students-by-subject/', StudentsBySubjectView.as_view(), name='students-by-subject'),
    path('api/students-by-subject-and-class/', StudentsBySubjectAndClassView.as_view(), name='students-by-subject-and-class'),
    
    path('api/staffs/', StaffListView.as_view(), name='staff_list'), # Endpoint for listing staffs

    # API endpoints for viewing details of a specific record
    path('api/teachers/<int:pk>/', TeacherDetailView.as_view(), name='teacher-detail'),  # Endpoint for viewing a specific teacher
    path('api/principals/<int:pk>/', PrincipalDetailView.as_view(), name='principal-detail'),  # Endpoint for viewing a specific principal
    path('api/students/<int:pk>/', StudentDetailView.as_view(), name='student-detail'),  # Endpoint for viewing a specific student
    path('api/staff/<int:pk>/', StaffDetailView.as_view(), name='staff_detail'), # Endpoint for viewing a specific staff

    # API endpoints for deleting a specific record
    path('api/teachers/<int:pk>/delete/', TeacherDeleteView.as_view(), name='teacher-delete'),  # Endpoint for deleting a specific teacher
    path('api/principals/<int:pk>/delete/', PrincipalDeleteView.as_view(), name='principal-delete'),  # Endpoint for deleting a specific principal
    path('api/students/<int:pk>/delete/', StudentDeleteView.as_view(), name='student-delete'),  # Endpoint for deleting a specific student
    path('api/staff/<int:pk>/delete/', StaffDeleteView.as_view(), name='staff_delete'), # Endpoint for deleting a specific staff

    path('api/teacher/<int:pk>/update/', TeacherUpdateAPIView.as_view(), name='teacher-update'),
    path('api/principal/<int:pk>/update/', PrincipalUpdateAPIView.as_view(), name='principal-update'),
    path('api/student/<int:pk>/update/', StudentUpdateAPIView.as_view(), name='student-update'),
    path('api/staff/<int:pk>/update/', StaffUpdateAPIView.as_view(), name='staff-update'),

    # API endpoints for leave applications
    path("api/role/", get_user_role, name="get_user_role"), # to get the role
    path('api/total-leave-applications/', TotalLeaveApplicationListView.as_view(), name='total-leave-application-list'),  # Endpoint for listing all leave applications for the principal
    path('api/leave-applications/', LeaveApplicationListView.as_view(), name='leave-application-list'),  # Endpoint for listing all leave applications for the current user
    path('api/leave-applications/create/', LeaveApplicationCreateView.as_view(), name='leave-application-create'),  # Endpoint for creating a new leave application
    path('api/leave-applications/<int:pk>/', LeaveApplicationDetailView.as_view(), name='leave-application-detail'),  # Endpoint for   details, update, and delete of a specific leave application by ID
    path('api/leave-applications/<int:pk>/update-status/', LeaveApplicationStatusUpdateView.as_view(), name='leave-application-update-status'), # Endpoint for updating status of a leave application

    # API endpoints for subjects
    path('api/subjects/', SubjectListCreateView.as_view(), name='subject-list-create'),  # Endpoint for listing and creating subjects
    path('api/subjects/<int:pk>/', SubjectDetailView.as_view(), name='subject-detail'),  # Endpoint for subject details, update, and delete

    # API endpoints for classes
    path('api/classes/', ClassListCreateView.as_view(), name='class-list-create'),  # Endpoint for listing and creating classes
    # path('api/classes/<str:class_code>/', ClassDetailView.as_view(), name='class-detail'),  # Endpoint for class details, update, and delete
    path('api/classes/<int:pk>/', ClassDetailView.as_view(), name='class-detail'),  # Endpoint for class details, update, and delete
    
    # Daily Attendance URLs  (we may need to change class_id )
    path('api/classes/<int:class_id>/daily-attendance/', DailyAttendanceView.as_view(), name='daily-attendance-create'),
    path('api/classes/<int:class_id>/daily-attendance/<str:date>/', DailyAttendanceView.as_view(), name='daily-attendance-list'),

    # Lesson Attendance URLs
    path('api/classes/<int:class_id>/subjects/<int:subject_id>/lesson-attendance/', LessonAttendanceView.as_view(), name='lesson-attendance-create'),
    path('api/classes/<int:class_id>/subjects/<int:subject_id>/lesson-attendance/<str:date>/', LessonAttendanceView.as_view(), name='lesson-attendance-list'),

    path('api/events/', EventListView.as_view(), name='event-list'),
    path('api/events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),

    # Assign homework by the teacher
    path('api/assignments/assign/', AssignHomeworkView.as_view(), name='assign-homework'),
    
    # New endpoint for teachers to see their created assignments
    path('api/teacher/assignments/', TeacherAssignmentsView.as_view(), name='teacher-assignments'),
    
    #endpoint for student to see their assignments as per subject
    path('api/student/assignments/subject/', StudentAssignmentsBySubjectView.as_view(), name='student-assignments-by-subject'),

    # Filter subjects for a teacher and class
    path('api/filter-subjects/', FilterSubjectsView.as_view(), name='filter-subjects'),

    # Get assignments for students / to see all the assginments given by teacher
    path('api/student/assignments/', StudentAssignmentsView.as_view(), name='student-assignments'),
    
    # Submit assignment by the student
    path('api/submit-assignment/', SubmitStudentAssignmentView.as_view(), name='assignment-list'),
    
    # Review assignments by the teacher
    path('api/assignments/reviews/', ReviewAssignmentsView.as_view(), name='reviews-homework'),

    path('api/assignments/submissions/review/<int:submission_id>/', ReviewAssignmentSubmissionView.as_view(), name='review-assignment-submission'),


    path('api/syllabus/', SyllabusView.as_view(), name='syllabus-list'),
    path('api/syllabus/<int:pk>/', SyllabusDetailView.as_view(), name='syllabus-detail'),
    path('api/syllabus/class/<str:class_code>/', SyllabusPerClassView.as_view(), name='syllabus-per-class'), # to view syllabus as per class
    path('api/syllabus/update/<int:pk>/', SyllabusUpdateView.as_view(), name='syllabus-update'), #to update syllabus as per id
    path('api/syllabus/delete/<int:pk>/', SyllabusDeleteView.as_view(), name='syllabus-delete-single'),
    path('api/syllabus/delete/', SyllabusDeleteView.as_view(), name='syllabus-delete-all'),

    # API endpoints for discussion forums
    path('api/forum/posts/', DiscussionPostAPIView.as_view(), name='discussion-post-api'),
    path('api/forum/posts/<int:post_id>/comments/', DiscussionCommentAPIView.as_view(), name='discussion-comment-api'),
    
    # API endpoints for deleting discussion forums
    path('api/forum/posts/<int:post_id>/delete/', DiscussionPostDeleteAPIView.as_view(), name='discussion-post-delete'),
    path('api/forum/comments/<int:comment_id>/delete/', DiscussionCommentDeleteAPIView.as_view(), name='discussion-comment-delete'),

    # API endpoints for fees management
    path('api/fees/', FeeCategoryListCreateView.as_view(), name='fee-list-create'),  # Endpoint to list all fee categories and create new fee categories.
    path('api/fees/<int:pk>/', FeeCategoryDetailView.as_view(), name='fee-detail'),  # Endpoint to view, update, or delete a specific fee category by its ID (`pk`).
    path('api/fee-structures/', FeeStructureListCreateView.as_view(), name='fee-structure-list-create'),  # Endpoint to list all fee structures and create new fee structures.
    path('api/fee-structures/<int:pk>/', FeeStructureDetailView.as_view(), name='fee-structure-detail'),  # Endpoint to view, update, or delete a specific fee structure by its ID (`pk`).
    path('api/transactions/', PaymentTransactionListCreateView.as_view(), name='transaction-list-create'),  # Endpoint to list all payment transactions and create new payment transactions.
    path('api/transactions/<int:pk>/', PaymentTransactionDetailView.as_view(), name='transaction-detail'),  # Endpoint to view, update, or delete a specific payment transaction by its ID (`pk`).
    path('api/students/<int:student_id>/fees/', StudentFeeListView.as_view(), name='student-fee-list'),  # Endpoint to retrieve the fee details for a specific student by their `student_id`.
    path('api/students/<int:student_id>/fees/pending/', StudentPendingFeesView.as_view(), name='student-pending-fees'),  # Endpoint to retrieve the pending fee details for a specific student by their `student_id`.
    
    path('api/exams/', ExamAPIView.as_view(), name='exam-list-create'),
    path('api/exams/<int:exam_id>/', SingleExamAPIView.as_view(), name='single-exam'),
    path('api/exam-details/', ExamDetailAPIView.as_view(), name='exam-detail-list-create'),
    path('api/exam-details/<int:exam_detail_id>/', SingleExamDetailAPIView.as_view(), name='single-exam-detail'),
    path('api/results/', StudentResultAPIView.as_view(), name='student-result-list-create'),
    path('api/results/<int:result_id>/', SingleStudentResultAPIView.as_view(), name='single-student-result'),
    path('api/results/<int:exam_id>/<int:subject_id>/', SubjectWiseExamResultsView.as_view(), name='subject-wise-exam-results'),
    path('api/marksheet/<int:student_id>/<int:exam_id>/', MarksheetView.as_view(), name='marksheet'),
    path('api/exam-timetable/<int:exam_id>/', ExamTimetableView.as_view(), name='exam-timetable'),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


