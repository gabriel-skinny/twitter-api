import { HttpStatus } from "@nestjs/common";

export interface BaseControllerMethodInterface<T = void> { message: string; statusCode: HttpStatus; data?: T}