from django.urls import path
from . import views

urlpatterns = [
    path('cuenta', views.mi_cuenta, name='cuenta'),
    path('login-registro', views.loggin_register, name='login-registro'),
    path('logout', views.logout_usuario, name='logout'),
    path('actualizar-datos/', views.actualizar_datos, name='actualizar_datos'),
]