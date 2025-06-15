import { User } from "../../db_models/user_model";
import { FastifyRequest, FastifyReply } from "fastify";
import { JWTpayload } from "../../interfaces";

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
	try {
		const payload = request.user as JWTpayload;
		const userId = payload.user_id;

		const user = await User.findByPk(userId);
		if (!user) {
			return reply.status(404).send({ error: 'User not found' });
		}

		await User.destroy({ where: { user_id: userId } });

		return reply.status(200).send({ message: 'User deleted successfully' });
	} catch (error) {
		console.error('Error deleting user:', error);
		return reply.status(500).send({ error: 'Internal server error while deleting user' });
	}
}