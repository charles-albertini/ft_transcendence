import { User } from "../../db_models/user_model";
import { FastifyRequest, FastifyReply } from "fastify";
import { JWTpayload, ChangePasswordRequest } from "../../interfaces";
import bcrypt from "bcryptjs";

export async function changePassword(request: FastifyRequest<{ Body: ChangePasswordRequest }>, reply: FastifyReply) {
	try {
		const payload = request.user as JWTpayload;
		const userId = payload.user_id;
		const { currentPassword, newPassword } = request.body;
		
		if (!currentPassword || !newPassword) {
			return reply.status(400).send({ error: 'Current password and new password are required' });
		}
		
		if (newPassword.length < 6) {
			return reply.status(400).send({ error: 'New password must be at least 6 characters long' });
		}
		
		const user = await User.findByPk(userId);
		if (!user) {
			return reply.status(404).send({ error: 'User not found' });
		}
		if (user.google_user) {
			return reply.status(400).send({ error: 'Cannot change password for Google-authenticated users' });
		}
		
		const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.hashed_password);
		if (!isCurrentPasswordValid) {
			return reply.status(400).send({ error: 'Current password is incorrect' });
		}
		
		const hashedNewPassword = await bcrypt.hash(newPassword, 13);

		await user.update({ hashed_password: hashedNewPassword });
		
		return reply.status(200).send({ message: 'Password changed successfully' });
		
	} catch (error) {
		console.error('Error changing password:', error);
		return reply.status(500).send({ error: 'Internal server error while changing password' });
	}
}
