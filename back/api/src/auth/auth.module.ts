import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { VerifyJwtGuard } from 'src/guards/verify-jwt.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, VerifyJwtGuard],
  exports: [VerifyJwtGuard],
})
export class AuthModule {}
