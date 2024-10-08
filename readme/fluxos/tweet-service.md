# Requirements - Tweet-Service:

- Usuario consegue fazer um tweet
- Usuario consegue deletar um tweet
- Usuario consegue curtir um tweet
- Usuario consegue descurtir um tweet
- Usuario consegue ver os seus tweets

- Usuario consegue compartilhar um tweet
- Usuario consegue descompartilhar um tweet
- Usuario consegue curtir e descurtir um compartilhamento
- Usuario consegue comentar e descomentar em um compartilhamento
- Usuario consegue ver seus compartilhamentos

- Usuario consegue comentar um tweet
- Usuario consegue apagar o comentário de um tweet
- Usuario consegue curtir e descurtir um comentário
- Usuario consegue compartilhas e descompartilhar um comentário
- Usuario consegue ver comentários de um tweet
- Usuario consegue ver comentários de um comentário

## Rotas para outros serviços

- Rota para listar posts de usuarios
- Rota para listar post e compartilhamentos de um usuario

## Tweet-Service

## Feature: Usuario consegue fazer um Tweet

- Cliente: Request Http
- Rota autenticada
- Api: media(userId)
  - Salva media no S3
  - Deixa disponivel no CDN
- Api: makePost(userId, textContent, media)
  - Salva o post no database
  - Salva o post no cache do redis como uma list ligada de posts do usuario. Key: tweets-user-id
  - Envia um evento para o Kafka de criação de Post
- Banco: MongoDb

## Feature: Usuario consegue deletar os seus Tweets

- Cliente: Request Http
- Rota autenticada
- Api: deletePost(userId, TweetId)
  - Verifica se o post existe
  - Deleta o post do database
  - Manda um evento para o Kafka de deleção de Post

## Feature: Usuario consegue curtir um post

- Cliente: Request Http
- Rota autenticada
- Api: likePost(requesterUserId, postId)
  - Verifica se o post Existe
  - Verifica se esse usuario já deu like nesse Post
  - Atualiza o post_id adicionando um id no array de likes
  - Envia um evento ao Kafka de post-curtido

Suposição:

- Um post pode chegar a ter 1m de likes
- Um post tem em media 10k de likes

## Feature: Usuario consegue descurtir um post

- Cliente: Request Http
- Rota autenticada
- Api: unlikePost(userId, postId)
  - Atualiza o post_id removendo o id do usuario do array de ids
  - Envia um evento ao Kafka de post-ulinked

Suposição:

- Um post pode chegar a ter 1m de likes
- Um post tem em media 10k de likes

## Feature: Usuario consegue ver seus posts

- Cliente: Request Http
- Rota autenticada
- Api: getPosts(userId, page, perPage, order)
  - Pega os posts do usuario do banco
  - Conta os likes, compartilhamentos e comentarios
  - Retorno: [{content: string; media?: string; likeNumber: number; shareNumber: number; commentNumber: number;}]
  - Salvar requisição para esse userId no cache do HTTP

## Feature: Usuario compartilhar um post

- Cliente: Request Http
- Rota autenticada
- Api: sharePost(userId, postId, shareContent)
  - Verifica se o post existe
  - Verifica se o usuario já não compartilhou esse post
  - Cria um registro tb_share com o post_id
  - Envia evento de post compartilhado ao Kafka
- Database: MongoDb

## Feature: Usuario descompartilhar um post

- Cliente: Request Http
- Rota autenticada
- Api: unsharePost(userId, postId)
  - Delete registro de compartilhamento
  - Envia evento de post descompartilhado ao Kafka
- Database: MongoDb

## Feature: Usuario consegue ver seus compartilhamentos

- Cliente: Request Http
- Rota autenticada
- Api: getPosts(userId, page, perPage)
  - Pega os ultimos compartilhamentos do usuario do banco
  - Lista junto com os Posts ou Comentarios relacionados ao compartilhamento
    - Retorno: [{content: string; media?: string; likeNumber: number; shareNumber: number; commentNumber: number; postReferece: Post}]
  - Salvar requisição para esse userId no cache do HTTP
- Database: MongoDb

## Feature : Usuario consegue fazer um comentário

- Cliente: Request Http
- Rota autenticada
- Api: likePost(userId, postId)
  - Cria um registro na tb_comentario para aquele post_id
  - Invalida o cache do post
- Database: MongoDb

## Feature: Usuario consegue ver os comentários de um tweet

- Cliente: Request Http
- Rota autenticada
- Api: getCommentsByParenttId(parentId, page, perPage)
  - Faz query pegando as informações do post e os comentarios atrelados àquele PostId
  - Pega os likes, comentarios e compartilhamentos
  - Retorna com a informação do tweet relacionado ao ParentId e ao creatorReferenceId
  - retorno: CommentsInfo[]
- Banco: MongoDb

## Feature: Usuario consegue ver os comentários de um comentário

- Cliente: Request Http
- Rota autenticada
- Api: getCommentsByParenttId(commentaryId)
  - Pega os comentarios no banco pelo commentaryId
  - retorno: Comment[]

## Feature: Usuario consegue ver todos os seus comentários

- Cliente: Request Http
- Rota autenticada
- Api: getCommentsByUser(userId)
  - Pega os comentarios no banco pelo userId
  - Pega o parent
  - Se o creator reference for diferente do parent retorna não o retorna
  - retorno: {CommentInfo, parentTweetInfo: TweetInfo; creatorReferenceTweetInfo?: TweetInfo}[]

## Feature: Rota para listar posts de usuarios

- Cliente: Request Http
- Rota autenticada
- Api: getPostsByUserIds(userIds: string[], startTimeStamp: Date, perPage: number)
