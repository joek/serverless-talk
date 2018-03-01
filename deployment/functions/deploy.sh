#!/bin/bash

source ./source_me.sh

kubeless function delete create-order
kubeless function deploy create-order --runtime nodejs6 --from-file order/order.js --handler order.createOrder --dependencies order/package.json --env ETCD_HOSTS=etcd-cluster-client-service:2379

kubeless function delete get-order
kubeless function deploy get-order --runtime nodejs6 --from-file order/order.js --handler order.getOrder --dependencies order/package.json --env ETCD_HOSTS=etcd-cluster-client-service:2379

kubeless function delete update-order-status
kubeless function deploy update-order-status --runtime nodejs6 --from-file order/order.js --handler order.updateOrderStatus --dependencies order/package.json --env ETCD_HOSTS=etcd-cluster-client-service:2379




kubeless function delete product-service
kubeless function deploy product-service --runtime nodejs6 --from-file product/product.js --handler product.getProducts --dependencies product/package.json --env ETCD_HOSTS=etcd-cluster-client-service:2379




kubeless function delete user-create
kubeless function deploy user-create --runtime nodejs6 --from-file user/user.js --handler user.createUser --dependencies user/package.json --env ETCD_HOSTS=etcd-cluster-client-service:2379


kubeless function delete user-get
kubeless function deploy user-get --runtime nodejs6 --from-file user/user.js --handler user.getUser --dependencies user/package.json --env ETCD_HOSTS=etcd-cluster-client-service:2379

# kubeless function delete train-user
# kubeless function deploy train-user --runtime nodejs6 --from-file user/facebox.train.js --handler user.trainUser --dependencies user/package.json --env FACEBOX_URL=http://facebox:8080/

# kubeless function delete find-user
# kubeless function deploy find-user --runtime nodejs6 --from-file user/facebox.find.js --handler user.findUser --dependencies user/package.json --env FACEBOX_URL=http://facebox:8080/