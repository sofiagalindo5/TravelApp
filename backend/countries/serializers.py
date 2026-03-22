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
        ]