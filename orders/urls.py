from django.urls import path
from django.contrib.auth import views as auth_views #use stock views for user management

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("register/", views.register_view, name="register"),
    path("login/", auth_views.LoginView.as_view(template_name="orders/login.html", extra_context={"next": "menu" }), name="login"),
    path("logout/", auth_views.LogoutView.as_view(next_page="login"), name="logout"),
    path("menu/", views.menu_view, name="menu"),
    path("basket/", views.basket_view, name="basket"),
    path("orders/", views.orders_view, name="orders"),
    path("kitchen/", views.kitchen_view, name="kitchen")
]
