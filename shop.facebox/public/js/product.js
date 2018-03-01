
var PRODUCT_URL  = 'https://beershop.local/products/';
var ORDER_URL  = 'https://beershop.local/';
var USER_URL  = 'https://beershop.local/';
var FACEBOX_URL  = 'https://beershop.local/facebox';

var stopFind = false

$.getJSON(PRODUCT_URL, function( data ) {
  $.each(data, function( key, val ) {
    $("#products").append(`
      <div class="card" style="width: 20rem;" data-toggle="modal" data-target="#productModal" data-product="${key}">
      <div class="card-header">${val.name}</div>
        <img class="card-img-bottom" src="${val.image_url}" alt="${val.name}">
      </div>`);
  });
});

var productID = ""

$('#productModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget)
  productID = button.data('product')
  var modal = $(this)

  $.getJSON(PRODUCT_URL + productID, function( data ) {
    modal.find('.modal-title').text(data.name)
    modal.find('.modal-body .product-description').text(data.description)
    modal.find('.modal-body .product-image').html(`
      <img src="${data.image_url}" alt="Card image cap" class="rounded img-fluid">
      `)
  });
})

var fv = new machinebox.Face({
  videoSelector: '#facePreview',
  onStart: function(){
    setTimeout(function(){findUser()}, 1000)
  }
})

$('#orderProductBtn').click(function() {
  $('#productModal').modal('hide')
  $('#orderModal').modal('show')
  event.preventDefault()
  
  fv.start()
  
  $('#createUserBtn').click(function( event ){
    stopFind = true
    $('#webcam').hide()
    $('#userForm').show()
    $('#createUserButtons').show()
    event.preventDefault()
  })
});

$('#submitOrderBtn').click(function( event ) {
  $('#userForm').hide()
  $('#cancleOrderBtn').hide()
  $('#submitOrderBtn').hide()
  createUserAndPlaceOrder()
  event.preventDefault()
});



$('#productModal').on('hidden.bs.modal', function (event) {
  var modal = $(this)
  modal.find('.modal-title').text('Loading...')
  modal.find('.modal-body .product-description').empty()
  modal.find('.modal-body .product-image').empty()
  modal.removeData('product')
})

function createUserAndPlaceOrder(){
  var user = {
    email: $('#emailInput').val(),
    name: $('#nameInput').val()
  }  
  $.post(USER_URL + 'userCreate', user, function(response) {
    placeOrder(response.id, 3)
  }, 'json');
}

function placeOrder(userID, images){
  $.getJSON(PRODUCT_URL + productID, function( data ) {
    order = {
      userID: userID,
      items: [data],
    }
    $.post(ORDER_URL + 'orderCreate', order, function(orderResponse) {
      $('#createUserBtn').hide()
      $('#webcam').show()
      $('#training').show()

      trainFaceBox(images, userID, orderResponse.id)
    }, 'json');
  });
}

function trainFaceBox(images, userID, orderID){
  console.log(images)
  var train = {
    image: fv.getBase64Snapshot(),
    userID: userID,
  }

  if(images > 0) {
    setTimeout(function(){
      $.post(FACEBOX_URL + '/train', train, function() {
        console.log("Successfull Trained")
        images--
        trainFaceBox(images, userID, orderID)
      }, 'json').fail(function() {trainFaceBox(images, userID, orderID)})
    }, 1000)
  } else {
    window.location.href = "/order.html#" + orderID
  }
}

function findUser(){
  if(stopFind === false){
    console.log("Find User")
    find = {
      image: fv.getBase64Snapshot()
    }

    console.log(JSON.stringify(find))
    $.post(FACEBOX_URL + '/find', find, function(userResponse, status) {
      console.log(status)
      if(status == "success"){
        placeOrder(userResponse.userID, 0)
      } else {
        setTimeout(function(){findUser()}, 1000)
      }
    }, 'json').fail(function() {
      console.log("error")
      setTimeout(function(){ findUser() },500);
    })
  }
}