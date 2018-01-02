FROM haproxy
EXPOSE 10000
EXPOSE 10001
COPY haproxy.sh /usr/bin/haproxy.sh
VOLUME /var/haproxy
CMD ["/usr/bin/haproxy.sh"]