const request = require('request');
const { Etcd3 } = require('etcd3');
const crypto = require('crypto');
const client = new Etcd3({hosts: process.env.ETCD_HOSTS});
const hipchatUrl = process.env.HIPCHAT_URL;
var nats = require('nats');
var fs = require('fs');

// Simple TLS connect
var tlsOptions = {
  rejectUnauthorized: false,
};
var nc = nats.connect({'url':"nats://nats-client:4222", 'user':'natsuser', 'pass':'xqwwVp9C&Hn6jXcux4r)vq', tls: tlsOptions});

var createOrder = function(req, res) {
  order = {
    id: crypto.randomBytes(Math.ceil(20/2))
          .toString('hex') // convert to hexadecimal format
          .slice(0,20).toUpperCase(),
          // TODO: Add Items
          // TODO: Add User
          // TODO: Add Shipping Address
    items: req.body.items,
    status: "created"
  }

  client.put('order_' + order.id).value(JSON.stringify(order)).then(
    function(data) {
      res.json(order)
      nc.publish('OrderCreated', JSON.stringify(order))
    },
    function(data)  {
      res.status(500).send("Order not created")
    }
  );

}

var getOrder = function(req, res) {

  id = req.originalUrl.replace(/^.*\//, "")
  orderId = 'order_' + id
  console.log(orderId)
  client.get(orderId).json().then(
    function(data) {
      if(data == null){
        res.status(404).send("Not found")
      } else {
        res.json(data)
      }
    },
    function(data)  {
      res.status(500).send("Something went wrong")
    }
  );

}

var updateOrderStatus = function(req, res){
  orderId = "order_" + req.body.id;
  status = req.body.status;
  client.get(orderId).json().then(
    function(order) {
      if(order == null){
        res.status(404).send("Not found")
      } else {
        order.status = status

        client.put(orderId).value(JSON.stringify(order)).then(
          function(data) {
            console.log(order)
            res.json(order)
          },
          function(data)  {
            res.status(500).send("Order not updated")
          }
        )
      }
    },
    function(data)  {
      res.status(500).send("Something went wrong")
    }
  );
}
module.exports = {
  createOrder: createOrder,
  getOrder: getOrder,
  updateOrderStatus: updateOrderStatus,
}
