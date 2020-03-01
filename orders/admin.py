from django.contrib import admin

from .models import Menu, Topping, Base, Pizza, Sub, Filling, Extra, Other, Order

# Register your models here.

class PizzaInline(admin.TabularInline):
	model = Pizza

class BaseAdmin(admin.ModelAdmin):
	inlines = [PizzaInline]



admin.site.register(Menu)
admin.site.register(Topping)
admin.site.register(Base, BaseAdmin)
admin.site.register(Pizza)
admin.site.register(Sub)
admin.site.register(Filling)
admin.site.register(Extra)
admin.site.register(Other)
admin.site.register(Order)

