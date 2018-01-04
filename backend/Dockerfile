FROM haproxy
EXPOSE 9999
EXPOSE 10000
EXPOSE 10001
EXPOSE 10002
EXPOSE 10003
COPY haproxy.sh /usr/bin/haproxy.sh
VOLUME /var/haproxy
CMD ["/usr/bin/haproxy.sh"]