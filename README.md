# Docker Mysql

* Primeiro foi preciso criar o arquivo Dockerfile com os parâmentros necessários para criar a imagem customizada.

* Após criar o Dockerfile é preciso realizar a build, segue o exemplo do comando para de build.  
> docker build -t mysql-docker /Users/vinicius/Projetos/sistemas/drupal-docker

* O comando build cria uma imagem conforme o arquivo Dockerfile encontrado no diretório indicado. O arqumento -t 
 indica com o alias que sua imagem vai ter.

* Agora é preciso gerar um container executável com a imagem criada, execute o comando docker run. Segue um exemplo abaxo.

 > docker run -d --name mysql -p 127.0.0.1:3306:3306 mysql-docker
 
 * Vamos entender o que o comando run faz junto com cada argumento passado.
 
 1) O argumento -d é para liberar o terminal após executar o docker run.
 2) O argumento --name seguido de um qualquer, vai criar o apelido para nosso container.
 3) O argumento -p determina qual o ip e porta estamos vinculando de máquina local a porta de nosso container.
 4) E por fim indicamos qual o imagem que sera vinculada com nosso container.
  
* Agora é preciso entrar no container para criar um usuário que permita a conexão remota ao nosso server mysql. 
 OBS: Acredito que posso ser feito de outra forma, mas preciso estudar mais sobre (13/02/2018).
 
 


# Sites de referencia

* https://docs.docker.com/samples/library/php/
* https://docs.docker.com/engine/reference/commandline/cli/