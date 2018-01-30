# General Setup
TODO: Send out order received event
TODO: Store order Status
TODO: Implement order Page
TODO: Implement oder update service
TODO: Forward to Order Page after create

# Serverless Talk
TODO: Implement Order event receiver
TODO: Implement Storage
TODO: Implement Beerbot (add sensor)
TODO: Create aktor for firework


- index.html
  - 3 Beer bottles
  - Paypal button
- Order Page

Install kubeless and push functions
```
minikube start

# Install kubeless
cd deployment

kubectl create ns kubeless
kubectl create -f kubeless-rbac-v0.3.3.yaml

# Install etcd
cd deployment/etcd/etcd-operator
./example/rbac/create_role.sh
kubectl create -f example/deployment.yaml
kubectl get customresourcedefinitions
cd ..
kubectl create -f etcd-cluster.yaml
kubectl apply -f etcd-cluster-nodeport-service.json
export ETCDCTL_API=3
export ETCDCTL_ENDPOINTS=$(minikube service etcd-cluster-client-service --url)

# Upload data
cd data
./deploy.sh

# Deploy functions
cd deployment/functions
./deploy.sh

# Deploy nats
kubectl create configmap nats-config --from-file nats.conf
kubectl create secret generic tls-nats-server --from-file nats.pem --from-file nats-key.pem --from-file ca.pem
kubectl create -f nats.yml


# build client image and deploy
docker tag $(docker build -q -t beershop .) joekhybris/beershop:latest && docker push joekhybris/beershop:latest
kubectl delete deployment beershop-deployment
kubectl apply -f ../deployment/nginx.yml
```

NATS
pass: xqwwVp9C&Hn6jXcux4r)vq
bcrypt hash: $2a$11$6B7TANN9cou6SskQ1Re3L.mVk5u2wEWVXUSw1/SsVYTKQcZLSMVru
