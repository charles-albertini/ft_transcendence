import fp from 'fastify-plugin';
import { SaveMatch } from '../routes_def/save_match';

export default fp(async function routes_match(fastify: any) {
	fastify.post('/match/save', { preHandler: fastify.authenticate }, SaveMatch);
});



