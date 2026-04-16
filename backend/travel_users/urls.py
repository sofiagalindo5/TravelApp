from django.urls import path
from .views import (
    RegisterView,
    MeView,
    UpdateMyProfileView,
    UserSearchView,
    PublicProfileDetailView,
    AddVisitedCountryView,
    SetUpcomingTripView,
    ClearUpcomingTripView,
)

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("me/", MeView.as_view()),
    path("me/update/", UpdateMyProfileView.as_view(), name="update-my-profile"),

    path("users/search/", UserSearchView.as_view(), name="user-search"),
    path("users/<int:pk>/", PublicProfileDetailView.as_view(), name="public-profile-detail"),

    path("profile/visited/<int:country_id>/", AddVisitedCountryView.as_view(), name="add-visited-country"),
    path("profile/upcoming-trip/<int:country_id>/", SetUpcomingTripView.as_view(), name="set-upcoming-trip"),
    path("profile/upcoming-trip/clear/", ClearUpcomingTripView.as_view(), name="clear-upcoming-trip"),
]