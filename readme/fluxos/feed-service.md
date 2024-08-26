# Feed-Service

## Requirements

- Usuario consegue visualizar feed
  - Feed do usuario mostra ultimos posts por odem de postagem dos perfis seguidos
  - Feed atualiza em tempo real para usuario ativos

### Usuario consegue visualizar feed

- Client: Http
- Rota autenticada com login
- getFeed(userId, startTimestamp)
  - Verifica se existe um feed pronto no cache
  - Se não bate no follow-service para pegar os usuario seguidos
  - Pega os posts dos usuario seguidos em ordem decrescente apartir do timestamp

### Constroi o feed async

- makeFeed(userId)

  - Bate no Follow-Serivice para pegar os usuarios seguidos
  - Pega os ultimos 20 posts no Tweet-Service desses usuarios seguidos
  - Pega os dados dos usuarios do post no Client-Service
  - Salva o feed no cache por user Id
  - Envia para o front-end a informação do novo post se o usuario estiver ativo

- Nota: Essa função pode receber 10 milhões requisições para serem executada, se um usuario muito grande postar algo

Soluções: - Ir construindo ao poucos o feed - Priorizar usuario ativos no chamada da função

addToFeed(tweetId, userId)

-

tweetCreated(tweetId, userId)

- Pega todos os followers desse usuário
- Manda para o redis-channel para rodar o addToFeed para esses usuarios

## Eventos Sub

- Evento de Tweet Criado e Deletado: Chama o makeFeed para todos os seguidores do usuario postador
- Evento de Follow Realizado: Invalida o cache do usuario seguidor
- Evento de Usuario Editado: Invalida o cache de todos os usuarios que tinha posts desse usuario editado
