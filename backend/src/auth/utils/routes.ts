// import every route from the routes_def folder
import fp from 'fastify-plugin';
import { sign_in } from '../routes_def/sign_in';
import { sign_up } from '../routes_def/sign_up';
import { enable2FA } from '../routes_def/enable2FA';
import { check2FA } from '../routes_def/check2FA';
import { disable2FA } from '../routes_def/disable2FA';
import { refreshToken } from '../routes_def/refreshToken';

export default fp(async function routes_auth(fastify: any) {
	fastify.post('/auth', sign_in);
	fastify.post('/auth/register', sign_up);
	fastify.post('/auth/refreshtoken', { preHandler: fastify.authenticate }, refreshToken);
	fastify.get('/auth/enable2FA', { preHandler: fastify.authenticate }, enable2FA);
	fastify.post('/auth/check2FA', { preHandler: fastify.authenticate }, check2FA);
	fastify.post('/auth/disable2FA', { preHandler: fastify.authenticate }, disable2FA);
});