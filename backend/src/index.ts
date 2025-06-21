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

// 🆕 Fonction pour configurer les associations
const setupAssociations = () => {
	try {
		console.log('🔗 Setting up model associations...');
		
		// Importer les modèles
		const { User } = require('./db_models/user_model');
		const { Friendship } = require('./db_models/friendship_model');
		
		// Configurer les associations Friendship <-> User
		Friendship.belongsTo(User, {
			foreignKey: 'user_id1',
			as: 'sender'
		});
		
		Friendship.belongsTo(User, {
			foreignKey: 'user_id2', 
			as: 'receiver'
		});
		
		// Associations inverses (optionnelles mais utiles)
		User.hasMany(Friendship, {
			foreignKey: 'user_id1',
			as: 'receivedRequests'
		});
		
		User.hasMany(Friendship, {
			foreignKey: 'user_id2',
			as: 'sentRequests'
		});
		
		console.log('✅ Model associations configured successfully');
	} catch (error) {
		console.error('❌ Error setting up associations:', error);
	}
};

const start = async () => {
	try {
		await testConnection(5, 3000);

		console.log('🔄 Synchronizing database...');
		await syncDatabase(3, 2000); // 3 retries, 2 second delay

		// 🆕 Configurer les associations APRÈS la synchronisation
		setupAssociations();

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