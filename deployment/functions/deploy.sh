#!/bin/bash

source ./source_me.sh

kubeless function delete init-payment
kubeless function deploy init-payment --runtime nodejs8 --from-file order/paypal.js --handler paypal.initPayment --dependencies order/package.json --env PAYPAL_CLIENT_ID=${PAYPAL_CLIENT_ID} --env PAYPAL_CLIENT_SECRET=${PAYPAL_CLIENT_SECRET} --env ETCD_HOSTS=etcd-cluster-client:2379

kubeless function delete create-order
kubeless function deploy create-order --runtime nodejs8 --from-file order/order.js --handler order.createOrder --dependencies order/package.json --env ETCD_HOSTS=etcd-cluster-client:2379 --env HIPCHAT_URL=${HIPCHAT_URL}

kubeless function delete get-order
kubeless function deploy get-order --runtime nodejs8 --from-file order/order.js --handler order.getOrder --dependencies order/package.json --env ETCD_HOSTS=etcd-cluster-client:2379

kubeless function delete update-order-status
kubeless function deploy update-order-status --runtime nodejs8 --from-file order/order.js --handler order.updateOrderStatus --dependencies order/package.json --env ETCD_HOSTS=etcd-cluster-client:2379


kubeless function delete execute-payment
kubeless function deploy execute-payment --runtime nodejs8 --from-file order/paypal.js --handler paypal.executePayment --dependencies order/package.json --env PAYPAL_CLIENT_ID=${PAYPAL_CLIENT_ID} --env PAYPAL_CLIENT_SECRET=${PAYPAL_CLIENT_SECRET} --env ETCD_HOSTS=etcd-cluster-client:2379

kubeless function delete product-service
kubeless function deploy product-service --runtime nodejs6 --from-file product/product.js --handler product.getProducts --dependencies product/package.json --env ETCD_HOSTS=etcd-cluster-client:2379

kubeless function delete hipchat-webhook
kubeless function deploy hipchat-webhook --runtime nodejs8 --from-file order/hipchat.js --handler hipchat.updateOrderStatus --dependencies order/package.json --env ETCD_HOSTS=etcd-cluster-client:2379


kubectl apply -f order/service.yaml
kubectl apply -f product/service.yaml
kubectl apply -f order/hipchat.yaml
