export function userTime(Model, sequelize, DataTypes) {
    class UserTime extends Model {}

    UserTime.init(
        {
            user_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            user_event_id : {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
            },
            user_date : {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            user_time : {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

        },
        {
            sequelize, 
            modelName: 'UserTime', 
        }
    )

    return UserTime
}
