
document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.complete').forEach(order => {
    order.addEventListener('click', function() {


      let order_id = this.getAttribute("id");

      post('/kitchen/', {'order_id': order_id, 'csrfmiddlewaretoken': CSRF_TOKEN});

    })
  }) 
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