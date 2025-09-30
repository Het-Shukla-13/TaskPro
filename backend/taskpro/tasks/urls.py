from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from tasks.views import TaskViewSet, UserRegisterView, ProfileView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = routers.DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path("register", UserRegisterView.as_view(), name="user-register"),
    path('profile', ProfileView.as_view(), name='profile'),
    path('login', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]