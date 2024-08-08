# Twiter-Api

Tentativa de recriar uma api com a maioria das funcionalidades do twitter e que seja escalável.

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

- Usuario consegue se cadastrar
- Usuario consegue logar
- Usuario precisa validar seu email
- Usuario consegue preencher seus dados de perfil

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

## Cliente-Service

### Feature: Usuario consegue criar sua conta

- Cliente: request Http
- Api: createAccount(name, email, password, mediaId)
  - Verifica se já existe usuarios com esse email
  - Cria registro de usuario no banco como inativo
  - Envia email para o email cadastrado com o código de validação
- Banco: MongoDb

### Feature: Confirmação de email

- Cliente: Request HTTP
- Api: validateAccount(userId, digit): bool
  - Verifica a validade do código
- Banco: MongoDb

### Feature: Login

- Cliente: Request HTTP
- Api: login(email, password): token
  - Verifica senha e email do usuario
  - Retorna token JWT de acesso

### Feature: Preencher dados de perfil

- Cliente: Request HTTP
- Rota: Autenticada
- Api: uploadMedia(userId, media): s3Url
  - Baixa foto na S3
  - Deixa disponivel no CDN
- Api: registerUserInfo(bannerPictureS3Url, profilePictureS3Url, bio, location, website, birthDate, profileName)

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
