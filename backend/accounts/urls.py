from django.urls import path
from .views import LoginAPIView, LogoutAPIView, RegisterAPIView

from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns = [
    # path('api/login/', csrf_exempt(LoginAPIView.as_view()), name='api-login'),
    path('api/login/', LoginAPIView.as_view(), name='api-login'),
    path('api/logout/', LogoutAPIView.as_view(), name='api-logout'),
    path('api/register/', RegisterAPIView.as_view(), name='register'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # other URLs as needed

]       