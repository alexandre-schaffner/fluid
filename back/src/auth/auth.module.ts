import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { VerifyJwtGuard } from 'src/guards/verify-jwt.guard';
import { YoutubeModule } from 'src/youtube/youtube.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
    }),
    YoutubeModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, VerifyJwtGuard],
})
export class AuthModule {}
