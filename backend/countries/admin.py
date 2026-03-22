from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import (
    Country,
    Hotel,
    SafetyTip,
    HiddenGem,
    ProTip,
    PersonalInterview,
    ItineraryDay,
)

admin.site.register(Country)
admin.site.register(Hotel)
admin.site.register(SafetyTip)
admin.site.register(HiddenGem)
admin.site.register(ProTip)
admin.site.register(PersonalInterview)
admin.site.register(ItineraryDay)