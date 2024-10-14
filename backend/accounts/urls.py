from django.urls import path
from .views import *
from .views import LoginAPIView
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    # path('api/login/', csrf_exempt(LoginAPIView.as_view()), name='api-login'),
    # path('api/login/', LoginAPIView.as_view(), name='api-login'),
    path('api/logout/', LogoutAPIView.as_view(), name='api-logout'),
    path('api/register/', RegisterAPIView.as_view(), name='register'),
    # other URLs as needed

]       