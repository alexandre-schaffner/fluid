/*
| Developed by Fluid
| Filename : app.controller.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { AppService } from './app.service';
import { MeDto } from './contracts/Me.dto';
import { SyncStatusDto } from './contracts/SyncStatus.dto';
import { VerifyJwtGuard } from './guards/verify-jwt.guard';

/*
|--------------------------------------------------------------------------
| App Controller
|--------------------------------------------------------------------------
*/

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Health check
  //--------------------------------------------------------------------------
  @Get('/health')
  async getHealth() {
    return { status: 'ok' };
  }

  // Get user data
  //--------------------------------------------------------------------------
  @UseGuards(VerifyJwtGuard)
  @Get('/me')
  async getMe(@Req() req: FastifyRequest): Promise<MeDto> {
    if (!req.user) throw new Error('User not found');

    return await this.appService.getMe(req.user.sub);
  }

  // Enable / disable syncing between YouTube and the streaming platform
  //--------------------------------------------------------------------------
  @UseGuards(VerifyJwtGuard)
  @Patch('/sync/status')
  async sync(@Req() req: FastifyRequest, @Body() body: SyncStatusDto) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (body.sync) return await this.appService.enableSync(req.user!.sub);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return await this.appService.disableSync(req.user!.sub);
  }
}
