from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .forms import SignupForm
from .models import UserProfile
from .models import CustomUser  # Use custom User
import json

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    try:
        if request.method == 'POST':
            if request.content_type == 'application/json':
                data = json.loads(request.body)
                files = {}
            else:
                data = request.POST
                files = request.FILES
            
            form = SignupForm(data, files)
            if form.is_valid():
                user = form.save()
                profile = UserProfile.objects.get(user=user)
                
                return Response({
                    'message': 'User created successfully',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'userType': profile.user_type,
                        'phone': profile.phone,
                        'address': profile.address,
                        'joinDate': user.date_joined.strftime('%Y-%m-%d')
                    }
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({'errors': form.errors}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({'error': 'Invalid request method'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    try:
        if request.method == 'POST':
            if request.content_type == 'application/json':
                data = json.loads(request.body)
            else:
                data = request.POST
            
            login_identifier = data.get('email') or data.get('username') or data.get('login')
            password = data.get('password')
            
            if not login_identifier or not password:
                return Response({'error': 'Username/Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Find user
            try:
                if '@' in login_identifier:
                    user = CustomUser.objects.get(email=login_identifier)
                else:
                    user = CustomUser.objects.get(username=login_identifier)
            except CustomUser.DoesNotExist:
                # Try the other way
                try:
                    if '@' in login_identifier:
                        user = CustomUser.objects.get(username=login_identifier)
                    else:
                        user = CustomUser.objects.get(email=login_identifier)
                except CustomUser.DoesNotExist:
                    return Response({'error': 'Invalid username/email or password'}, status=status.HTTP_401_UNAUTHORIZED)
            
            # Authenticate
            authenticated_user = authenticate(username=user.username, password=password)
            if authenticated_user:
                try:
                    profile = UserProfile.objects.get(user=authenticated_user)
                except UserProfile.DoesNotExist:
                    profile = UserProfile.objects.create(
                        user=authenticated_user,
                        phone='',
                        address='',
                        user_type='client'
                    )
                
                return Response({
                    'message': 'Login successful',
                    'user': {
                        'id': authenticated_user.id,
                        'username': authenticated_user.username,
                        'email': authenticated_user.email,
                        'name': authenticated_user.first_name or authenticated_user.username,
                        'userType': profile.user_type,
                        'phone': profile.phone,
                        'address': profile.address,
                        'joinDate': authenticated_user.date_joined.strftime('%Y-%m-%d'),
                        'profilePicture': profile.picture.url if profile.picture else './assets/images/user.png'
                    },
                    'token': f'demo_token_{authenticated_user.id}_{authenticated_user.username}'
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid username/email or password'}, status=status.HTTP_401_UNAUTHORIZED)
                
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({'error': 'Invalid request method'}, status=status.HTTP_400_BAD_REQUEST)