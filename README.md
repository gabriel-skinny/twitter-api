# Twiter-Api

Tentativa de recriar uma api com a maioria das funcionalidades do twitter e que seja escalável.

## High-Level Design

## Services

- [Auth-Gateway]: Gateway de Autenticação
- [Client-Service](https://github.com/gabriel-skinny/twitter-api/tree/main/src/Client/README.md): Serviço que cuida dos Usuarios (Em desenvolvimento)
- [Tweet-Service](https://github.com/gabriel-skinny/twitter-api/tree/main/src/Tweet/README.md): Servico que cuida dos Tweets do Usuario (Em desenvolvimento)
- [Follow-Service](https://github.com/gabriel-skinny/twitter-api/tree/main/src/Follow/README.md): Servico que cuida da lógica de follow (Planejado)
- [Profile-Service](https://github.com/gabriel-skinny/twitter-api/tree/main/src/Profile/README.md): Servico que cuida do Feed dos Usuarios (Planejado)
- [Feed-Service](): Servico que cuida do Feed dos Usuarios (Planejado)
- [Search-Service](): Servico que cuida do mecanismo de busca de usuario (Planejado)
- [Chat-Service](): Serviço que cuida da troca de mensagens entre usuarios

## Tabela de Conteúdos

- [Estudos](#estudos)
- [High-Level-Design] (#high-level-design)
- [Entitdades](#entitdades)
- [Requirements](#requirements)
- [Especificacoes](#especificações)
- [Dados-do-Twitter](#dados-do-twitter)
- [Endpoints](#endpoints)

## Estudos

- [Databases](https://github.com/gabriel-skinny/twitter-api/blob/main/readme/Estudo-Database.md)
- [Design-System do Twitter](https://github.com/gabriel-skinny/twitter-api/blob/main/readme/Estudo-Design-System.md)
- [Estrutura de dados](https://github.com/gabriel-skinny/twitter-api/blob/main/readme/Estudo-Estrutura-de-Dados.md)
- [Design-System](https://github.com/gabriel-skinny/twitter-api/blob/main/readme/Estudo.md)

## High-Level-Design

## Entitdades

()

## Requirements

Usuario:

Cadastro:

- Usuario consegue se cadastrar
- Usuario recebe código de validação de email
- Usuario consegue pedir reenvio da validação de email
- Usuario consegue trocar o email de confirmação
- Usuario consegue validar seu email com código e ter sua conta criada

Login:

- Usuario consegue logar
- Usuario consegue editar dados de perfil
- Usuario consegue editar a senha quando esquecida
- Usuario consegue deletar seu perfil

Profile:

- Usuario consegue ver suas informações, seus posts e posts compartilhados
- Usuario consegue ver seus comentários em outros posts
- Usuario consegue ver seus posts curtidos
- Usuario consegue ver posts e posts compartilhados de um Usuario especifico

Follow:

- Usuario consegue seguir outros Usuarios

Tweet:

- Usuario consegue fazer um post
- Usuario consegue deletar um post
- Usuario consegue curtir um post
- Usuario consegue descurtir um post
- Usuario consegue compartilhar um post
- Usuario consegue descompartilhar um post
- Usuario consegue comentar em um post
- Usuario consegue apagar o comentário de um post
- Usuario consegue ver comentários de um post
- Usuario consegue ver comentários de um comentário

Search:

- Usuario consegue pesquisar outros Usuarios pelo nome

Feed:

- Usuario consegue ver o seu feed

## Especificações

### Especificações do Tweet

- Limite de 140 Caracteres
- Suporta Video
- Suporta Imagem
- Os detalhes possuem uma camada de comentarios
- O usuario consegue ver no Post se ele já foi curtido ou compartilhado

- Os detalhes do comentário mostram 2 graus de profundidade se for um reply feito pelo usuario criador do comentário
- É possivel ver uma thread inteira de comentários de um usuario

### Especificações do Feed

- Os ultimos posts dos followers do usuario

## Dados-do-Twitter

- 500M Usuarios totais
- 200M de Usuarios Ativos
- 40M de Posts por Dia
- 1 Usuario lê 100 tweets por dia
- 1 MB de dados por Tweet
- 1 mês 18TB de Dados salvos no banco

Conclusões:

- O maior problema é armazenamento
- Informação em tempo real não é tão importante
- A escrita e leitura de dados são leves mas muito numerosas
- Manter o Feed atualizado é o maior desafio

  Soluções:

- MongoDb para escalar os dados horizontalmente
- CDN para salvar as fotos e vídeos usando o algoritimo PULL
- Criar os feeds dos usuarios asincronamente e salva em um cache para deixar disponivel instantaneamente
- Salvar profiles muito acessados em cache

## Endpoints

## Gateway

### Feature: Um Ip só poderá enviar 10 requisições no intervalo de 5 minutos

- Em rotas pesadas punir os ips mais severamente

## Cliente-Service

### Feature: Usuario consegue criar sua conta (check)

- Cliente: request Http
- Api: registerUser(name, email, password): preUserId
  - Verifica se já existe usuarios com esse email ou nome no banco
  - Verifica se já existe um preUsuario com esse nome, se sim retorna erro
  - Verifica se já existe um preUsuario com email. Se sim deleta registro do cache
  - Cria registro no cache com os dados do usuario que expira em 2 horas
  - Verifica se já existe um registro de validação de email
    - Se sim:
      - pega o código enviado
      - Adiciona uma nova tentativa a essa validação
    - Se não:
      - Cria registro de validação de email no cache que expira em 2 horas com um novo código de validação
  - Envia email para o email cadastrado com o código de validação
- Banco: MongoDb
- Cache: Redis

### Feature: Usuario consegue trocar seu email de validação(check)

- Cliente: Request HTTP
- Api: editValidationEmail(userId, newEmail)
  - Verifica se já existe algum usuario cadastro com esse email
  - Verifica se existe algum preUser no cache com aquele email, se sim retorna erro.
  - Verfica se o preUser existe
  - Verifica se não existe nenhum usuario com esse email
  - Atualiza o preUser
  - Atualiza o emailValidation do preUser se ele existe
- Cache: Redis

### Feature: Validação de email e Criação de conta

- Cliente: Request HTTP
- Api: validateCode(userEmail, validationCode, operationValidatedType): createAccountJWT
- Rota autenticada com JWT para criação
- Api: createAccount(preUserId): JWTLogin
  - Verfica se o preUser existe
  - Verifica a validade do código e sua correspondencia
  - Cria usuario
- Cache: Redis

### Feature: Reenvio de confirmação de email

- Cliente: Request HTTP
- Api: resendValidationCode(userId)
  - Verifica se o usuario já pediu essa ação mais de 5 vezes nos ultimos 30 minutos
  - Verifica se no cache existe um registro de validação de email com um código
  - Caso sim:
    - Envia um email com ele
  - Caso não:
    - Cria um novo registro de Validação de email
    - Envia um email com ele
- Cache: Redis

### Feature: Login

- Cliente: Request HTTP
- Api: login(email, password): token
  - Verifica em cache se já é a 5 tentiva de login para aquele email
  - Verifica se esse email está cadastrado
  - Verifica senha passada
  - Validação falha:
    - Gera registro ou atualiza registro de tentativa de login para aquele usuario que expira em 10 minutos
  - Validação Passa: - Retorna token JWT de acesso
- Cache: Redis

### Feature: Preencher dados de perfil

- Cliente: Request HTTP
- Rota: Autenticada
- Api: uploadMedia(userId, media): s3Url
  - Baixa foto na S3
  - Deixa disponivel no CDN
- Api: registerUserInfo(bannerPictureS3Url, profilePictureS3Url, bio, location, website, birthDate, profileName)

### Feature: Usuario consegue alterar sua senha

- Cliente: Request HTTP
- Rota: Autenticada
- Api: validatePassword(password): passwordUpdateJWT
- Rota: Autenticada para password update
- Api: updatePassword(userId, newPassword)
  - Verifica se o usuario existe
  - Verifica se a password antiga passada bate com a salva no banco
  - Verifica se a nova senha é diferente da antiga
  - Verifica se a nova senha é diferente de
  - Atualiza a password da senha

### Feature: Usuario consegue recuperar sua senha esquecida

- Cliente: Request HTTP
- Rota: Autenticada
- Api: forgotPassword(userEmail)
  - Verifica se usuario existe
  - Verifica se já existe um código de validação enviado para alterar a senha
  - Se sim: Envia email com mesmo código de validação
  - Se não: Envia novo email com novo código de validação

## Profile-Service

### Feature: Usuario consegue ver seu profile

- Cliente: request Http
- Rota autenticada
- Api: getUserPageInfo(userId, page, page.size = 20)
  - Verifica se existe um profile cacheado para esse usuario e se o take bate com o salvo no cache
  - Se não busca no banco de dados os dados do usuario e salva em cache que dura 2 minutos
  - Retorno: { UserInfo, posts: Post[]}
- Databae: MongoDb
- Cache: Redis

Dicussão:

- Qual o custo de cachear sempre, vale a pena ter alguma regra de negocio para defini-lo?
  - R: Sim, pois impede usuarios de fazerem muitas requisições para dados que não precisam estar 100% atualizados.
- Quanto tempo deixaremos em cache os profiles?
- Qual o impacto do tempo de cache?
- Tem problema o profile ficar desatualizado durante 2 minutos?

### Feature: Usuario consegue ver os seus comentários a posts

- Cliente: Request Http
- Rota autenticada
- Api: getPostsByUserComments(userId)
  - Pegar os ultimos comentários do usuario
  - Encontrar o post relacionado a eles
  - Listar os ultimos 10
  - Retorno: [{ ...Post, nestedComentaries: [{ ...Commentary, depth: 1, { ...comentaryInfo, depth: 2}}] }]

Suposições:

- Não é uma rota muito usada

## Feature: Usuario consegue ver os seus posts curtidos

- Cliente: Request Http
- Rota autenticada
- Api: getPostsByUserLikes(userId, page, pageSize)
  - Pegar os ulitmos likes do usuario
  - Encontrar o post relacionado a eles
  - Retorno: Post[]
- Database: MongoDb

Suposições:

- Não é uma rota muito usada

## Follow-Service

### Feature: Usuario consegue seguir outros usuarios

- Cliente: Request Http
- Rota autenticada
- Api: follow(userId, toFollowUserId)
  - Cria registro do follow na tb_follow
  - Envia ao Kafka o evento de usuario seguido
- Database: LevelDB ou NeoJs

## Tweet-Service

## Feature: Usuario consegue fazer um post

- Cliente: Request Http
- Rota autenticada
- Api: media(userId)
  - Salva media no S3
  - Deixa disponivel no CDN
- Api: makePost(userId, content)
  - Salva media no s3
  - Salva o post no database
  - Salva o post no cache do redis
  - Envia um evento para o Kafka de criação de Post
- Banco: MongoDb

## Feature: Usuario consegue deletar os seus posts

- Cliente: Request Http
- Rota autenticada
- Api: deletePost(userId, postId)

  - Marca deleted_at na tb_post
  - Manda um evento para o Kafka de deleção de Post

## Feature: Usuario consegue curtir um post

- Cliente: Request Http
- Rota autenticada
- Api: likePost(userId, postId)
  - Atualiza o post_id adicionando a doble-liked-list de likes
  - Envia um evento ao Kafka de post-curtido

Suposição:

- Um post pode chegar a ter 1m de likes
- Um post tem em media 10k de likes

## Feature: Usuario consegue descurtir um post

- Cliente: Request Http
- Rota autenticada
- Api: unlikePost(userId, postId)
  - Atualiza o post_id removendo o like do usuario
  - Envia um evento ao Kafka de post-ulinked

Suposição:

- Um post pode chegar a ter 1m de likes
- Um post tem em media 10k de likes

## Feature: Usuario compartilhar um post

- Cliente: Request Http
- Rota autenticada
- Api: sharePost(userId, postId, shareContent)
  - Cria um registro tb_share com o post_id
  - Invalida o cache do post
- Database: MongoDb

## Feature: Usuario compartilhar um post

- Cliente: Request Http
- Rota autenticada
- Api: sharePost(userId, postId)
  - Cria um registro tb_share com o post_id
  - Invalida o cache do post
- Database: MongoDb

## Feature : Usuario consegue fazer um comentário

- Cliente: Request Http
- Rota autenticada
- Api: likePost(userId, postId)
  - Cria um registro na tb_comentario para aquele post_id
  - Invalida o cache do post
- Database: MongoDb

## Feature: Usuario consegue ver os comentários de um post

- Cliente: Request Http
- Rota autenticada
- Api: getCommentsByPostId(postId)
  - Faz query pegando as informações do post e os comentarios atrelados aquele PostId
  - retorno: Comments[]
- Banco: MongoDb

## Feature: Usuario consegue ver os comentários de um comentário

- Cliente: Request Http
- Rota autenticada
- Api: getCommentsByCommentaryId(commentaryId)
  - Pega os comentarios no banco pelo commentaryId
  - retorno: Comment[]

## Search-Service

### Feature: Usuario consegue pesquisa outro usuario

- Cliente: request Http
- Rota autenticada
- Api: searchUserByName(name): userId
  - Retorna

## Feed-Service

### Feature: Usuario consegue ver seu feed

- Cliente: Request Http
- Rota autenticada
- Api: getFeed(userId)
  - Pega do cache o feed
  - retorno: Post[]
- Banco: MongoDb

### Feature: Evento de post-deletado

- Kafka-Consumers-deleted-post:

  - Encontram todos os usuarios que seguem o autor do post deletado
  - Envia para o redis-channel a informação de que eles precisam ter seus feeds atualizados

- Redis-channel-consumer-deletion:
  - Redis-channel é consumido deletando o ultimo post do chache do Redis
  - busca no banco de dados o ultimo post do seguidor
  - Adiciona no final da doble-linked-list esse post

### Feature: Evento de post-curtido

- Kafka-Consumers-deleted-post:

  - Encontram todos os usuarios que seguem o autor do post deletado
  - Envia para o redis-channel a informação de que eles precisam ter seus feeds atualizados

- Redis-channel-consumer-deletion:
  - Redis-channel é consumido deletando o ultimo post do chache do Redis
  - busca no banco de dados o ultimo post do seguidor
  - Adiciona no final da doble-linked-list esse post

### Tipos de Retorno

Post: { id, content: string, imageUrl?, videoUrl?, likeNumber, sharesNumber, commentariesNumber, wasLikedByUser: bool, wasSharedByUser: bool, createdAt: Date, userInfo: UserInfo }

Comment: Post

UserInfo: { id: string, profilePictureUrl: string, name: string, bio: string}

## Links

Twitter system design mock interview (https://www.youtube.com/watch?v=3yW856jAbZA)
System Design Twitter (https://www.youtube.com/watch?v=_QqpD0w8oPM)
Twitter System Design (https://www.youtube.com/watch?v=wYk0xPP_P_8)
