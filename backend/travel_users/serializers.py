from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, UpcomingTrip
from countries.models import Country


# ---------- REGISTER ----------

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("username", "email", "password")

    def create(self, validated_data):
        user = User(
            username=validated_data["username"],
            email=validated_data.get("email", "")
        )
        user.set_password(validated_data["password"])
        user.save()
        Profile.objects.create(user=user)
        return user


# ---------- MINI COUNTRY ----------

class CountryMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ["id", "name"]


# ---------- UPCOMING TRIP ----------

class UpcomingTripSerializer(serializers.ModelSerializer):
    country = CountryMiniSerializer(read_only=True)

    class Meta:
        model = UpcomingTrip
        fields = ["country", "trip_date"]


# ---------- PROFILE (PRIVATE) ----------

class ProfileSerializer(serializers.ModelSerializer):
    visited_countries = CountryMiniSerializer(many=True, read_only=True)
    visited_count = serializers.SerializerMethodField()
    upcoming_trip = UpcomingTripSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = (
            "display_name",
            "bio",
            "visited_count",
            "visited_countries",
            "upcoming_trip",
        )

    def get_visited_count(self, obj):
        return obj.visited_countries.count()


# ---------- PROFILE (PUBLIC / FRIENDS) ----------

class PublicProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    visited_countries = CountryMiniSerializer(many=True, read_only=True)
    visited_count = serializers.SerializerMethodField()
    upcoming_trip = UpcomingTripSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = [
            "id",
            "username",
            "display_name",
            "bio",
            "visited_count",
            "visited_countries",
            "upcoming_trip",
        ]

    def get_visited_count(self, obj):
        return obj.visited_countries.count()
