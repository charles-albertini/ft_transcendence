import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

export const sequelize = new Sequelize({
    database: process.env.MARIADB_DATABASE,
    username: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    host: 'db',
    port: 3306,
    dialect: 'mariadb',
    logging: console.log,
});

async function testConnection(maxRetries = 5, delay = 3000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await sequelize.authenticate();
            console.log(`✅ Connection to MariaDB established successfully (attempt ${attempt})`);
            return true;
        } catch (error) {
            console.error(`❌ Database connection attempt ${attempt}/${maxRetries} failed:`);
            
            if (attempt === maxRetries) {
                console.error('🔴 All database connection attempts failed. Exiting...');
                process.exit(1);
            }
            
            console.log(`⏳ Retrying database connection in ${delay/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

import './db_models/associations';

export { testConnection}
export default sequelize;