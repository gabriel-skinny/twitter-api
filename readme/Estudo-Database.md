# Estudo-Database

Database: É simplesmente um lugar onde se persiste dados. Em sua forma mais básica é um txt que persiste uma serie de bytes em um HD. As diferentes implementações de databases só alteram o modo como esses dados são armazenados e definem meios para ler, modificar, deletar.

Database Management System: Um software que fornece as ferramentas para criar, controlar e acessar um banco de dados

## Tipos de database

Databse Hierarquico:

Database NetWork:

## Database Relacional

Definição: Organiza os dados em tabelas, estrutura de dados que possui um nome, que representa sua entidade, e uma especificação dos tipo dados. Cada linha da tabela será o conteúdo dos seus dados, que seguem o tipo definido da tabela. E uma tabela pode ter um campo que se referencia a outra tabela, chamado foreing key, podendo manipular dados de mais de uma tabela de uma vez.

Uso de um database relacional: Para guardar dados que sejam fixos, regulares e previsiveis.

Beneficios:

- Garante consistência de Dados
- Tem um sistema de locking que lida com Duplicidade de dados
- Possui uma forma estruturada de acessar os dados

SQL: Linguagem criada para consultar banco de dados relacionais

Database Managment System para banco de dados relacionais: MYSQL, MariaDB, PostgresSQL, Microsoft SQL Server

### Nosql

Definição: Não é realmente NOSQL, mas sim uma alternativa ao armazenamento relacional.

Beneficios:

- Fornece queries rápidas
- Deixa os dados continuamente disponiveis
- Escala horizontalmente

#### Nosql Key e Value:

- Definição: Armazena os dados em forma de chave e valor, em que a chave é uma nome e o valor pode ser qualquer byte de dados. Qualquer chave e valor pode ser inserido quando quiser, o database não valida isso, o usuario precisa faze-lo se quer manter consistencia de dados.
- Beneficio:

  - É muito util para ser como uma solução bem leve para guardar valores simples que precisam ser manipulados quando consultado.

- Exemplos: Redis, memchached, etcd.
- Uso: Muito usado para guardar configurações.

Document Database:

- Definição: Possui uma semantica parecida com os database de key e value, pois tem uma key que representa o nome do database, mas o value é um estrutura de dados organizada chamada documento, podendo estar no formatado de um JSON, BSON ou XML. Ele está no meio entre a liberdade do key e value e a organização do relacional, pois ele permite uma flexibilidade na inserção de novos dados e os organiza em uma estrutura suficientemente organizada para que seja possivel fazer queries e operar neles.

- Exemplos: MongoDb, RethinkDb
- Uso: Dados que não possuem uma relação muito grande e que não são muito estruturados, e que podem ser alterados a qualquer momento.

## Links-usados

Comparing-database-types(https://www.prisma.io/dataguide/intro/comparing-database-types)
