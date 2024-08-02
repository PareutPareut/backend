export function userTime(Model, sequelize, DataTypes) {
    class userTime extends Model {}

    userTime.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            eventId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            time: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'UserTime',
            timestamps: false,
        }
    )

    return userTime
}
