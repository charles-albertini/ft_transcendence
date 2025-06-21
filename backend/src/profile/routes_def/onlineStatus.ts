// backend/src/profile/routes_def/onlineStatus.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { User } from '../../db_models/user_model';
import { JWTpayload } from '../../interfaces';

// Simple stockage en mémoire pour les utilisateurs en ligne
// Dans un environnement de production, utiliser Redis ou une base de données
const onlineUsers = new Map<number, Date>();
const ONLINE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

// Fonction utilitaire pour nettoyer les utilisateurs hors ligne
function cleanupOfflineUsers() {
	const now = new Date();
	for (const [userId, lastSeen] of onlineUsers.entries()) {
		if (now.getTime() - lastSeen.getTime() > ONLINE_TIMEOUT) {
			onlineUsers.delete(userId);
		}
	}
}

// Route pour marquer un utilisateur comme en ligne (heartbeat)
export async function updateOnlineStatus(request: FastifyRequest, reply: FastifyReply) {
	try {
		const payload = request.user as JWTpayload;
		const user = await User.findByPk(payload.user_id);
		if (!user) {
			return reply.code(404).send({ error: 'User not found' });
		}

		// Marquer l'utilisateur comme en ligne
		onlineUsers.set(user.user_id, new Date());
		
		// Nettoyer les utilisateurs hors ligne
		cleanupOfflineUsers();

		return reply.code(200).send({ 
			message: 'Online status updated',
			timestamp: new Date()
		});
	}
	catch (error) {
		console.error('Error updating online status:', error);
		return reply.code(500).send({ error: 'Internal server error' });
	}
}

// Route pour obtenir le statut en ligne d'un utilisateur
export async function getUserOnlineStatus(request: FastifyRequest<{ Params: { username: string } }>, reply: FastifyReply) {
	try {
		const username = request.params.username;
		const user = await User.findOne({ where: { username } });
		
		if (!user) {
			return reply.code(404).send({ error: 'User not found' });
		}

		// Nettoyer les utilisateurs hors ligne
		cleanupOfflineUsers();

		const isOnline = onlineUsers.has(user.user_id);
		const lastSeen = onlineUsers.get(user.user_id);

		return reply.code(200).send({
			username: user.username,
			isOnline,
			lastSeen: lastSeen || null
		});
	}
	catch (error) {
		console.error('Error getting user online status:', error);
		return reply.code(500).send({ error: 'Internal server error' });
	}
}

// Route pour obtenir le statut en ligne de plusieurs utilisateurs
export async function getMultipleUsersOnlineStatus(request: FastifyRequest<{ Body: { usernames: string[] } }>, reply: FastifyReply) {
	try {
		const { usernames } = request.body;
		
		if (!Array.isArray(usernames) || usernames.length === 0) {
			return reply.code(400).send({ error: 'Invalid usernames array' });
		}

		// Nettoyer les utilisateurs hors ligne
		cleanupOfflineUsers();

		const users = await User.findAll({
			where: { username: usernames },
			attributes: ['user_id', 'username']
		});

		const statuses: Record<string, boolean> = {};
		users.forEach(user => {
			statuses[user.username] = onlineUsers.has(user.user_id);
		});

		// Ajouter false pour les utilisateurs non trouvés
		usernames.forEach(username => {
			if (!(username in statuses)) {
				statuses[username] = false;
			}
		});

		return reply.code(200).send({
			statuses,
			timestamp: new Date()
		});
	}
	catch (error) {
		console.error('Error getting multiple users online status:', error);
		return reply.code(500).send({ error: 'Internal server error' });
	}
}

// Route pour marquer un utilisateur comme hors ligne
export async function setOfflineStatus(request: FastifyRequest, reply: FastifyReply) {
	try {
		const payload = request.user as JWTpayload;
		const user = await User.findByPk(payload.user_id);
		if (!user) {
			return reply.code(404).send({ error: 'User not found' });
		}

		// Retirer l'utilisateur de la liste des utilisateurs en ligne
		onlineUsers.delete(user.user_id);

		return reply.code(200).send({ 
			message: 'User marked as offline',
			timestamp: new Date()
		});
	}
	catch (error) {
		console.error('Error setting offline status:', error);
		return reply.code(500).send({ error: 'Internal server error' });
	}
}