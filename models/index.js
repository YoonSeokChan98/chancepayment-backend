import Sequelize from 'sequelize';
import configFile from '../config/config.js';
import UserModel from './user.js';  // ESM 방식의 import 사용

const env = process.env.NODE_ENV || 'development';
const config = configFile[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

// 모델 정의
db.User = UserModel(sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db; // ESM 방식의 export 사용
