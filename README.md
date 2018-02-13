<h1>Docker Mysql</h1>

<ul>
    <li>Primeiro foi preciso criar o arquivo Dockerfile com os parâmentros necessários para criar a imagem customizada.</li>
    <li>
        <p>Após criar o Dockerfile é preciso realizar a build, segue o exemplo do comando para de build.</p>
        <div>
            <pre><code>docker build -t mysql-docker /Users/vinicius/Projetos/sistemas/drupal-docker</code></pre>        
        </div>
        <p>O comando build cria uma imagem conforme o arquivo Dockerfile encontrado no diretório indicado. O arqumento -t indica com o alias que sua imagem vai ter.</p>
    </li>
    <li>
        <p>Agora é preciso gerar um container executável com a imagem criada, execute o comando docker run. Segue um exemplo abaxo.</p>
        <pre><code>docker run -d --name mysql -p 127.0.0.1:3306:3306 mysql-docker</code></pre>
        <p>Vamos entender o que o comando run faz junto com cada argumento passado.</p>        
        <ol>
            <li>O argumento -d é para liberar o terminal após executar o docker run.</li>
            <li>O argumento --name seguido de um qualquer, vai criar o apelido para nosso container.</li>
            <li>O argumento -p determina qual o ip e porta estamos vinculando de máquina local a porta de nosso container.</li>
            <li>E por fim indicamos qual o imagem que sera vinculada com nosso container.</li>
        </ol>        
    </li>
    <li>
        <p>Agora é preciso entrar no container para criar um usuário que permita a conexão remota ao nosso server mysql.</p>
        <strong>OBS: Acredito que posso ser feito de outra forma, mas preciso estudar mais sobre (13/02/2018).</strong>
        <ol>
            <li>
                <p>Primeiro verificar se o container criado no comando docker run esta em execução.</p>                
                <pre><code>docker ps</code></pre>
            </li>            
            <li>
                <p>Caso o container não for listado pelo comando anterior, é preciso executar comando docker start seguindo do nome do container.</p>
                <pre><code>docker start mysql</code></pre>
            </li>
            <li>
                <p>Com o container em execução podemos agora sim entrar dentro do container em si, é preciso executar o comando docker exec seguido do argumento -it (iterative mode), depois passar o nome do container que deseja manipular e por fim o parâmetro bash, que ira habiitar o command line dentro do container.</p>
                <pre><code>docker exec -it mysql bash</code></pre>
            </li>            
            <li></li>
            <li></li>
        </ol>
    </li>    
</ul>

# Sites de referencia

* https://docs.docker.com/samples/library/php/
* https://docs.docker.com/engine/reference/commandline/cli/