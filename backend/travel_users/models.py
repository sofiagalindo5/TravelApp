from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    display_name = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)

    visited_countries = models.ManyToManyField(
        "countries.Country",
        blank=True,
        related_name="visited_by_profiles"
    )

    def __str__(self):
        return self.display_name or self.user.username


class UpcomingTrip(models.Model):
    profile = models.OneToOneField(
        "travel_users.Profile",
        on_delete=models.CASCADE,
        related_name="upcoming_trip"
    )
    country = models.ForeignKey(
        "countries.Country",
        on_delete=models.CASCADE,
        related_name="upcoming_trip_profiles"
    )
    trip_date = models.DateField()

    def __str__(self):
        return f"{self.profile.user.username} - {self.country.name} on {self.trip_date}"