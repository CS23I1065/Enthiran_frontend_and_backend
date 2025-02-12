from django.db import models

class Scheme(models.Model):
    name = models.CharField(max_length=255)
    eligibility = models.TextField()
    documents = models.TextField()
    offline_support = models.BooleanField(default=False)
    website = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name

