from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    email = models.EmailField(unique=False)  # Allow duplicate emails
    # Add any other fields if needed

class UserProfile(models.Model):
    USER_TYPE_CHOICES = [
        ('client', 'Client'),
        ('owner', 'Owner'),
    ]
    
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15)
    address = models.TextField()
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='client')
    picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    driving_license = models.FileField(upload_to='licenses/', null=True, blank=True)
    aadhar = models.FileField(upload_to='aadhars/', null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.get_user_type_display()})"