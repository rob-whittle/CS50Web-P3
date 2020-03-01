import sys
import json

from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth import logout, authenticate, login
from django.contrib import messages
from django.core import serializers

from .models import Menu, Topping, Base, Pizza, Filling, Sub, Extra, Other, Order


# Create your views here.
def index(request):
        return render(request = request,
                      template_name = "orders/index.html")

def register_view(request):

    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f"New account created: {username}")
            login(request, user)
            return redirect("menu")

        else:
            for msg in form.error_messages:
                messages.error(request, f"{msg}: {form.error_messages[msg]}")

            return render(request = request,
                          template_name = "orders/register.html",
                          context={"form":form})

    form = UserCreationForm
    return render(request = request,
                  template_name = "orders/register.html",
                  context={"form":form})

@login_required(login_url='/login/')
def orders_view(request):
    if request.method == "POST":
        
        order = Order.objects.create(user_id=request.user.id, order=request.POST["order"])
        return render(request, "orders/orders.html", {'order': order})

    if request.method == "GET":

        orders = request.user.order.all()
        return render(request, "orders/orders.html", {'pending': orders.filter(status='P'), 'complete': orders.filter(status='C')})


@user_passes_test(lambda u: u.is_superuser, login_url='/login/')
def kitchen_view(request):
    if request.method == "GET":
        orders = Order.objects.all()
        return render(request, "orders/kitchen.html", {'pending': orders.filter(status='P'), 'complete': orders.filter(status='C')[:10]})

    if request.method == "POST":
        order_id = int(request.POST["order_id"])
        order = Order.objects.get(pk=order_id)
        order.status = 'C'
        order.save()

        orders = Order.objects.all()
        return render(request, "orders/kitchen.html", {'pending': orders.filter(status='P'), 'complete': orders.filter(status='C')[:10]})


def menu_view(request):

    context = {
        "pizzas": Pizza.objects.all().order_by('toppings'),
        "pizza_data": serializers.serialize('json', Pizza.objects.all()),
        "subs": Sub.objects.all(),
        "sub_data": serializers.serialize('json', Sub.objects.all()),
        "others": Other.objects.all(),
        "others_data": serializers.serialize('json', Other.objects.all()),
        "menu_titles": Menu.objects.all(), 
        "pizza_bases": Base.objects.all(),
        "pizza_toppings": Topping.objects.all(), 
        "sub_fillings": Filling.objects.all(),
        "sub_fillings_data": serializers.serialize('json', Filling.objects.all()),
        "sub_extras": Extra.objects.all(),
        "sub_extras_data": serializers.serialize('json', Extra.objects.all()),
    }


    return render(request, "orders/menu.html", context)

def basket_view(request):

    if request.method == "POST":

        # verify all items in order and return in context dictionary

        # create empty context dictionary
        context = {}

        # variable to store total price
        price = 0

        # convert JSON string from POST to python object, returns a list
        items = json.loads(request.POST["items"])
        
        for item in items:
            if 'pizza' in item:
                try:
                    pizza = Pizza.objects.get(pk=item['pizza'])
                except KeyError:
                    print('no such pizza', file=sys.stderr)
                print(pizza, file=sys.stderr)
                price += pizza.price
            
                if 'toppings' in item:
                    toppings = [] #empty list to store toppings
                    for top_item in item['toppings']:
                        try:
                            topping = Topping.objects.get(pk=top_item)
                        except KeyError:
                            print('no such topping', file=sys.stderr)
                        print(topping, file=sys.stderr)
                        toppings.append(topping)                

                if 'pizza' not in context:
                    context['pizza'] = [{'pizza': pizza, 'toppings': toppings}]
                else: context['pizza'].append({'pizza': pizza, 'toppings': toppings})

            if 'sub' in item:
                sub_price = 0
                try:
                    filling = Filling.objects.get(pk=item['sub'])
                except KeyError:
                    print('no such sub', file=sys.stderr)
                print(filling, file=sys.stderr)
                if item['size'] == 'LG':
                    sub_price += filling.price_large
                else:
                    sub_price += filling.price_small
            
                if 'extras' in item:
                    extras = [] #empty list to store toppings
                    for extra_item in item['extras']:
                        try:
                            extra = Extra.objects.get(pk=extra_item)
                        except KeyError:
                            print('no such extra', file=sys.stderr)
                        print(extra, file=sys.stderr)
                        extras.append(extra.item)
                        sub_price += extra.price   
                price += sub_price             

                if 'sub' not in context:
                    context['sub'] = [{'sub': filling, 'size': item['size'], 'extras': extras, 'price': sub_price}]
                else: context['sub'].append({'sub': filling, 'size': item['size'], 'extras': extras, 'price': sub_price})

            if 'other' in item:
                try:
                    other = Other.objects.get(pk=item['other'])
                except KeyError:
                    print('no such item', file=sys.stderr)
                print(other, file=sys.stderr)
                price += other.price
                    

                if 'other' not in context:
                    context['other'] = [{'other': other}]
                else: context['other'].append({'other': other})      


        context['price'] = price

        return render(request, "orders/basket.html", context)

    if request.method == "GET":
        return render(request, "orders/basket.html")

