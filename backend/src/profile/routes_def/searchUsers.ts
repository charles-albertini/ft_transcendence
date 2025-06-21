// backend/src/profile/routes_def/searchUsers.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { User } from '../../db_models/user_model';
import { JWTpayload } from '../../interfaces';
import { Op } from 'sequelize';

export async function searchUsers(request: FastifyRequest<{ Querystring: { q: string } }>, reply: FastifyReply) {
	console.log('🔍 === DEBUT SEARCH USERS ===');
	console.log('🔍 Headers:', request.headers);
	console.log('🔍 Query params:', request.query);
	
	try {
		// Vérifier que l'utilisateur est authentifié
		if (!request.user) {
			console.log('❌ Pas d\'utilisateur authentifié');
			return reply.code(401).send({ error: 'Non authentifié' });
		}
		
		const payload = request.user as JWTpayload;
		console.log('🔍 User ID du token:', payload.user_id);
		
		// Récupérer l'utilisateur actuel
		const currentUser = await User.findByPk(payload.user_id);
		if (!currentUser) {
			console.log('❌ Utilisateur courant non trouvé dans la DB');
			return reply.code(404).send({ error: 'Utilisateur non trouvé' });
		}
		
		console.log('✅ Utilisateur courant trouvé:', currentUser.username);

		// Vérifier le paramètre de recherche
		const query = request.query?.q;
		if (!query || typeof query !== 'string' || query.trim().length < 1) {
			console.log('❌ Query invalide:', query);
			return reply.code(400).send({ error: 'Paramètre de recherche invalide' });
		}

		console.log('🔍 Recherche pour le terme:', query.trim());

		// Recherche dans la base de données
		const users = await User.findAll({
			where: {
				username: {
					[Op.iLike]: `%${query.trim()}%`
				},
				user_id: {
					[Op.ne]: currentUser.user_id
				}
			},
			attributes: ['username', 'number_of_matches', 'number_of_win', 'number_of_lose', 'avatar'],
			limit: 10,
			order: [['username', 'ASC']]
		});

		console.log('✅ Nombre d\'utilisateurs trouvés:', users.length);
		console.log('✅ Utilisateurs:', users.map(u => ({ username: u.username, matches: u.number_of_matches })));

		// Formater la réponse
		const formattedUsers = users.map(user => {
			const matches = user.number_of_matches || 0;
			const wins = user.number_of_win || 0;
			
			return {
				username: user.username,
				number_of_matches: matches,
				number_of_win: wins,
				ratio: matches > 0 ? wins / matches : 0,
				avatar: user.avatar || null
			};
		});

		console.log('✅ Réponse formatée envoyée');

		return reply.code(200).send({
			query: query.trim(),
			count: formattedUsers.length,
			users: formattedUsers
		});

	} catch (error) {
	const err = error as Error;

	console.error('❌ ERREUR DANS SEARCH USERS:');
	console.error('❌ Message:', err.message);
	console.error('❌ Stack:', err.stack);
	console.error('❌ Error complète:', err);
	
	return reply.code(500).send({ 
		error: 'Erreur interne du serveur',
		details: err.message
	});
}
}