const request = require('request');
const { Etcd3 } = require('etcd3');
const crypto = require('crypto');
const client = new Etcd3({hosts: process.env.ETCD_HOSTS});
var fs = require('fs');


var createUser = function(req, res) {
  user = {
    id: new Buffer(req.body.email).toString('base64'),
    email: req.body.email,
    orders: [],
    password: req.body.password,
  }

  client.put('user_' + user.id).value(JSON.stringify(user)).then(
    function(data) {
      res.json(user)
    },
    function(data)  {
      res.status(500).send("Order not created")
    }
  );

}

var getUser = function(req, res) {

  id = req.originalUrl.replace(/^.*\//, "")
  userId = 'user_' + id
  console.log(userId)
  client.get(userId).json().then(
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

var loginUser = function(req, res) {

  id = req.originalUrl.replace(/^.*\//, "")
  userId = 'user_' + new Buffer(req.body.email).toString('base64')
  console.log(userId)
  client.get(userId).json().then(
    function(data) {
      if(data != null && data.json.email == req.body.email && data.json.password == req.body.password){
        res.json(data.json)
      } else {
        res.status(401).send("Unauthorized")
      }
    },
    function(data)  {
      res.status(500).send("Something went wrong")
    }
  );

}

module.exports = {
  createUser: createUser,
  getUser: getUser,
  loginUser: loginUser,
}
