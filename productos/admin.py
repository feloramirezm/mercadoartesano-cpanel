from django.contrib import admin
from django.utils.html import format_html
from .models import Categoria, Producto, Pedido, ItemPedido, ImagenProducto, Coleccion, Artesano

@admin.register(Coleccion)
class ColeccionAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'slug')
    prepopulated_fields = {'slug': ('nombre',)}

@admin.register(Artesano)
class ArtesanoAdmin(admin.ModelAdmin):
    list_display = ['nombre']

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'slug')
    prepopulated_fields = {'slug': ('nombre',)}

class ImagenProductoInline(admin.TabularInline):
    model = ImagenProducto
    extra = 1
    readonly_fields = ['vista_previa']

    def vista_previa(self, obj):
        if obj.imagen:
            return format_html('<img src="{}" width="80" style="object-fit:contain;" />', obj.imagen.url)
        return "Sin imagen"
    vista_previa.short_description = "Vista Previa"

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('miniatura', 'nombre', 'categoria', 'precio', 'creado','destacado', 'en_oferta', 'mas_vendido' )
    list_filter = ('categoria', 'destacado', 'en_oferta', 'mas_vendido', 'colecciones')
    search_fields = ('nombre',)
    exclude = ('slug',)
    inlines = [ImagenProductoInline]
    
    def miniatura(self, obj):
        imagen = obj.imagenes.order_by('orden').first()
        if imagen:
            return format_html('<img src="{}" width="50" height="50" />', imagen.imagen.url)
        return '-'
    miniatura.short_description = 'Miniatura'

class ItemPedidoInline(admin.TabularInline):
    model = ItemPedido
    extra = 0

@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'fecha', 'pagado', 'total')
    list_filter = ('pagado',)
    inlines = [ItemPedidoInline]
