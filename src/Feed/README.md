# Feed-Service

## Requirements

- Usuario consegue visualizar feed
  - Feed do usuario mostra ultimos posts por odem de postagem dos perfis seguidos
  - Feed atualiza em tempo real para usuario ativos

### Usuario consegue visualizar feed

- Client: Http
- Rota autenticada com login
- getFeed(userId, page, perPage)

  - Verifica se existe um feed pronto no cache

### Constroi o feed async

- makeFeed(userId)

  - Bate no Follow-Serivice para pegar os usuarios seguidos
  - Pega os ultimos 20 posts no Tweet-Service desses usuarios seguidos
  - Pega os dados dos usuarios do post no Client-Service
  - Salva o feed no cache por user Id

- Nota: Essa função pode receber 10 milhões requisições para serem executada, se um usuario muito grande postar algo

Soluções: - Ir construindo ao poucos o feed - Priorizar usuario ativos no chamada da função

## Eventos Sub

- Evento de Tweet Criado e Deletado: Chama o makeFeed para todos os seguidores do usuario postador
- Evento de Follow Realizado: Invalida o cache do usuario seguidor
- Evento de Usuario Editado: Invalida o cache de todos os usuarios que tinha posts desse usuario editado
