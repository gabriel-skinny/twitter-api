# Estudo - Design - System

Features

- 1 Tweet Post
- User Feed
- User following

### High-level assumptions:

- Leitura é mais importante que a escrita. Relação de 1 para 10
- Ter uma consistencia eventual, já que não é tão importante. Os tweets podem demorar mais de 10 ou 30 segundos para chegar para todos os seguidores
- A leitura é sempre dos tweets mais recentes
- O histórico de tweets precisam existir, mas esses não vão aparecer no feed, ficarão para serem pesquisados.

### Metricas:

- 20Kb tweet (text e video)
- 1B Usuarios, 200M usuarios ativos, 100M Postam todos os dias
- Usuarios tem em media 200 seguidores

- Armazenamento por Dia-> 100M \* 20Kb -> 10Tb/Day
- Requisição de Criação por Segundo: 100M/86000 -> 1200 Req/Sec
- Propagção de Tweet -> 1200-6000 \*

### Api:

- Post tweets(userId, content, media)
- Post media

- POST/DELETE users/user_id/follow

- GET timelines (userId, page, page.size)
- GET timelines/users/{user_id} (page, page.size)

High-Level Components

- Tweet-Service: Responsável para postar um tweet
- User-Graph: Responsável por manter as conexões dos usuarios
- Timeline-Service: Gera a timeline e serve aos usuários

Database:

Tweet:

- id
- userId
- content
- created_at

user_relation

- follower_user_id
- followee_user_id

### WorkFlows:

#### Tweet-Service

- Salvar no Database Cassandra
- Redis para salvar em cache
- Asset-Service: Para resolver a medias
- Url Shortener: Para resolver os links dos posts
- Object Storage para salvar as imagens
- CDN para disponibilizas as imagens
- Kafka: Usuario posta e recebe sucess, enquanto o Kafa processa a mensagem

- Usuario envia requisição para criar um tweet
- Salvamos a media no storage
- Salvamos no database cassandra
- Salvamos no redis
- Se acontecer algum erro ao salvar no cache nos tratamos assincronamente
- Enviamos o evento para o Kafka
- Retornamos para o usuario

##### Timeline-service

- Timeline-processor: Le as mensagens do Kafa e atualiza as timeslines dos usuarios
- Redis: Retorna as timelines instantaneamente cacheada
- Tweet-service: Para usuarios não ativos que não tem uma time-line cacheada.

- Escuta o evento do Kafka de criação de tweet
- Cluster de consumers que procura todos os seguidores do autor do tweet
- Cria uma tupla por seguidor com os seguintes dados { tweetId, followerUserId }
- Envia a tupla para um canal do Redis
- O serviço consome o canal de Redis e salva a timeLine no cache por userId
- Timeline no cache do redis { userId: timeline(double-linkedlist)}. Pois a doublie-linkedlist permite uma inserção rapida e uma remoção

#### User-Graph-Service

- K/V database para guardar a relação dos usuarios

## Conceitos para estudar

- Api Gateway e Load Balancer
