// user.js
import { DataTypes } from 'sequelize';

const UserModel = (sequelize) => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING(20),
            allowNull: true, // 빈값을 허용해줌
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false, // null값을 허용해줄 것인가: false = 빈값을 허용해줄 것인가: 아니요
            unique: true, // 유니크
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
};

export default UserModel;
