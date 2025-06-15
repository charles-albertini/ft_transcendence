import { FastifyRequest, FastifyReply } from 'fastify'
import { User } from '../../db_models/user_model';
import { JWTpayload } from '../../interfaces';

export async function disable2FA(request: FastifyRequest, reply: FastifyReply) {
	try {
		const user = request.user as JWTpayload;
		const userRecord = await User.findByPk(user.user_id);

		if (!userRecord) {
			return reply.status(404).send({ error: 'User not found' });
		}

		if (!userRecord.twoFA) {
			return reply.status(400).send({ error: '2FA is not enabled' });
		}

		await userRecord.update({ twoFA: false, twoFASecret: null });
		return reply.status(200).send({ message: '2FA has been disabled successfully' });
	}
	catch (error) {
		console.error('Error disabling 2FA:', error);
		return reply.status(500).send({ error: 'Internal server error while disabling 2FA' });
	}
}