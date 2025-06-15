import { FastifyRequest, FastifyReply } from 'fastify'
import { Op } from 'sequelize';
import bcrypt from 'bcryptjs'
import { User } from '../../db_models/user_model'
import { SignUpRequest } from '../../interfaces'

export async function sign_up (request: FastifyRequest<{ Body: SignUpRequest }>, reply: FastifyReply)
{
	try {
		// console.log('sign_up called with body:', request.body)
		const { username, email_adress, password } = request.body
		const existingUser = await User.findOne({ 
			where: { [Op.or]: [{ email_adress }, { username }] }
		})
		if (existingUser) {
			return reply.status(400).send({ error: 'Username or email already exists' })
		}

		const hashed_password = await bcrypt.hash(password, 13)
		const newUser = await User.create({
			username,
			email_adress,
			hashed_password
		})

		if (!newUser) {
			return reply.status(400).send({ error: 'User creation failed' })
		}
		reply.status(201).send({ message: 'User created successfully'})
	}
	catch (error) {
		reply.status(500).send({ error: 'Error creating user' })
	}
}

// TODO : Add verification on every field