import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../def'
import { User } from './user_model';

class UserMatch extends Model {
	match_id!: number;
	user_id!: number;
	winner!: boolean;
	user_score!: number;
}

UserMatch.init({
	match_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'matches',  
			key: 'match_id'
		},
		onDelete: 'CASCADE'
	},
	user_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'user',
			key: 'user_id'
		},
		onDelete: 'CASCADE'
	},	
	winner: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
	},
	user_score: {
		type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			min: 0
    	}
	}
}, {
	sequelize,
	modelName: 'UserMatch',
	tableName: 'user_matches',
	timestamps: false
});


export { UserMatch };