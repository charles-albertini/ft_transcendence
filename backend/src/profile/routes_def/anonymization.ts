import { FastifyReply, FastifyRequest } from 'fastify';
import { User } from '../../db_models/user_model';
import { JWTpayload } from '../../interfaces';

export async function anonymization(request: FastifyRequest, reply: FastifyReply) {
	try {
		const payload = request.user as JWTpayload;
		const userId = payload.user_id;

		const user = await User.findByPk(userId);
		if (!user) {
			return reply.status(404).send({ error: 'User not found' });
		}

		await user.update({
			username: `anonymous_${userId}`,
			email_adress: null,
			twoFA: false,
			twoFA_secret: null,
		});

		return reply.status(200).send({ message: 'User anonymized successfully' });
	}
	catch (error) {
		console.error('Error anonymizing user:', error);
		return reply.status(500).send({ error: 'Internal server error while anonymizing user' });
	}
}