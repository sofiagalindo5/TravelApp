from django.shortcuts import render
from rest_framework import generics
from .models import Country
from .serializers import CountryListSerializer, CountryDetailSerializer
from .serializers import PendingCountrySubmissionSerializer
from .models import PendingCountrySubmission
from rest_framework.permissions import AllowAny



class CountryListView(generics.ListAPIView):
    queryset = Country.objects.all()
    serializer_class = CountryListSerializer
    permission_classes = [] 


class CountryDetailView(generics.RetrieveAPIView):
    queryset = Country.objects.all()
    serializer_class = CountryDetailSerializer
    permission_classes = []  # Allow unrestricted access to country details

class PendingCountrySubmissionCreateView(generics.CreateAPIView):
    queryset = PendingCountrySubmission.objects.all()
    serializer_class = PendingCountrySubmissionSerializer
    permission_classes = [AllowAny]
