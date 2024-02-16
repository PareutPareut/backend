export function user(Model, sequelize, DataTypes) {
    class User extends Model {}

    User.init(
        {
            user_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            event_id : {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING(512),
                allowNull: false,
            },
        },
        {
            sequelize, 
            modelName: 'User',
        }
    )

    return User
}
