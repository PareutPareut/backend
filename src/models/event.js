export function event(Model, sequelize, DataTypes) {
    class Event extends Model {}

    Event.init(
        {
            event_id : {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            event_name: {
                type: DataTypes.STRING(512),
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: 'Event',
        }
    )

    return Event
}
