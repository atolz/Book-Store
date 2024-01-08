/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES } from './role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userRole = request?.user.role;
    const roles: string[] = this.reflector.get(ROLES, context.getHandler());

    // console.log('user is', request?.user, roles);
    if (roles.includes(userRole)) {
      return true;
    }
    throw new ForbiddenException(`Only ${roles}, can perform this action`);
  }
}
