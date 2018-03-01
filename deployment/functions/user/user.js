const { Etcd3 } = require('etcd3');
const crypto = require('crypto');
const client = new Etcd3({hosts: process.env.ETCD_HOSTS});
var fs = require('fs');


var createUser = function(req, res) {
  user = {
    id: crypto.randomBytes(Math.ceil(20/2))
    .toString('hex') // convert to hexadecimal format
    .slice(0,20).toUpperCase(),
    email: req.body.email,
    name: req.body.name,
    orders: [],
  }

  client.put('user_' + user.id).value(JSON.stringify(user)).then(
    function(data) {
      res.json(user)
    },
    function(data)  {
      res.status(500).send("User not created")
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

module.exports = {
  createUser: createUser,
  getUser: getUser,
}
