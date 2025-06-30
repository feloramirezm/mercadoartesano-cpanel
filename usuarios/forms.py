from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import CustomUser

class RegistroForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ('email', 'nombre', 'password1', 'password2')
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'].error_messages['unique'] = "Ya existe un usuario con este correo electrónico."

class LoginForm(AuthenticationForm):
    username = forms.EmailField(label='Correo electrónico')