"""
URL configuration for tienda project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from productos import views

urlpatterns = [
   
    # Admin
    path('admin/', admin.site.urls),
    
    # Home y paginas generales
    path('', views.inicio, name='inicio'),
    path('privacidad', views.privacidad, name='privacidad'),
    path('terminos', views.terminos, name='terminos'),
    path('seguimiento', views.order_tracking, name='seguimiento'),
    
    # Incluye rutas relacionadas a productos
    path('', include('productos.urls')),
    path('', include('usuarios.urls')),

]