import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string>(
      'role',
      context.getHandler(),
    );
    if (!requiredRole) {
      return true; // Jika tidak ada role yang disyaratkan, semua bisa akses
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user && user.role === requiredRole; // Cek apakah role user sesuai
  }
}
