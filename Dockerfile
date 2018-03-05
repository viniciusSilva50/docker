FROM node AS node-docker
RUN mkdir -p /var/www/node
EXPOSE 3000
VOLUME /Users/vinicius/Projetos/sistemas/docker-node-volume-folder:/var/www/node
WORKDIR /var/www/node

