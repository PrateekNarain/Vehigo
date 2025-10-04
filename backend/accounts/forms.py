from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from .models import CustomUser,UserProfile

class SignupForm(UserCreationForm):
    email = forms.EmailField(max_length=254, required=True)
    phone = forms.CharField(max_length=15, required=True)
    address = forms.CharField(widget=forms.Textarea, required=True)
    user_type = forms.ChoiceField(choices=UserProfile.USER_TYPE_CHOICES, required=True)
    picture = forms.ImageField(required=False)
    driving_license = forms.FileField(required=False)
    aadhar = forms.FileField(required=False)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password1', 'password2')

    def clean_username(self):
        username = self.cleaned_data['username']
        if CustomUser.objects.filter(username=username).exists():
            raise forms.ValidationError("A user with this username already exists.")
        return username

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
            profile = UserProfile.objects.create(
                user=user,
                phone=self.cleaned_data['phone'],
                address=self.cleaned_data['address'],
                user_type=self.cleaned_data['user_type'],
                picture=self.cleaned_data['picture'],
                driving_license=self.cleaned_data['driving_license'],
                aadhar=self.cleaned_data['aadhar']
            )
        return user