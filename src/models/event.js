export function event(Model, sequelize, DataTypes) {
    class event extends Model {}

    event.init(
        {
            eventId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            eventName: {
                type: DataTypes.STRING(32),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Event',
            timestamps: false,
        }
    )

    return event
}
