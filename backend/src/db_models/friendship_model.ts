import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../def'

class Friendship extends Model {
	friendship_id!: number;
	user_id1!: number;
	user_id2!: number;
	status!: string; // 'pending', 'accepted', 'declined', 'blocked'
	creation_date!: Date;
	last_update!: Date;
}

Friendship.init({
	friendship_id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	user_id1: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'user',
			key: 'user_id'
		},
		onDelete: 'CASCADE'
	},
	user_id2: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'user',
			key: 'user_id'
		},
		onDelete: 'CASCADE'
	},
	status: {
		type: DataTypes.STRING(20),
		allowNull: false,
		defaultValue: 'none',
		validate: {
			isIn: [['pending', 'accepted', 'declined', 'none']]
		}
	},
	creation_date: {
		type: DataTypes.DATE,
		defaultValue: DataTypes.NOW
	},
	last_update: {
		type: DataTypes.DATE,
		defaultValue: DataTypes.NOW
	}
}, {
	sequelize,
	modelName: 'Friendship',
	tableName: 'friendships',
	timestamps: false
});

Friendship.addHook('beforeUpdate', (friendship: any) => {
	friendship.last_update = new Date();
});

Friendship.addHook('beforeCreate', (friendship: any) => {
	friendship.creation_date = new Date();
	friendship.last_update = new Date();
});

export { Friendship };