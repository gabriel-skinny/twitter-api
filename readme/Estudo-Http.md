# Estudo - HTTP

Definição: Hyper-text-Transfer-Procol. Um protocolo que trabalha em cima do TCP/IP definindo um padrão de comunicação entre cliente e sevidor. É o fundamento de toda transferencia de dados na internet

Conceitos dos Http

- Stateless: Cada requisição é uma transação unica com um contexto especifico, porém pode ter uma sessão com o uso dos Cokkies
- Extensivo: Novos parametros podem ser adicionados no header, podendo o Cliente e Servidor criarem uma semantica propria
- Modelo request e response: O cliente faz uma requisição pedindo certo recurso de um servidor.

Client(User-Agente): Normalmente um web-browser que resolver o destino de uma url e acha o endereço para fazer uma requisição http pedindo o conteúdo da pagina html ao servidor

Servidor(Web-Server):

Proxies: Entre o cliente e o servidor existem varios camadas escondidas que resolvem a requisição, porém na aplication layer são chamados proxies as maquinas que interceptam uma request http. Alguns proxies que podem ser implementados são:

- Caching
- Filtring
- Load balacing
- Authentication
- logging

Campos :

- Metódo
- Path: Url
- Protocolo: Tipo de Protocolo Http usado. Ex: HTTP/1.1
- Headers:
  - General: Status Code, Remote Address, Referrer Policy
  - Request: Cokkies, Accept-xxx, Content-Type, COntent-Length, Authroization, User-Agente, Referrer
  - Response: Server, Set-Cokkie, Content-Type, Content-Length, Date
  - Representation:
  - Payload

Methods:

- Get: Pega informações do Servidor
- Post: Adiciona informações ao Servidor
- Put: Edita uma informação já contida no Servidor
- Delete: Delta informações do Servidor

StatusCode:

- 1XX: Informacional: Request recebida e esta sendo processada
- 2XX: Sucess: Request recebida, entendida e aceitada
- 3XX: Redirect: Uma proxima ação deve ser feita
- 4XX: Client Error: Request não tem o que preicsa
- 5XX: Server Error: Server falhou para executar uma request valida

HTTPS(Secure): É uma implementação do protocolo http mas com a transmissão de dados sendo criptografada por SSL/TLS

TCP:

- Protocolo mais utilizado na Transport-layer pelo HTTP
- Three-way-handshakae: Validação feita pelo cliente e servidor para começar a trocar de informações

HTTP/1.1 VS HTTP/2:

- Não é mais um protocolo de texto e sim um protocolo binario, e sendo binario pode enviar seus dados em streams que possuem packtes de dados.
- Utiliza multiplexing permitindo as requisições serem processadas assincronamente pelo servidor conforme os packtes vão chegando

### CORS(Cross-Policy Resource Sharing)

Definição: Header do HTTP que permite infromar ao cliente a origem dos recursos que ele utiliza sem ser ele mesmo e se ele deve aprova-lo

- O browser possui um CORS definido para requisições usando Fetch, então todas as chamadas a scripts devem retornar o CORS certo para que a requisição seja aceita pelo browser.

## Links de Referencia

HTTP-Overview(https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)
CORS(https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
