from django.urls import path
from .views import RegisterView, LoginView, LogoutView, search_schemes

urlpatterns = [
    path('search/', search_schemes, name='search_schemes'),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
]