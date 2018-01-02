#! /usr/bin/env bash

pushd backend
docker build -t haproxui-testing .
docker rm -f haproxui-testing 2>&1
docker run --name=haproxui-testing -d -v "$(pwd)/config":/var/haproxy -p 10000:10000 -p 10001:10001 -p 10002:10002 -t haproxui-testing
popd