from rest_framework import serializers
from .models import (
    Country,
    Hotel,
    SafetyTip,
    HiddenGem,
    ProTip,
    PersonalInterview,
    ItineraryDay,
)
from .models import PendingCountrySubmission


class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = "__all__"


class SafetyTipSerializer(serializers.ModelSerializer):
    class Meta:
        model = SafetyTip
        fields = "__all__"


class HiddenGemSerializer(serializers.ModelSerializer):
    class Meta:
        model = HiddenGem
        fields = "__all__"


class ProTipSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProTip
        fields = "__all__"


class PersonalInterviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalInterview
        fields = "__all__"


class ItineraryDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItineraryDay
        fields = "__all__"


# for country itself

class CountryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ["id", "name", "hero_image_url", "short_description"]


class CountryDetailSerializer(serializers.ModelSerializer):
    hotels = HotelSerializer(many=True, read_only=True)
    safety_tips = SafetyTipSerializer(many=True, read_only=True)
    hidden_gems = HiddenGemSerializer(many=True, read_only=True)
    pro_tips = ProTipSerializer(many=True, read_only=True)
    personal_interviews = PersonalInterviewSerializer(many=True, read_only=True)
    itinerary_days = ItineraryDaySerializer(many=True, read_only=True)
    is_visited = serializers.SerializerMethodField()

    class Meta:
        model = Country
        fields = [
            "id",
            "name",
            "code",
            "hero_image_url",
            "short_description",
            "hotels",
            "safety_tips",
            "hidden_gems",
            "pro_tips",
            "personal_interviews",
            "itinerary_days",
            "is_visited",
        ]

    def get_is_visited(self, obj):
        request = self.context.get("request")

        if request and request.user.is_authenticated:
            profile = getattr(request.user, "profile", None)
            if profile:
                return profile.visited_countries.filter(id=obj.id).exists()

        return False

    def get_is_visited(self, obj):
        request = self.context.get("request")

        if request and request.user.is_authenticated:
            profile = getattr(request.user, "profile", None)
            if profile:
                return profile.visited_countries.filter(id=obj.id).exists()

        return False


class PendingCountrySubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PendingCountrySubmission
        fields = "__all__"
        read_only_fields = ("status", "admin_notes", "submitted_at", "reviewed_at")