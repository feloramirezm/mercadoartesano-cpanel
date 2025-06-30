# Create your views here.

from django.shortcuts import render, get_object_or_404, redirect
from .models import Producto, Categoria
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import HttpResponse, JsonResponse
from django.template.loader import render_to_string
from django.utils.html import strip_tags

PRODUCTOS_POR_PAGINA = 20 # Carga 20 productos en cada pagina antes del scroll infinito

# VISTAS DEL HOME Y GENERALES

def inicio(request): # Vistas del Home para productos destacados, en oferta y mas vendidos
    destacados = Producto.objects.filter(destacado=True).order_by('-creado').prefetch_related('imagenes')[:8]
    en_oferta = Producto.objects.filter(en_oferta=True).order_by('-creado').prefetch_related('imagenes')[:8]
    mas_vendidos = Producto.objects.filter(mas_vendido=True).order_by('-creado').prefetch_related('imagenes')[:8]
    categorias = Categoria.objects.all()

    aplicar_descuento(destacados)
    aplicar_descuento(en_oferta)
    aplicar_descuento(mas_vendidos)

    return render(request, 'home.html', {
        'destacados': destacados,
        'en_oferta': en_oferta,
        'mas_vendidos': mas_vendidos,
        'categorias': categorias,
    })

def buscar_productos_ajax(request): # Buscador del home (barra superior)
    q = request.GET.get("q", "").strip()
    categoria = request.GET.get("categoria", "").strip()
    
    productos = Producto.objects.all()
    
    if q:
        productos = productos.filter(nombre__icontains=q)
    
    if categoria:
        productos = productos.filter(categoria__slug=categoria)
        categoria_obj = Categoria.objects.filter(slug=categoria).first()
        categoria_nombre = categoria_obj.nombre if categoria_obj else "Todas las categorías"
    else:
        categoria_nombre = "Todas las categorías"
    
    total = productos.count()
    productos = productos[:5]  # 👈 Mostrar solo los primeros 5
    aplicar_descuento(productos)

    html = render_to_string("partials/resultados_home.html", {
        "productos": productos,
        "termino": q,
        "total": total,
        "categoria": categoria,
        "categoria_nombre": categoria_nombre,
    })

    return JsonResponse({"html": html})

def privacidad(request):
    return render(request, "privacidad.html")

def terminos(request):
    return render(request, "terminos.html")

def order_tracking(request):
    return render(request, "order-tracking.html")

# VISTAS RELACIONADAS A PRODUCTOS (APP Productos)

# Tienda (Listado, busquedas y filtros)
def buscar_productos(request):
    query = request.GET.get('q', '')
    categoria_slug = request.GET.get('categoria', '')
    precio_min = request.GET.get('precio_min')
    precio_max = request.GET.get('precio_max')
    
    productos_list = Producto.objects.prefetch_related('imagenes').all()

    if query:
        productos_list = productos_list.filter(nombre__icontains=query)
    if categoria_slug:
        productos_list = productos_list.filter(categoria__slug=categoria_slug)
    if precio_min:
        productos_list = productos_list.filter(precio__gte=precio_min)
    if precio_max:
        productos_list = productos_list.filter(precio__lte=precio_max)    
    
    productos_list = productos_list.order_by('-creado')
    paginator = Paginator(productos_list, PRODUCTOS_POR_PAGINA)
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)
    productos_destacados = Producto.objects.prefetch_related('imagenes').order_by('?')[:3]

    return render(request, 'shop-fullwidth-left-sidebar.html', {
        'productos': page_obj,
        'query': query,
        'categorias': Categoria.objects.all(),
        'productos_destacados': productos_destacados,
    })

# Scroll infinito Tienda
def load_more_products(request):
    page = request.GET.get('page') 
    query = request.GET.get('q', '')
    categoria_id = request.GET.get('categoria')
    precio_min = request.GET.get('precio_min')
    precio_max = request.GET.get('precio_max')
    productos_list = Producto.objects.prefetch_related('imagenes').all()
    coleccion_slug = request.GET.get('coleccion')
    orden = request.GET.get('orden', '')

    if query:
        productos_list = productos_list.filter(nombre__icontains=query)
    if categoria_id:
        productos_list = productos_list.filter(categoria_id=categoria_id)
    if precio_min:
        productos_list = productos_list.filter(precio__gte=precio_min)
    if precio_max:
        productos_list = productos_list.filter(precio__lte=precio_max)
    if coleccion_slug:
        productos_list = productos_list.filter(colecciones__slug=coleccion_slug)
    
    if orden == 'price':
        productos_list = productos_list.order_by('precio')
    elif orden == 'price-desc':
        productos_list = productos_list.order_by('-precio')
    else:  # incluye menu_order o vacío
        productos_list = productos_list.order_by('-creado')
    
    aplicar_descuento(productos_list)
    
    paginator = Paginator(productos_list, PRODUCTOS_POR_PAGINA)
    try:
        page_obj = paginator.page(page)
    except PageNotAnInteger:
        page_obj = paginator.page(1)
    except EmptyPage:
        return HttpResponse('')
    html = render_to_string('partials/product_list.html', {'productos': page_obj}, request=request)
    return JsonResponse({
    'html': html,
    'has_next': page_obj.has_next()
})

# Vista de cada producto en su propio html
def detalle_producto(request, slug):
    producto = get_object_or_404(Producto.objects.prefetch_related('imagenes'), slug=slug)
    productos_recomendados = Producto.objects.filter(
            categoria=producto.categoria
        ).exclude(id=producto.id).order_by('-creado')[:8]

    return render(request, 'product-details-fullwidth.html', {
        'producto': producto,
        'productos_recomendados': productos_recomendados
    })

def shopping_cart(request):
    return render(request, "shopping-cart.html")

def checkout(request):
    return render(request, "checkout.html")

def wishlist(request):
    return render(request, "wishlist.html")

# Modal quickview para fichas de cada producto
def quick_view_producto(request, producto_id): 
    producto = get_object_or_404(Producto.objects.prefetch_related('imagenes'), id=producto_id)

    data = {
        'id': producto.id,
        'nombre': producto.nombre,
        'precio': str(producto.precio),  # si es DecimalField
        'descripcion': strip_tags(producto.descripcion),
        'imagenes': [img.imagen.url for img in producto.imagenes.order_by('orden')],
        'categoria': producto.categoria.nombre,
        'slug_categoria': producto.categoria.slug,
    }

    return JsonResponse(data)

# Funcion para badge de descuento en fichas de productos
def aplicar_descuento(productos):
    for p in productos:
        if p.precio_anterior and p.precio_anterior > p.precio:
            p.descuento = int((p.precio_anterior - p.precio) * 100 / p.precio_anterior)
        else:
            p.descuento = None
    return productos