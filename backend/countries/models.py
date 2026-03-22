from django.db import models


class Country(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=2, blank=True)  # optional: BO, JP, ES
    hero_image_url = models.URLField(blank=True)
    short_description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Hotel(models.Model):
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name="hotels")
    name = models.CharField(max_length=120)
    city = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    price_level = models.CharField(max_length=20, blank=True)  # $, $$, $$$
    link = models.URLField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.country.name})"


class SafetyTip(models.Model):
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name="safety_tips")
    title = models.CharField(max_length=120)
    description = models.TextField()

    def __str__(self):
        return f"{self.title} - {self.country.name}"


class HiddenGem(models.Model):
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name="hidden_gems")
    name = models.CharField(max_length=120)
    location = models.CharField(max_length=120, blank=True)
    description = models.TextField()
    link = models.URLField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.country.name})"


class ProTip(models.Model):
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name="pro_tips")
    title = models.CharField(max_length=120)
    description = models.TextField()

    def __str__(self):
        return f"{self.title} - {self.country.name}"


class PersonalInterview(models.Model):
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name="personal_interviews")
    person_name = models.CharField(max_length=120)
    title_or_role = models.CharField(max_length=120, blank=True)  # e.g. "Local Student", "Traveler", etc.
    quote = models.TextField()
    full_story = models.TextField(blank=True)

    def __str__(self):
        return f"{self.person_name} - {self.country.name}"


class ItineraryDay(models.Model):
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name="itinerary_days")
    day_number = models.PositiveIntegerField()  # 1 or 2
    title = models.CharField(max_length=120)
    activities = models.TextField()  # could later be split into separate activity model

    class Meta:
        ordering = ["day_number"]
        unique_together = ("country", "day_number")

    def __str__(self):
        return f"{self.country.name} - Day {self.day_number}"
    

