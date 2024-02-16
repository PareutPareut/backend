export function user(Model, sequelize, DataTypes) {
    class User extends Model {}

    User.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            // Model attributes are defined here
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                // allowNull defaults to true
            },
        },
        {
            // Other model options go here
            sequelize, // We need to pass the connection instance
            modelName: 'User', // We need to choose the model name
        }
    )

    return User
}
