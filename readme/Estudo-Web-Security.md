# Estudo-Authroization

## HTTPS

## Encriptação

Definição: É a pratica de técnicas em vista uma comunicação segura e privada entre dois agentes.

Hash function: Uma função que mapea para certos valores outros valores segundo um algoritmo especifico.
Salt: string unica da aplicação que é adicionada no valor que desejamos encriptar para formar um hash unico de todos os valores para a nossa aplicação.

- SHA1: Solução de Hash function descontinuada
- SHA256 e SHA512: Solução de hash function mais usado atualmente
- SHA3: Mais novo algoritimo de encriptação.
- MD5: Não é tão usado para criptografia de dados por ter algumas falhas, porém tem alguns outros usos em que ainda é utilizado, pois precisa de menos processamento do que funções hash SHA.

- Bcrypt:
  - O mais lento de todos. Isso é bom pois o hacker demora mais tempo para criar um dicionário de senhas possiveis.
  - Usado para pequenas quantidades de dados.
  - Muitos usado para senhas
