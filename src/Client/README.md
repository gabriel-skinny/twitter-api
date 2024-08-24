# Cliente-Service Fluxos

## Cadastro:

- Usuario consegue se cadastrar
- Usuario recebe código de validação de email
- Usuario consegue pedir reenvio da validação de email
- Usuario consegue trocar o email de confirmação
- Usuario consegue validar seu email com código e ter sua conta criada

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
- Api: updatePreUserEmail(userId, newEmail)
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
- Api: resendValidationCode(email, operationToValidateType)
  - Verifica se no cache existe um registro de validação de email com um código
  - Caso sim:
    - Envia um email com ele
  - Caso não:
    - Cria um novo registro de Validação de email
    - Envia um email com ele
- Cache: Redis

## Login Requirements:

- Usuario consegue logar
- Usuario consegue deslogar
- Usuario consegue deslogar todas as suas sessões

### Feature: Login

- Cliente: Request HTTP
- Api: login(email, password): token
  - Verifica se esse email está cadastrado
  - Verifica senha passada
  - Cria registro de sessão para usuario
  - Retorna token JWT de acesso
- Cache: Redis

### Feature: Usuario consegue recuperar sua senha esquecida

- Cliente: Request HTTP
- Rota: Autenticada
- Api: forgotPassword(userEmail)
  - Verifica se o usuario existe
  - Chama a função de validação de email com o tipo password_change
- Api: createCode():
- Api: validateCode(): jwtPassword
  Rota autenticada com JWT password_change
- Api: updatePassword(userId, newPassword)
  - Verifica se usuario existe
  - Atualiza a sua senha

### Feature: Usuario consegue fazer logout

- Cliente: Request HTTP
- Rota: Autenticada
- Api: logout(userId, ip)

  - Verifica se usuario existe
  - Verifica se a sessão existe
  - Atualiza sessão para ativo false
  - Envia evento de logout com essa sessão

- Autenticação:

  - Verifica se o token jwt de login é de um usuario que está com a sessão ativa

- FrontEnd:
- Deleta token jwt e joga o usuario para a tela de login

### Feature: Usuario consegue deslogar todas as suas sessões

- Cliente: Request HTTP
- Rota: Autenticada
- Api: logoutAllOtherSessions(userId, actualIp)

  - Desativa todas as sessões daquele usuario que são diferentes de seu ip

- Cliente: Verifica se
- Api: getActiveUserSession(userId, ip): UserSession

## User

- Usuario consegue ver seu perfil
- Usuario consegue listar outros perfis
- Usuario consegue editar dados de perfil
- Usuario consegue editar a senha quando esquecida
- Usuario consegue deletar seu perfil

### Feature: Preencher dados de perfil

- Cliente: Request HTTP
- Rota: Autenticada
- Api: uploadMedia(media, mediaName, mediaType): s3Url
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
