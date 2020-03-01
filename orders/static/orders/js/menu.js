// order container
// change this to get any existing items from localstorage
var order_items = [];
var order_price = 0.00;

document.addEventListener('DOMContentLoaded', () => {

	////////////////// check if any items in basket from last visit ///////////////
	if (localStorage.getItem('order_items')) { 
		// parse to JSON
		let existingitems = JSON.parse(localStorage.getItem('order_items'));

		// add each item to order_items array and count
		let i = 0;

		for (item of existingitems) {
			order_items.push(item);
			i++;
		}

		// notify how many items are in basket
		M.toast({html: `${i} item(s) in basket`});

		// set order_price to that stored in local storage
		order_price = parseFloat(localStorage.getItem('order_price'));
	};

	////////////////// JSON ///////////////////////
	var pizza_json = JSON.parse(document.querySelector('#pizza-data').textContent);
	pizza_json = JSON.parse(pizza_json); // needs to be parsed twice for some reason

	var sub_json = JSON.parse(document.querySelector('#sub-data').textContent);
	sub_json = JSON.parse(sub_json);

	var filling_json = JSON.parse(document.querySelector('#filling-data').textContent);
	filling_json = JSON.parse(filling_json);

	var extra_json = JSON.parse(document.querySelector('#extra-data').textContent);
	extra_json = JSON.parse(extra_json);

	var other_json = JSON.parse(document.querySelector('#others-data').textContent);
	other_json = JSON.parse(other_json);



	////////////////// pizza bases ///////////////////////

	// a variable to store the selected pizza base id
	var base_id;

    // get all the elements with the desired class name
	let pizza_els = document.querySelectorAll('#Pizza_base')

	getCard(pizza_els, '#Pizza_base', "card blue-grey lighten-2", getPizzaBase);

	function getPizzaBase(base) {
		document.querySelectorAll('#prices > span').forEach(price => {
			// if the class name of the div matches the base id of the selected pizza id then unhide it to display the prices
			price.className == `base-${base}` ? price.removeAttribute('hidden') : price.setAttribute('hidden', true);	


		});

		// update base_id global variable
		base_id = base;

		// update price div
		document.querySelector('#pizza_summary > span').innerHTML = getPizzaPrice(getPizza(base_id, toppings.length));	
	}

	///////////////// toppings /////////////////////
	// get all topping elements with querySelector
	// do similar foreach as with pizza bases to enable selection - but allow multiple to be selected
	// keep track of how many selected - e.g foreach function - if class matches someclass then add to topping count
	// adjust price accordingly
	// On add to order, add toppings, number, price etc to localstorage
	// show order price in header

	const topping_class = document.querySelector('#topping').className;

	const topping_class_selected = "waves-effect waves-teal btn";

	var toppings = []

	let topping_el = document.querySelectorAll('#topping');

	topping_el.forEach(topping => {
		topping.addEventListener("click", function () {

			// get model id of topping from parent node id
			let id = this.getAttribute("name");
			
			// toggle class of element to indicate state
			const {x, state} = toggle(this.className, topping_class_selected, topping_class);

			// change class to toggle if selected or not
			this.className = x;

			// add or remove topping to toppings list
			state == true ? toppings.push(id) : toppings = arrayRemove(toppings, id);

			// update price div
			document.querySelector('#pizza_summary > span').innerHTML = getPizzaPrice(getPizza(base_id, toppings.length));

		});
	});


	///////////// add to order button /////////////////
	// create an order dictionary and add to local storage {Pizza: id, Topping: [id, id, id]}
	// clear variable holding toppings, pizza base etc
	// get id of pizza with the selected base and number of selected toppings
	document.querySelector('#addToOrder_Pizza').addEventListener('click', () => {
		if (!base_id) {
			return;
		} 

		let pizza = getPizza(base_id, toppings.length);
		
		if (pizza.length > 0) {
			pizza = pizza[0]
		} else return
		
		// toppings array is likely to be modified to make a copy
		const topping_ids = Array.from(toppings);

		addToOrder({'pizza': pizza.pk, 'toppings': topping_ids}, pizza.fields.price);
	})
  

    ////////////////////////////////////////////////


	function getPizza(base, toppings) {
		// base is id of pizza base, toppings is number of toppings selected
		// search pizza JSON object for pizza with macthing base id and number of toppings
		// returns array

		if (toppings > 3) toppings = 'Sp';

		return pizza_json.filter(pizza => pizza.fields.base == base && pizza.fields.toppings == toppings);

	}

	function getPizzaPrice (pizza) {
		// pizza is an array. 
		return pizza.length > 0 ? `Price: $${pizza[0].fields.price}` : "invalid combination";

	}

	////////////////// subs ///////////////////////

	var sub_size
	var sub_filling
	var sub_price

    // get all the elements with the desired class name
	let sub_els = document.querySelectorAll('#Sub_size')

	getCard(sub_els, '#Sub_size' , "card blue-grey lighten-2", getSubSize);

	function getSubSize(sub) {
		sub_size = sub;
		updateSubPrice();


	};



	///////////////// fillings /////////////////////
	let filling_els = document.querySelectorAll('#filling');

	let x = getCard(filling_els, '#filling' , "waves-effect waves-teal btn", getSubFilling);

	function getSubFilling(filling) {

		sub_filling = filling;
		updateSubPrice();

	};


	function updateSubPrice() {
		let sub = filling_json.filter(filling => filling.pk == sub_filling);
		let order_btn = document.querySelector('#addToOrder_Sub')

		if (!sub_filling) {
			document.querySelector('#sub_summary > span').innerHTML = "choose a filling"
			order_btn.className = "waves-effect waves-light btn disabled"
			return
		}

		if (!sub_size) {
			document.querySelector('#sub_summary > span').innerHTML = "choose a size"
			order_btn.className = "waves-effect waves-light btn disabled"
			return
		}

		if (sub_size == 'SM') {
			// check that small size is a valid option
			let price = sub[0].fields.price_small;
			if (price < 0) {
				document.querySelector('#sub_summary > span').innerHTML = "Selection not available in small";
				order_btn.className = "waves-effect waves-light btn disabled"
				return;
			}
			sub_price = extra_price + parseFloat(price);
			document.querySelector('#sub_summary > span').innerHTML = `$${sub_price.toFixed(2)}`;
			order_btn.className = "waves-effect waves-light btn"
		} 
		else {
			// check that large size is a valid option
			let price = sub[0].fields.price_large;
			if (price < 0) {
				document.querySelector('#sub_summary > span').innerHTML = "Selection not available in large";
				order_btn.className = "waves-effect waves-light btn disabled"
				return;
			}			
			sub_price = extra_price + parseFloat(price);
			document.querySelector('#sub_summary > span').innerHTML = `$${sub_price.toFixed(2)}`;
			order_btn.className = "waves-effect waves-light btn"
		}
	};

//////////////// Sub Extras ////////////////
	const extra_class = document.querySelector('#extra').className;

	const extra_class_selected = "waves-effect waves-teal btn";

	var extras = []

	var extra_price = 0

	extra_el = document.querySelectorAll('#extra');

	extra_el.forEach(extra => {
		extra.addEventListener("click", function () {

			// get model id of topping from parent node id
			let id = this.getAttribute("name");

			// toggle class of element to indicate state
			const {x, state} = toggle(this.className, extra_class_selected, extra_class);

			// change class to toggle if selected or not
			this.className = x;

			// add or remove topping to toppings list and update extra_price
			let extra_el = extra_json.filter(x => x.pk == id);

			if (state == true) {
				extras.push(id);
				extra_price += parseFloat(extra_el[0].fields.price);

			}

			else {
				extras = arrayRemove(extras, id);
				extra_price -= parseFloat(extra_el[0].fields.price); 
			}

			// update price div
			updateSubPrice();

		});
	});

	document.querySelector('#addToOrder_Sub').addEventListener('click', () => {
		if (!sub_size || !sub_filling) {
			return;
		} 

		// extras array is likely to be modified to make a copy
		const extra_ids = Array.from(extras);

		addToOrder({'sub': sub_filling, 'size': sub_size, 'extras': extra_ids }, sub_price);
	})





	///////////////// other /////////////////////
	let other_els = document.querySelectorAll('#other');

	let y = getCard(other_els, '#other', "waves-effect waves-teal btn", updatePrice);

	function updatePrice(id) {

		let item = other_json.filter(dish => dish.pk == id);

		// button id is related to menu category PK
		let menu_id = item[0].fields.menu

		let order_btn = document.querySelector(`#addToOrder_${menu_id}`);

		if (!item) {
			document.querySelector('#other_summary > span').innerHTML = "invalid selection";
			order_btn.className = "waves-effect waves-light btn disabled";
			return;
		}

		let price = item[0].fields.price;

		document.querySelector(`#other_summary_${menu_id} > span`).innerHTML = `$${price}`;
		
		// enable add to order button and attach event handler
		order_btn.className = "waves-effect waves-light btn";

		if (order_btn.getAttribute('listener') !== true) {
			
			order_btn.addEventListener('click', function listener() {

				addToOrder({'other': id, 'menu': menu_id}, price);
			// remove event listener to prevent multiple being attached to order button
			// order_btn.removeEventListener('click', listener);
		

			})
			order_btn.setAttribute('listener', true);
		}





	};	
	



});

