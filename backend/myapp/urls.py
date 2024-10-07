
from django.contrib import admin
from django.urls import path,include
from . import views


urlpatterns = [
    path('dashboard/', admin.site.urls),
    path('', views.login, name='login'),
]
