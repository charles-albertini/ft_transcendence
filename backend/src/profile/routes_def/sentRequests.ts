// backend/src/profile/routes_def/sentRequests.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { User } from '../../db_models/user_model';
import { JWTpayload } from '../../interfaces';
import { Friendship } from '../../db_models/friendship_model';

export async function sentRequests(request: FastifyRequest, reply: FastifyReply) {
	try {
		const payload = request.user as JWTpayload;
		const user = await User.findByPk(payload.user_id);
		if (!user) {
			return reply.code(404).send({ error: 'User not found'})
		}

		const sentRequests = await Friendship.findAll({
			where: {
				user_id2: user.user_id,
				status: 'pending'
			},
			include: [
				{
					model: User,
					as: 'sender',
					attributes: [ 'username' ]
				}
			],
			order: [['creation_date', 'DESC']]
		});

		if (!sentRequests || sentRequests.length === 0) {
			return reply.code(200).send({ 
				message: 'No sent friend requests',
				sent_requests: []
			});
		}
		
		const formattedRequests = sentRequests.map(request => ({
			friendship_id: request.friendship_id,
			receiver: { username: (request as any).sender.username },
			creation_date: request.creation_date,
			status: request.status
		}));

		return reply.code(200).send({
			total_sent: formattedRequests.length,
			sent_requests: formattedRequests
		});
	}
	catch (error) {
		return reply.code(500).send({ error: 'Internal server error'})
	}
}