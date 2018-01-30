const express = require('express')
const app = express()
const paypal = require('./paypal');
const order = require('./order');
const hipchat = require('./hipchat');
var bodyParser = require('body-parser')


app.use(bodyParser.json())


app.post('/execute', paypal.executePayment)

app.post('/order', order.createOrder)
app.get('/order/*', order.getOrder)
app.get('/*', paypal.initPayment)
app.post('/hipchat', hipchat.updateOrderStatus)

app.listen(3002, () => console.log('Example app listening on port 3002!'))
