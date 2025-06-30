from django.db import models
from django.contrib.auth import get_user_model
from .storage import MediaStorage
from django.utils.text import slugify

User = get_user_model()

class Coleccion(models.Model):
    nombre = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.nombre

class Artesano(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    foto = models.ImageField(upload_to='artesanos/', storage=MediaStorage())

    def __str__(self):
        return self.nombre

class Categoria(models.Model):
    nombre = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.nombre

class Producto(models.Model):
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='productos')
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=0)
    precio_anterior = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    creado = models.DateTimeField(auto_now_add=True)
    colecciones = models.ManyToManyField(Coleccion, blank=True, related_name='productos_coleccion')
    destacado = models.BooleanField(default=False)
    en_oferta = models.BooleanField(default=False)
    mas_vendido = models.BooleanField(default=False)
    artesano = models.ForeignKey(Artesano, on_delete=models.SET_NULL, null=True, blank=True, related_name='productos')
    peso = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, help_text="Peso en kg")
    ancho = models.DecimalField(max_digits=6, decimal_places=0, null=True, blank=True, help_text="Ancho en cm")
    largo = models.DecimalField(max_digits=6, decimal_places=0, null=True, blank=True, help_text="Largo en cm")
    alto = models.DecimalField(max_digits=6, decimal_places=0, null=True, blank=True, help_text="Alto en cm")
    slug = models.SlugField(unique=True, blank=True)
    
    def __str__(self):
        return self.nombre
    
    def imagen_destacada(self):
        return self.imagenes.order_by('orden').first()

    def save(self, *args, **kwargs):
            if not self.slug or self.nombre_changed():  # opción: regenerar si cambia el nombre
                base_slug = slugify(self.nombre)
                slug = base_slug
                num = 1
                while Producto.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                    slug = f"{base_slug}-{num}"
                    num += 1
                self.slug = slug
            super().save(*args, **kwargs)

    def nombre_changed(self):
        if self.pk:
            old_nombre = Producto.objects.get(pk=self.pk).nombre
            return old_nombre != self.nombre
        return True

class ImagenProducto(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='imagenes')
    imagen = models.ImageField(upload_to='productos/', storage=MediaStorage())
    orden = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.producto.nombre} (#{self.orden})"

class Pedido(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)
    pagado = models.BooleanField(default=False)

    def total(self):
        return sum(item.subtotal() for item in self.items.all())

class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='items')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)

    def subtotal(self):
        return self.producto.precio * self.cantidad
