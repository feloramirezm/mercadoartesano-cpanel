from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, update_session_auth_hash
from django.contrib import messages
from .forms import RegistroForm, LoginForm
from django import forms

def loggin_register(request):
    login_form = LoginForm()
    register_form = RegistroForm()

    if request.method == 'POST':
        if 'login_submit' in request.POST:
            login_form = LoginForm(request=request, data=request.POST)
            if login_form.is_valid():
                user = login_form.get_user()
                login(request, user)

                # Recordarme
                if not request.POST.get("remember"):
                    request.session.set_expiry(0)  # Cierra sesión al cerrar navegador
                else:
                    request.session.set_expiry(1209600)  # 2 semanas

                return redirect('cuenta')

        elif 'register_submit' in request.POST:
            register_form = RegistroForm(request.POST)
            if register_form.is_valid():
                user = register_form.save()
                login(request, user)
                return redirect('cuenta')

    return render(request, 'login-registro.html', {
        'login_form': login_form,
        'register_form': register_form
    })

def logout_usuario(request):
    logout(request)
    return redirect('login-registro')

from django.contrib.auth.decorators import login_required

@login_required
def mi_cuenta(request):
    return render(request, 'mi-cuenta.html')

@login_required
def actualizar_datos(request):
    class ActualizarDatosForm(forms.Form):
        nombre = forms.CharField(max_length=255)
        password_actual = forms.CharField(widget=forms.PasswordInput(), required=False)
        password_nueva1 = forms.CharField(widget=forms.PasswordInput(), required=False)
        password_nueva2 = forms.CharField(widget=forms.PasswordInput(), required=False)

        def __init__(self, *args, **kwargs):
            self.user = kwargs.pop('user')
            super().__init__(*args, **kwargs)

        def clean(self):
            cleaned_data = super().clean()
            pwd_actual = cleaned_data.get('password_actual')
            pwd_nueva1 = cleaned_data.get('password_nueva1')
            pwd_nueva2 = cleaned_data.get('password_nueva2')

            if pwd_nueva1 or pwd_nueva2:
                if not pwd_actual:
                    self.add_error('password_actual', 'Debes ingresar tu contraseña actual.')
                elif not self.user.check_password(pwd_actual):
                    self.add_error('password_actual', 'La contraseña actual es incorrecta.')
                if pwd_nueva1 != pwd_nueva2:
                    self.add_error('password_nueva2', 'Las nuevas contraseñas no coinciden.')
            return cleaned_data

    if request.method == 'POST':
        form = ActualizarDatosForm(request.POST, user=request.user)
        if form.is_valid():
            request.user.nombre = form.cleaned_data['nombre']
            if form.cleaned_data['password_nueva1']:
                request.user.set_password(form.cleaned_data['password_nueva1'])
                update_session_auth_hash(request, request.user)
            request.user.save()
            messages.success(request, 'Datos actualizados correctamente.')
            return redirect('cuenta')
    else:
        form = ActualizarDatosForm(initial={'nombre': request.user.nombre}, user=request.user)

    return render(request, 'mi-cuenta.html', {'form': form})