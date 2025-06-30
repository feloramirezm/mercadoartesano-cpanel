from django.urls import path
from . import views
from .views import load_more_products

urlpatterns = [ 
    # Rutas relacionadas a tienda y productos
    path('tienda/', views.buscar_productos, name='tienda'),
    path('load-more-products/', load_more_products, name='load_more_products'), # Scroll infinito
    path('producto/<slug:slug>/', views.detalle_producto, name='detalle_producto'),
    path('carrito/', views.shopping_cart, name='carrito'),
    path('checkout/', views.checkout, name='checkout'),
    path('favoritos/', views.wishlist, name='favoritos'),
    path('buscar/ajax/', views.buscar_productos_ajax, name='buscar_productos_ajax'), # Buscador del Home
    path('ajax/quick-view/<int:producto_id>/', views.quick_view_producto, name='quick_view_producto'), # Modal quickview
]