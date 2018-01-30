const { Etcd3 } = require('etcd3');
const client = new Etcd3({hosts: process.env.ETCD_HOSTS});

module.exports = {
  getProducts: function (req, res) {
    id = req.originalUrl.replace(/^\//, "");
    if (id == ""){
      console.log("all")
      client.getAll().prefix("product_").json()
        .then(value => {
          if(value == null){
            res.status(404).send("Not found")
          }else {
            b = {}
            Object.keys(value).forEach(function(key){
              b[key.replace(/^product_/, "")] = value[key]
            });
            res.json(b);
          }
        })
      } else {
        console.log(id)
        productId = "product_" + id
        client.get(productId).json().then(data => {
          if(data == null){
            res.status(404).send("Not found")
          } else {
            res.json(data)
          }
        })
      }
    }
}
