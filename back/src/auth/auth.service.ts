import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { googleJwt } from 'src/contracts/googleJwt';
import { MissingDataError } from 'src/Errors/MissingData.error';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async googleSignIn(credential: googleJwt) {
    if (!credential.email || !credential.given_name)
      throw new MissingDataError();

    return await this.prismaService.user.upsert({
      create: {
        email: credential.email,
        name: credential.given_name,
      },
      update: {},
      where: {
        email: credential.email,
      },
    });
  }
}
