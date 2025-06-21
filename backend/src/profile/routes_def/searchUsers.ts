// backend/src/profile/routes_def/searchUsers.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { User } from '../../db_models/user_model';
import { JWTpayload } from '../../interfaces';
import { Op } from 'sequelize';

export async function searchUsers(request: FastifyRequest<{ Querystring: { q: string } }>, reply: FastifyReply) {
	try {
		const payload = request.user as JWTpayload;
		const currentUser = await User.findByPk(payload.user_id);
		if (!currentUser) {
			return reply.code(404).send({ error: 'User not found'})
		}

		const query = request.query.q;
		if (!query || query.trim().length < 2) {
			return reply.code(400).send({ error: 'Query must be at least 2 characters long' });
		}

		// Rechercher des utilisateurs par nom d'utilisateur (exclure l'utilisateur actuel)
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

		const formattedUsers = users.map(user => ({
			username: user.username,
			number_of_matches: user.number_of_matches,
			ratio: user.number_of_matches > 0 ? user.number_of_win / user.number_of_matches : 0,
			avatar: user.avatar
		}));

		return reply.code(200).send({
			query: query,
			count: formattedUsers.length,
			users: formattedUsers
		});
	}
	catch (error) {
		console.error('Error searching users:', error);
		return reply.code(500).send({ error: 'Internal server error'})
	}
}