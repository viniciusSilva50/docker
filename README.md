# Docker para ambiente php

> docker run -d -p 8084:8085 -v /Users/vinicius/Projetos/docker/php/www:/usr/src/wd -w /usr/src/wd php php -S 0.0.0.0:8085

* Executa o container php, vinculado a porta 8084 da maquina com a posta 8085 do container
* Vincula a pasta /Users/vinicius/Projetos/docker/php/www com a pasta /usr/src/wd do container
* Agora informamos com o WORKING DIRECTORY (-w /usr/src/wd), que é o diretorio onde deve no container onde deve ser executado o comando desejado/informado
* Por fim o nome do container seguido do comando que deve ser executado no container php php -S 0.0.0.0:8085 

===================================================================

# Criando um Dockerfile

* Crie um arquivo com o nome Dockerfile
* Cole o código abaixo no arquivo
>FROM php:7.0-cli \
>COPY ./www /usr/src/myapp \
>WORKDIR /usr/src/myapp \
>CMD [ "php", "./index.php" ] 

* Execute o código abaixo no diretorio onde se encontra o arquivo Dockerfile
>docker build -t my-php-app .

* E por fim execute este comando para rodar a sua imagem
 > docker run -it --rm --name my-running-app my-php-app
 
 
# Docker para ambiente php com apache
