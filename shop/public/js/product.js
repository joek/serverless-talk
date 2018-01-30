var PRODUCT_URL  = 'http://product-service.dkomatx.yaas.io/';

$.getJSON(PRODUCT_URL, function( data ) {
  $.each(data, function( key, val ) {
    $("#products").append(`
      <div class="card" style="width: 20rem;" data-toggle="modal" data-target="#productModal" data-product="${key}">
      <div class="card-header">${val.name}</div>
        <img class="card-img-bottom" src="${val.image_url}" alt="${val.name}">
      </div>`);
  });
});

$('#productModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget)
  var productID = button.data('product')
  var modal = $(this)
  $.getJSON(PRODUCT_URL + productID, function( data ) {
    modal.find('.modal-title').text(data.name)
    modal.find('.modal-body .product-description').text(data.description)
    modal.find('.modal-body .product-image').html(`
      <img src="${data.image_url}" alt="Card image cap" class="rounded img-fluid">
      `)
    modal.data('product', productID)
    modal.find('.modal-footer').append('<div id="paypal-button"></div>')
    renderPayPal();
  });
})

$('#productModal').on('hidden.bs.modal', function (event) {
  var modal = $(this)
  modal.find('.modal-title').text('Loading...')
  modal.find('.modal-body .product-description').empty()
  modal.find('.modal-body .product-image').empty()
  modal.removeData('product')
  modal.find('#paypal-button').remove()
})
