from django.conf import settings
from django.db import models

# model for adding and removing menu items
class Menu(models.Model):
	category = models.CharField(max_length=64)

	def __str__(self):
		return f"{self.category}"

##############  Pizza  #########################
class Topping(models.Model):
	topping = models.CharField(max_length=64)

	def __str__(self):
		return f"{self.topping}"

class Base(models.Model):
	style = models.CharField(max_length=64)
	size = models.CharField(max_length=64)
	slices = models.PositiveSmallIntegerField()

	def __str__(self):
		return f"{self.size} Pizza - {self.style} Base - {self.slices} slices"

class Pizza(models.Model):
	TOPPING_CHOICES = [(0, 'Cheese only'), (1, 'One topping'), (2, 'Two toppings'), (3, 'Three toppings'), ('Sp', 'Special (4+ toppings)')]

	base = models.ForeignKey(Base, on_delete=models.CASCADE, related_name="pizzas")
	toppings = models.CharField(max_length=2, choices=TOPPING_CHOICES)
	price = models.DecimalField(max_digits=5, decimal_places=2)
	menu = models.ForeignKey(Menu, on_delete=models.CASCADE)

	def __str__(self):
		return f"{self.base.size} {self.base.style} - {self.get_toppings_display()} - {self.price}" #f"{toppings} - ${self.price}"


##############  Subs  #########################
class Filling(models.Model):
	item = models.CharField(max_length=64)
	price_small = models.DecimalField(max_digits=5, decimal_places=2)
	price_large = models.DecimalField(max_digits=5, decimal_places=2)

	def __str__(self):
		if self.price_small < 0:
			return f"{self.item} - Large: ${self.price_large}"
		if self.price_large < 0:
			return f"{self.item} - Small: ${self.price_small}"

		return f"{self.item} - Small: ${self.price_small}, Large: ${self.price_large}"	

class Sub(models.Model):
	SIZE_CHOICES = [('LG', 'Large'), ('SM', 'Small')]
	
	size = models.CharField(max_length=2, choices=SIZE_CHOICES)
	filling = models.ForeignKey(Filling, on_delete=models.CASCADE, related_name="subs")
	menu = models.ForeignKey(Menu, on_delete=models.CASCADE)

	def __str__(self):
		if self.size == 'LG':
			price = self.filling.price_large
		elif self.size == 'SM':
			price = self.filling.price_small
		return f"{self.filling.item} {self.get_size_display()} {price}"

class Extra(models.Model):
	item = models.CharField(max_length=64)
	price = models.DecimalField(max_digits=5, decimal_places=2)

	def __str__(self):
		return f"{self.item} ${self.price}"	

##############  Other Items  #########################
class Other(models.Model):
	SIZE_CHOICES = [('LG', 'Large'), ('SM', 'Small'), (None, 'N/A')]
	
	name = models.CharField(max_length=64)
	size = models.CharField(max_length=2, blank=True, choices=SIZE_CHOICES)
	price = models.DecimalField(max_digits=5, decimal_places=2)
	menu = models.ForeignKey(Menu, on_delete=models.CASCADE, related_name="other")
	
	def __str__(self):
		return f"{self.name} {self.get_size_display()} ${self.price}"

##############  Basket  #########################

# Just store user id and text with order items in it?
class Order(models.Model):
	STATUS_CHOICES = [('P', 'Pending'), ('C', 'Complete')]

	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="order")
	order = models.TextField()
	time = models.DateTimeField(auto_now_add=True)
	status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='P')

	def __str__(self):
		return f"{self.order} - {self.time} - {self.status}"



# models to create, modify and track orders
# class Cart(models.model):
# 	user = models.ForeignKey(User, on_delete=models.CASCADE)
# 	status
# 	time
	

# class CartItem(models.model):
# 	cart = models.ForeignKey(Cart, on_delete=models>CASCADE)
# 	item = models.(Menu, blank=True, related_name="orders")
# 	price = items.price 

# 	def add (self, item):
# 		self.items.add(item)
# 		self.price += item.price

# 	def remove (self, item):
# 		self.items.delete(item)
# 		self.price -= item.price

# 	def complete (self):
# 		self.status = 
# 		self.time = 