// helper function used to toggle class name of an element
// x is class of element to be changed, string
// selected and unselected are class names to toggle between, both strings
// returns class to set element to and a boolean to describe state
function toggle(x, selected, unselected) {

	// state variable - true means item is set to selected, false means it is unslected
	let state;

	if (x == unselected) {
		// change state to selected
		x = selected;
		// set state to true
		state = true; 
	}
	else {
		x = unselected;
		state = false;
	}

	return {x, state};

};

// remove a specific element from an array and return new array
function arrayRemove(arr, value) {
	return arr.filter(item => item != value);
}

function addToOrder(item, price) {
	// add items to order list
	order_items.push(item);

	// update order price
	order_price += parseFloat(price);

	// add to local storage
	localStorage.setItem('order_items', JSON.stringify(order_items));
	localStorage.setItem('order_price', order_price);
	//console.log(localStorage.getItem('order_items'))

	// flash a message
	M.toast({html: `Added! ${order_items.length} item(s) in basket`});
}

/**
 * sends a request to the specified url from a form. this will change the window location.
 * @param {string} path the path to send the post request to
 * @param {object} params the paramiters to add to the url
 * @param {string} [method=post] the method to use on the form
 */

function post(path, params, method='post') {

  // The rest of this code assumes you are not using a library.
  // It can be made less wordy if you use one.
  const form = document.createElement('form');
  form.method = method;
  form.action = path;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = key;
      hiddenField.value = params[key];

      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
}


function getCard(elements, element_id, element_class_selected ,callback) {
	// function to attached event handler - pass element id, get element name when clicked
	// elements = queryselect array of html elements
	// element_id = string containing id of elements in query select
	// element_class_selected = string containing class that element should be set to once clicked
	// callback function = function that should be executed each time element is cliked

	const element_class = document.querySelector(`${element_id}`).className;

	elements.forEach(element => {
		element.addEventListener("click", function () {
			// reset class of all elements in query select and remove any pizza bases in localstorage
			elements.forEach(element => {
				element.className = element_class;

			});
			// set class of clicked element
			this.className = element_class_selected;

			// get name of element, which holds id of model instance
			let x = this.getAttribute("name")

			callback(x);

		});
	});	

}