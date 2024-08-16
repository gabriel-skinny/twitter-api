import { Reflector } from '@nestjs/core';
import { TokenTypeEnum } from 'src/Client/application/services/AuthService';

export const AuthenticationTypeDecoretor =
  Reflector.createDecorator<TokenTypeEnum>();

export const IsPublicDecoretor = Reflector.createDecorator();
