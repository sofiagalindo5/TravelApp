from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, UpcomingTrip
from countries.models import Country


# ---------- REGISTER ----------

class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, label="Confirm password")

    class Meta:
        model  = User
        fields = ["username", "email", "password", "password2"]

    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return data
    
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def create(self, validated_data):
        validated_data.pop("password2")
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )
        return user


# ---------- MINI COUNTRY ----------

class CountryMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ["id", "name", "latitude", "longitude"]


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
