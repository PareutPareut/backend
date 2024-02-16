export function eventDate(Model, sequelize, DataTypes) {
    class EventDate extends Model {}

    EventDate.init(
        {
            eventDate_id : {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            eventDate_date: {
                type: DataTypes.DATEONLY, // 시간 없이 날짜만
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: 'EventDate',
        }
    )

    return EventDate
}
