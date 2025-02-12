from django.contrib import admin
from django.urls import path
from schemes.views import process_query

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/process_query/', process_query),
]

