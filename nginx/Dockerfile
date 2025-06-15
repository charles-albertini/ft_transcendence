FROM nginx:1.28.0-alpine3.21-perl

# Copy nginx config template
COPY default.conf /etc/nginx/nginx.conf.template
COPY certificates /etc/nginx/certs

COPY script.sh /script.sh
RUN chmod +x /script.sh

EXPOSE 5000

ENTRYPOINT [ "/script.sh" ]
CMD [ "nginx", "-g", "daemon off;" ]