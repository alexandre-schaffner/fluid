import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthJwt } from 'src/contracts/AuthJwt';
import { GoogleJwt } from 'src/contracts/GoogleJwt';

declare module 'fastify' {
  interface FastifyRequest {
    googleJwt?: GoogleJwt;
    user?: AuthJwt;
  }
}
