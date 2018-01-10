#! /usr/bin/env bash

until [[ -f /var/haproxy/haproxy.cfg ]]
do
    echo "Waiting for config to be available..."
done
cd /var/haproxy
haproxy -f /var/haproxy/haproxy.cfg -V