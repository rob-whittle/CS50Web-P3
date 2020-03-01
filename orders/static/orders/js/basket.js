
document.addEventListener('DOMContentLoaded', () => {


	// check to see if there any items in the order, if not redirect to basket page and prevent POST request
// 	if (!localStorage.getItem('order_items')) {
// 		M.toast({html: 'Basket is empty!  Add some food!'});
// 		return false;

// 	}

// 	post('/basket/', {'items': localStorage.getItem('order_items'), 'csrfmiddlewaretoken': CSRF_TOKEN});
       
// });    

  document.querySelector('#checkout').onclick = () => {

    let order = document.querySelector('#basketitems').innerHTML;

    // remove items from local storage
    localStorage.clear();

    post('/orders/', {'order': order, 'csrfmiddlewaretoken': CSRF_TOKEN});
  }
});


    ////////////////////////////////////////////////

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