var CREATE_PAYMENT_URL  = 'http://init-payment.dkomatx.yaas.io/';
var EXECUTE_PAYMENT_URL = 'http://execute-payment.dkomatx.yaas.io/';

var renderPayPal = function() {
  paypal.Button.render({
        env: 'sandbox', // Or 'sandbox',

        commit: true, // Show a 'Pay Now' button

        style: {
          color: 'blue',
          size: 'medium',
          shape: 'rect',
          tagline: false
        },

        payment: function(data, actions) {
          return paypal.request.post(CREATE_PAYMENT_URL + $('#productModal').data('product')).then(function(data) {
            return data.paymentId;
          });
        },

        onAuthorize: function(data, actions) {
          var data = {
                      paymentID: data.paymentID,
                      payerID: data.payerID
                  };
          return paypal.request.post(EXECUTE_PAYMENT_URL, data)
                      .then(function (res) {
                        console.log(res)
                        orderId = res.orderId
                        window.location.href = `/order.html#${orderId}`;
                      });
        },

        onCancel: function(data, actions) {
          window.alert('Payment Canceled!');
        },

        onError: function(err) {
          window.alert('Payment Error!');
        }
      }, '#paypal-button');
}
