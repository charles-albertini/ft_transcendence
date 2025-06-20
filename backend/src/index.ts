import Fastify, { FastifyInstance } from 'fastify'
import { testConnection } from './def';
import { syncDatabase } from './db_models/syncDatabase';
import auth_plugins from './plugins/auth_plugins';
import google_oauth from './plugins/google_oauth';
import routes_auth from './auth/utils/routes';
import routes_profile from './profile/utils/routes';

const fastify: FastifyInstance = Fastify({ logger: true })

fastify.register(google_oauth);
fastify.register(auth_plugins);
fastify.register(routes_auth);
fastify.register(routes_profile);

const start = async () => {
	try {
		await testConnection(5, 3000);

		console.log('🔄 Synchronizing database...');
		await syncDatabase(3, 2000); // 3 retries, 2 second delay

		console.log('🚀 Starting Fastify server...');

		await fastify.listen({ port: 8002, host: '0.0.0.0' });
		console.log('✅ Server is running on port 8002');
	}
	catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

start();