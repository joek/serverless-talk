var GET_ORDER_URL  = 'http://get-order.dkomatx.yaas.io/';

orderId = window.location.hash.substr(1)
orderUrl = GET_ORDER_URL + orderId

$("#orderId").append(orderId)
$("#order").hide();
function pollOrderData(){
  $.getJSON(orderUrl, function( data ) {
    $("#orderAddress").empty()
    $("#orderAddress").append(`
      ${data.address.recipient_name}<br/>${data.address.line1}<br/>${data.address.city}, ${data.address.state}`);
    $("#orderStatus").empty()
    $("#orderStatus").append("<b>Status: </b>" + data.status);
    $("#items").empty()
    $.each(data.items, function( key, val ) {
      $("#items").append(`
        <tr>
          <th scope="row">${key}</th>
          <td>${val.name}</td>
          <td>${val.quantity}</td>
          <td>${val.price}${val.currency}</td>
        </tr>`);
    });
    $("#order").show();
    setTimeout(pollOrderData,5000);
  });
}

pollOrderData();
