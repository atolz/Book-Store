/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';

export const ROLES = 'roles';
export const AllowRoles = (...roles: string[]) => SetMetadata(ROLES, roles);
