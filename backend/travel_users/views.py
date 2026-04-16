from django.contrib.auth.models import User
from django.db.models import Q

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Profile, UpcomingTrip

from countries.models import Country
from .models import Profile
from .serializers import (
    RegisterSerializer,
    ProfileSerializer,
    PublicProfileSerializer,
)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class MeView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = getattr(user, "profile", None)
        profile_data = ProfileSerializer(profile).data if profile else None

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "profile": profile_data,
        })


class UpdateMyProfileView(generics.UpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


class UserSearchView(generics.ListAPIView):
    serializer_class = PublicProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        query = self.request.GET.get("q", "").strip()

        queryset = Profile.objects.select_related(
            "user",
            "upcoming_trip",
            "upcoming_trip__country",
        ).prefetch_related(
            "visited_countries"
        ).exclude(user=self.request.user)

        if query:
            queryset = queryset.filter(
                Q(user__username__icontains=query) |
                Q(display_name__icontains=query) |
                Q(bio__icontains=query)
            )

        return queryset


class PublicProfileDetailView(generics.RetrieveAPIView):
    serializer_class = PublicProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Profile.objects.select_related(
        "user",
        "upcoming_trip",
        "upcoming_trip__country",
    ).prefetch_related(
        "visited_countries"
    )


class AddVisitedCountryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, country_id):
        profile = request.user.profile

        try:
            country = Country.objects.get(id=country_id)
        except Country.DoesNotExist:
            return Response(
                {"detail": "Country not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        profile.visited_countries.add(country)

        return Response(
            {
                "message": "Country added to visited list successfully.",
                "country": {
                    "id": country.id,
                    "name": country.name,
                },
                "is_visited": True,
                "visited_count": profile.visited_countries.count(),
            },
            status=status.HTTP_200_OK
        )

class SetUpcomingTripView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, country_id):
        profile = request.user.profile
        trip_date = request.data.get("trip_date")

        if not trip_date:
            return Response(
                {"detail": "trip_date is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            country = Country.objects.get(id=country_id)
        except Country.DoesNotExist:
            return Response(
                {"detail": "Country not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        trip, created = UpcomingTrip.objects.update_or_create(
            profile=profile,
            defaults={
                "country": country,
                "trip_date": trip_date,
            }
        )

        return Response(
            {
                "message": "Upcoming trip saved successfully.",
                "upcoming_trip": {
                    "country": {
                        "id": trip.country.id,
                        "name": trip.country.name,
                    },
                    "trip_date": trip.trip_date,
                }
            },
            status=status.HTTP_200_OK
        )


class ClearUpcomingTripView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        profile = request.user.profile
        UpcomingTrip.objects.filter(profile=profile).delete()

        return Response(
            {"message": "Upcoming trip cleared successfully."},
            status=status.HTTP_200_OK
        )
