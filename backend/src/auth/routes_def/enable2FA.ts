import { FastifyRequest, FastifyReply } from 'fastify'
import speakeasy from 'speakeasy';
import { User } from '../../db_models/user_model';
import QRCode from 'qrcode';
import { JWTpayload } from '../../interfaces';

export async function enable2FA(request: FastifyRequest, reply: FastifyReply) {
	try {
		const payload = request.user as JWTpayload;
		const id = payload.user_id;
		const user = await User.findByPk(id);
		if (!user) {
			return reply.code(404).send({ error: 'User not found' });
		}

		const generatedSecret = speakeasy.generateSecret({ name: `TonApp (${user.username})`, });
		if (!generatedSecret) {
			return reply.code(400).send({ error: 'Internal ERROR' });
		}

		await user.update( { twoFA: true, twoFA_secret: generatedSecret.base32 }, );
		if (generatedSecret.otpauth_url) {
			const qrCode = await QRCode.toDataURL(generatedSecret.otpauth_url);
			return reply.send({ qrCode: qrCode, secret: generatedSecret.base32 });
		}

		return reply.status(500).send('QR_CODE_GENERATION_ERROR ');
	}
	catch (error) {
		console.error(error);
		return reply.code(500).send({ error: 'Internal server error' });
	}
}