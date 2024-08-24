# Profile-Service

## Requirements

- Usuario consegue ver seu perfil
- Usuario consegue ver seus posts e compartilhamentos
- Usuario consegue ver seus comentários a outros posts
- Usuario consegue ver seus posts curtidos

### Usuario consegue ver seu perfil

- Client: Http
- Rota autenticada para login
- getProfileInfo(userId)
  - Bate no serviço de Cliente para pegar informações do usuario
  - Bate no Follow-Service para pegar informações dos seguidores e dos usuarios seguidos
- retorno: { username: string; profilename: string; profilePictureUrl?; bannerPictureUrl?; bio?; location?; postNumber; userCreatedAt; followNumber; followeeNumber; }

### Usuario consegue ver seus posts e compartilhamentos

- Client: Http
- Rota autenticada para login
- getPostsProfile(actualUserId, requestUserId, page, perPage)

  - Bate no Tweet-Service para pegar os posts e compartilhamentos do usuario
  - Bate no Client-Service para pegar os dados dos usuarios do post, e do post compartilhado se for do tipo Share
  - retorno: { username; profilename; profilePictureUrl; postCreatedAt; content; mediaUrl?; likeNumber; shareNumber; commentNumber; wasLikedByUser; wasSharedByUser; parentPostInfoWithClient?;}[]
  - Salvar no cache os posts

### Usuario consegue ver seus comentários a outros posts

- Client: Http
- Rota autenticada para login
- getCommentsProfile(actualUserId, requestUserId, page, perPage)
  - Bate no Tweet-Service para pegar comentários
  - Bate no Client-Service para pegar os dados dos usuarios do comentário, do post comentado, e do post de referencia se existir
  - retorno: { postCreatorReference?: PostInfoWithProfile; parentTweet: PostInfoWithProfile; PostInfoWithProfile}[]
  - Salvar no cache os posts

### Usuario consegue ver seus comentários a outros posts

- Client: Http
- Rota autenticada para login
- getLikedPostsProfile(actualUserId, requestUserId, page, perPage)
  - Bate no Tweet-Service para pegar os posts e compartilhamentos curtidos
  - Bate no Client-Service para pegar os dados dos usuarios dos posts, e se for um tipo diferente de Post, pega também desse usuario
  - retorno: { parentTweet?: PostInfoWithProfile; PostInfoWithProfile}[]
  - Salvar no cache os posts

## Eventos Sub

- Evento de Tweet Criado, Deletado, Editado, Curtido, Compartilhado, Comentado:
  - Invalida o cache
- Evento de Follow Realizado:
  - Atualiza o followNumber e followeeNumbe dos respectivos usuarios
  - Invalida seu cache
- Evento de Usuario Editado: Invalida seu cache

### Database:

- userId
- postsNumber
- followNumber
- followeeNumber
