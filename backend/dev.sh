#! /usr/bin/env bash

docker build -t hydra-testing .
docker rm -f hydra-testing 2>&1
docker run --name=hydra-testing -d -v "$(pwd)/config":/var/haproxy -p 9999:9999 -p 10000:10000 -p 10001:10001 -p 10002:10002 -p 10003:10003 -t hydra-testing