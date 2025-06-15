import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../def'

class Matches extends Model {
	match_id!: number;
	game_duration!: string;
	match_date!: Date;
}

Matches.init({
	match_id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	game_duration: {
		type: DataTypes.TIME, // "HH:MM:SS" format
		allowNull: false
	},
	match_date: {
		type: DataTypes.DATEONLY,
		allowNull: false,
		defaultValue: DataTypes.NOW
	}
}, {
	sequelize,
	modelName: 'Matches',
	tableName: 'matches',
	timestamps: false
});

export { Matches };