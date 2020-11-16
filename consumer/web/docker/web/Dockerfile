FROM nginx:alpine

COPY ./nginx-web.conf /etc/nginx/conf.d/default.conf
COPY ./www /usr/share/nginx/html

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
