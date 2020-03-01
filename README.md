# Project 3

Web Programming with Python and JavaScript

index.html
A basic welcome page from which the user can access the menu, register and login pages

menu.html menu.js
This page lists all of the menu items offered at Pinnochio's on a single page.  Items are added by clicking on the appropriate menu item and then using the 'add to order' button to add the item to the basket. At this point they are also added to localstorage.

login.html
This is the login page.  I have used django's built in login view and therefore did not need to create my own view in view.py.  I also took advantage of the built in logout view to handle the logout function.

register.html
I used the built in UserCreationForm to handle the registration of new users.

basket.html basket.js
This page allows the user to view all items they have added to their basket.  All items are stored in local storage and so the basket contents is saved if the user closes the window or logs out and in again.  When this page is loaded all the items in local storage are sent to the server for validation to ensure prices etc have not been manipulated by the user.  From this page the user can complete their orders.

orders.html
This page allows the user to view the status of their order and past orders.

kitchen.html kitchen.js
This page is only accessible to superusers and allows the superuser to view all pending orders and mark them as complete.

