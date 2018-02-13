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
        <strong>Vamos entender o que o comando run faz junto com cada argumento passado.</strong>
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
            <li>
                <p>Agora dentro do container precisamos nos conectar ao server mysql. Os parâmetros de conexão do mysql são as variáveis de ambientes configuradas do Dockerfile</p>
                <pre><code>mysql -h127.0.0.1 -P3306 -uroot -p12345</code></pre>
            </li>
            <li>
                <p>Após estar conectado vamos criar um usuários com todos os privilégios e com todas as portas abertas. Segue os comandos a serem executados, é importante que os comandos sejam executados na ordem determinada e que todos tenham sucesso.</p>
                <pre><code>create user 'user'@'%' identified by 'pass';</code></pre>
                <pre><code>grant all privileges on *.* to 'user'@'%' with grant option;</code></pre>
                <pre><code>flush privileges;</code></pre>
                <pre><code>exit;</code></pre>                    
            </li>
        </ol>
    </li>   
    <li>       
        <p>Desconecte-se do container com o comando.</p>
        <pre><code>exit</code></pre>
    </li>
    <li>
        <p>E por fim reinicine o container.</p>
        <pre><code>docker stop -t0 mysql</code></pre>
        <pre><code>docker start mysql</code></pre>
    </li>
</ul>

<h2>Sites de referência</h2>

<ul>
    <li><a href="https://docs.docker.com/samples/library/php/" target="_blank">https://docs.docker.com/samples/library/php/</a></li>
    <li><a href="" target="_blank"></a></li>
    <li><a href="" target="_blank"></a></li>
    <li><a href="" target="_blank"></a></li>
    <li><a href="" target="_blank"></a></li>
    <li><a href="" target="_blank"></a></li>
    <li><a href="" target="_blank"></a></li>    
</ul>