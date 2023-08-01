import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { MeDto } from './contracts/Me.dto';
import { VerifyJwtGuard } from './guards/verify-jwt.guard';
import { FastifyRequest } from 'fastify';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  async getHealth() {
    return { status: 'ok' };
  }

  @UseGuards(VerifyJwtGuard)
  @Get('/me')
  async getMe(@Req() req: FastifyRequest): Promise<MeDto> {
    if (!req.user) throw new Error('User not found');

    return await this.appService.getMe(req.user.sub);
  }
}
