
from django.contrib import admin
from django.urls import path,include
from . import views
from django.conf import settings
from django.conf.urls.static import static
from .views import *
from rest_framework.routers import DefaultRouter
from .views import (
    AssignHomeworkView,
    FilterSubjectsView,
    StudentAssignmentsView,
    SubmitStudentAssignmentView,
    ReviewAssignmentsView,
    ExamsByClassView,
    ExamTimetableView,
    SyllabusView,
    ChapterViewSet,
    TopicViewSet,
    SubtopicViewSet,
)

# Initialize the router for syllabus-related views
router = DefaultRouter()
router.register(r'chapters', ChapterViewSet)
router.register(r'topics', TopicViewSet)
router.register(r'subtopics', SubtopicViewSet)


urlpatterns = [
    # Admin site URL
    # path('dashboard/', admin.site.urls),  # URL for the Django admin dashboard

    # API endpoint for posts
    path('api/posts/', PostListCreateView.as_view(), name='post-list-create'),

    # API endpoints for user registration
    path('api/register/teacher/', RegisterTeacherView.as_view(), name='register-teacher'),  # URL for teacher registration API
    path('api/register/principal/', RegisterPrincipalView.as_view(), name='register-principal'),  # URL for principal registration API
    path('api/register/student/', RegisterStudentView.as_view(), name='register-student'),  # URL for student registration API
    path('api/register/accountant/', RegisterAccountantView.as_view(), name='register_accountant'), # URL for accountant registration API
    
    # API endpoints for user lists
    path('api/teachers/', TeacherListView.as_view(), name='teacher-list'),  # Endpoint for listing teachers
    path('api/principals/', PrincipalListView.as_view(), name='principal-list'),  # Endpoint for listing principals
    path('api/students/', StudentListView.as_view(), name='student-list'),  # Endpoint for listing students
    path('api/students/class/<int:class_code>/', StudentListByClassAPIView.as_view(), name='students-by-class'),

    path('api/accountant/', AccountantListView.as_view(), name='accountant_list'), # Endpoint for listing accountants

    # API endpoints for viewing details of a specific record
    path('api/teachers/<int:pk>/', TeacherDetailView.as_view(), name='teacher-detail'),  # Endpoint for viewing a specific teacher
    path('api/principals/<int:pk>/', PrincipalDetailView.as_view(), name='principal-detail'),  # Endpoint for viewing a specific principal
    path('api/students/<int:pk>/', StudentDetailView.as_view(), name='student-detail'),  # Endpoint for viewing a specific student
    path('api/accountants/<int:pk>/', AccountantDetailView.as_view(), name='accountant_detail'), # Endpoint for viewing a specific accountant

    # API endpoints for deleting a specific record
    path('api/teachers/<int:pk>/delete/', TeacherDeleteView.as_view(), name='teacher-delete'),  # Endpoint for deleting a specific teacher
    path('api/principals/<int:pk>/delete/', PrincipalDeleteView.as_view(), name='principal-delete'),  # Endpoint for deleting a specific principal
    path('api/students/<int:pk>/delete/', StudentDeleteView.as_view(), name='student-delete'),  # Endpoint for deleting a specific student
    path('api/accountant/<int:pk>/delete/', AccountantDeleteView.as_view(), name='accountant_delete'), # Endpoint for deleting a specific accountant

    path('api/teacher/<int:pk>/update/', TeacherUpdateAPIView.as_view(), name='teacher-update'),
    path('api/principal/<int:pk>/update/', PrincipalUpdateAPIView.as_view(), name='principal-update'),
    path('api/student/<int:pk>/update/', StudentUpdateAPIView.as_view(), name='student-update'),
    path('api/accountant/<int:pk>/update/', AccountantUpdateAPIView.as_view(), name='accountant-update'),

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
    path('api/classes/<int:pk>/', ClassDetailView.as_view(), name='class-detail'),  # Endpoint for class details, update, and delete
    path('api/classes/<int:class_id>/sections/', SectionListCreateAPIView.as_view(), name='section-list-create'),
    path('api/classes/sections/<int:pk>/', SectionDetailAPIView.as_view(), name='section-detail'),
    path('api/sections/', ClassListView.as_view(), name='class-list'),

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

    # API endpoints for discussion forums
    path('api/forum/posts/', DiscussionPostAPIView.as_view(), name='discussion-post-api'),
    path('api/forum/posts/<int:post_id>/comments/', DiscussionCommentAPIView.as_view(), name='discussion-comment-api'),
    
    # API endpoints for deleting discussion forums
    path('api/forum/posts/<int:post_id>/delete/', DiscussionPostDeleteAPIView.as_view(), name='discussion-post-delete'),
    path('api/forum/comments/<int:comment_id>/delete/', DiscussionCommentDeleteAPIView.as_view(), name='discussion-comment-delete'),

 
     # API endpoints for exams management
    path('api/exams/', ExamAPIView.as_view(), name='exam-list-create'),  # Endpoint to list all exams and create new exams.
    path('api/exams/<int:exam_id>/', SingleExamAPIView.as_view(), name='single-exam'),  # Endpoint to retrieve, update, or delete a specific exam by its ID (`exam_id`).
    path("api/exams/class/<int:class_id>/", ExamsByClassView.as_view(), name="exams_by_class"),
    
    # API endpoints for exam details
    path('api/exam-details/', ExamDetailAPIView.as_view(), name='exam-detail-list-create'),  # Endpoint to list all exam details and create new exam details.
    path('api/exam-details/<int:exam_detail_id>/', SingleExamDetailAPIView.as_view(), name='single-exam-detail'),  # Endpoint to retrieve, update, or delete a specific exam detail by its ID (`exam_detail_id`).
    path('api/exam-details/exam/<int:exam_id>/', ExamDetailsByExamView.as_view(), name='exam-details-exam'),  # Endpoint to retrieve all exam details for a specific exam (`exam_id`).
    path('api/exam-details/<int:examid>/<int:teacherId>/', ExamDetailsByTeacherView.as_view(), name='exam-details-teacher'),  # Endpoint to retrieve exam details assigned to a specific teacher (`teacherId`) for a given exam (`examid`).
    
    # API for exam timetable filtered by class
    path("api/exam-timetable/<int:exam_id>/<int:class_id>/", ExamTimetableView.as_view(), name="exam_timetable"),  # Endpoint to retrieve the timetable for a specific exam (`exam_id`) and class (`class_id`).

    # API endpoints for student results
    path('api/results/', StudentResultAPIView.as_view(), name='student-result-list-create'),  # Endpoint to list all student results and create new results.
    path('api/results/<int:result_id>/', SingleStudentResultAPIView.as_view(), name='single-student-result'),  # Endpoint to retrieve, update, or delete a specific student result by its ID (`result_id`).
    path('api/results/<int:exam_id>/<int:subject_id>/', SubjectWiseExamResultsView.as_view(), name='subject-wise-exam-results'),  # Endpoint to retrieve subject-wise exam results for a specific exam (`exam_id`) and subject (`subject_id`).

    path('api/marksheet/<int:student_id>/<int:exam_id>/', MarksheetView.as_view(), name='marksheet'),  # Endpoint to retrieve a student's marksheet for a specific exam (`exam_id`).
    path("api/students/update-roll-numbers/<int:class_id>/", BulkUpdateRollNumbersAPIView.as_view(), name="bulk_update_roll_numbers"),
    path('api/rankings/<int:exam_id>/<int:class_id>/', StudentRankingView.as_view(), name='student_rankings'),


    path('api/messages/', MessageListView.as_view(), name='message-list'),
    path('api/messages/send/', SendMessageView.as_view(), name='send-message'),

    # Syllabus and related endpoints
    path('api/syllabus/', SyllabusView.as_view(), name='syllabus-list'),
    path('api/syllabus/<int:pk>/', SyllabusView.as_view(), name='syllabus-detail'), # Retrieve & Update
    path("api/syllabus/filter/", SyllabusFilterView.as_view(), name="syllabus-filter"), 
    # /api/syllabus/filter/?subject_id=2  to get syllabus as per subject id
    path('api/', include(router.urls)),  # Including router URLs for chapters, topics, and subtopics
    
    path('api/notes/', NotesCreateView.as_view(), name='notes-list-create'),
    path('api/notes/<int:pk>/', NotesDetailView.as_view(), name='notes-detail'),
    path('api/notes/subject/<int:subjectid>/', NotesBySubjectAPIView.as_view(), name='subject-wise-notes'),

    path('api/attendance/', DailyAttendanceAPIView.as_view(), name='daily-attendance'),
    path('api/attendance/<int:classid>/<str:date>/', AttendanceByClassAPIView.as_view(), name='attendance-by-class'),
    path('api/attendance/student/<int:class_id>/', StudentsByClassAttendanceAPIView.as_view(), name='students-by-class'),
    path('api/students/subject/<int:subject_id>/', SubjectWiseStudentListAPIView.as_view(), name='subject-wise-students'),
   
    # API endpoints for fees management 
    path("api/fee-names/", FeeCategoryNameAPIView.as_view(), name="fee-category-name-list"),
    path("api/fee-names/<int:category_id>/", FeeCategoryNameDetailAPIView.as_view(), name="fee-category-name-detail"),
    path("api/fee-categories/<int:class_id>/", FeeCategoryByClassAPIView.as_view(), name="fee-category-list-by-class"),
    path("api/fee-categories/<int:class_id>/<int:category_id>/", FeeCategoryDetailAPIView.as_view(), name="fee-category-detail"),
    path('api/transportation-fees/', TransportationFeeListCreateAPIView.as_view(), name='transportation-fee-list-create'),
    path('api/transportation-fees/<int:pk>/', TransportationFeeDetailAPIView.as_view(), name='transportation-fee-detail'),
    path("api/bills/<int:student_id>/", StudentBillAPIView.as_view(), name="bill-list"),
    path("api/bills/detail/<str:bill_number>/", StudentBillDetailAPIView.as_view(), name="bill-detail"),
    path("api/payments/<int:student_id>/", StudentPaymentAPIView.as_view(), name="payment-list"),
    path("api/payments/detail/<str:payment_number>/", StudentPaymentDetailAPIView.as_view(), name="payment-detail"),
    path("api/transactions/<int:student_id>/", StudentTransactionsAPIView.as_view(), name="student-transactions"),

    path('api/dashboard/', DashboardAPIView.as_view(), name='dashboard-api'),
    path('api/attendance-summary/<str:date>/', AttendanceSummaryAPIView.as_view(), name='attendance-summary'),
    path('api/syllabus-summary/<int:teacher_id>/', SyllabusSummaryAPIView.as_view(), name='assignment-syllabus'),
    path('api/fee-summary/', FeeDashboardAPIView.as_view(), name='fee-summary'),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


