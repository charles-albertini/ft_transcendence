import { FastifyRequest, FastifyReply } from 'fastify';
import { User } from '../../db_models/user_model';
import { JWTpayload } from '../../interfaces';
import { Friendship } from '../../db_models/friendship_model';

export async function pendingRequest(request: FastifyRequest, reply: FastifyReply) {
	try {
		const payload = request.user as JWTpayload;
		const user = await User.findByPk(payload.user_id);
		if (!user) {
			return reply.code(404).send({ error: 'User not found'})
		}

		const pendingRequests = await Friendship.findAll({
			where: {
				user_id1: user.user_id,
				status: 'pending'
			},
			include: [
				{
					model: User,
					as: 'receiver',
					attributes: [ 'username' ]
				}
			],
			order: [['creation_date', 'DESC']]
		});

		if (!pendingRequests || pendingRequests.length === 0) {
			return reply.code(200).send({ 
				message: 'No pending friend requests',
				pending_requests: []
			});
		}
		const formattedRequests = pendingRequests.map(request => ({
			friendship_id: request.friendship_id,
			sender: { username: (request as any).receiver.username },
			creation_date: request.creation_date,
			status: request.status
		}));

		return reply.code(200).send({
			total_pending: formattedRequests.length,
			pending_requests: formattedRequests
		});
	}
	catch (error) {
		return reply.code(500).send({ error: 'Internal server error'})
	}
}