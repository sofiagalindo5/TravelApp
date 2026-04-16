from django.urls import path
from . import views

urlpatterns = [
    path('', views.CountryListView.as_view(), name='country_list'),
    path("pending-submissions/", views.PendingCountrySubmissionCreateView.as_view(), name="pending-submission-create"),
    path('<int:pk>/', views.CountryDetailView.as_view(), name='country_detail'),
]