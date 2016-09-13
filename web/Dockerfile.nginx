FROM nginx

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

COPY bin/run.sh /run.sh
COPY output/ /usr/share/nginx/html

CMD ["/run.sh"]
