#! /usr/bin/env bash

pushd backend
docker build -t haproxui-testing .
docker run -v "$(pwd)/config":/var/haproxy -p 10000:10000 -p 10001:10001 -t haproxui-testing
popd