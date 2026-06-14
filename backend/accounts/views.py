from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.authtoken.models import Token
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    PlanterProfileSerializer,
    UpdatePlanterProfileSerializer,
)
from .models import PlanterProfile, User
from .permissions import IsPlanter


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user": UserSerializer(user).data}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user": UserSerializer(user).data}, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        Token.objects.filter(user=user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)


class MyPlanterProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsPlanter]

    def get(self, request):
        profile = getattr(request.user, "planter_profile", None)
        if not profile:
            return Response({"detail": "Planter profile not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(PlanterProfileSerializer(profile).data, status=status.HTTP_200_OK)

    def patch(self, request):
        profile = getattr(request.user, "planter_profile", None)
        if not profile:
            return Response({"detail": "Planter profile not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = UpdatePlanterProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(PlanterProfileSerializer(profile).data, status=status.HTTP_200_OK)
