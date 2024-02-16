export function user(Model, sequelize, DataTypes) {
    class user extends Model {}

    user.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            eventId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            userName: {
                type: DataTypes.STRING(32),
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
            timestamps: false,
        }
    )

    return user
}
