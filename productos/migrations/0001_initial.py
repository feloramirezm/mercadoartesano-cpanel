# Generated by Django 5.2 on 2025-06-02 04:27

import django.db.models.deletion
import productos.storage
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Artesano',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('descripcion', models.TextField()),
                ('foto', models.ImageField(storage=productos.storage.MediaStorage(), upload_to='artesanos/')),
            ],
        ),
        migrations.CreateModel(
            name='Categoria',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('slug', models.SlugField(unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Coleccion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('slug', models.SlugField(unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Pedido',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha', models.DateTimeField(auto_now_add=True)),
                ('pagado', models.BooleanField(default=False)),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Producto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=200)),
                ('descripcion', models.TextField(blank=True)),
                ('precio', models.DecimalField(decimal_places=0, max_digits=10)),
                ('precio_anterior', models.DecimalField(blank=True, decimal_places=0, max_digits=10, null=True)),
                ('creado', models.DateTimeField(auto_now_add=True)),
                ('destacado', models.BooleanField(default=False)),
                ('en_oferta', models.BooleanField(default=False)),
                ('mas_vendido', models.BooleanField(default=False)),
                ('peso', models.DecimalField(blank=True, decimal_places=2, help_text='Peso en kg', max_digits=6, null=True)),
                ('ancho', models.DecimalField(blank=True, decimal_places=0, help_text='Ancho en cm', max_digits=6, null=True)),
                ('largo', models.DecimalField(blank=True, decimal_places=0, help_text='Largo en cm', max_digits=6, null=True)),
                ('alto', models.DecimalField(blank=True, decimal_places=0, help_text='Alto en cm', max_digits=6, null=True)),
                ('slug', models.SlugField(blank=True, unique=True)),
                ('artesano', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='productos', to='productos.artesano')),
                ('categoria', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='productos', to='productos.categoria')),
                ('colecciones', models.ManyToManyField(blank=True, related_name='productos_coleccion', to='productos.coleccion')),
            ],
        ),
        migrations.CreateModel(
            name='ItemPedido',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cantidad', models.PositiveIntegerField(default=1)),
                ('pedido', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='productos.pedido')),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='productos.producto')),
            ],
        ),
        migrations.CreateModel(
            name='ImagenProducto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('imagen', models.ImageField(storage=productos.storage.MediaStorage(), upload_to='productos/')),
                ('orden', models.PositiveIntegerField(default=0)),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='imagenes', to='productos.producto')),
            ],
        ),
    ]
