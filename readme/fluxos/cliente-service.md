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
  - Verifica se o usuario existe
  - Chama a função de validação de email com o tipo password_change
- Api: createCode():
- Api: validateCode(): jwtPassword
  Rota autenticada com JWT password_change
- Api: updatePassword(userId, newPassword)
  - Verifica se usuario existe
  - Atualiza a sua senha
  - Apaga todas as sessões atreladas aquele usuario

### Feature: Usuario consegue fazer logout

- Cliente: Request HTTP
- Rota: Autenticada
- Api: logout(userId)
  - Verifica se usuario existe
  - Verifica se a sessão existe
  - Atualiza sessão para ativo false
