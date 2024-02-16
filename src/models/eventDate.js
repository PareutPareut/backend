export function eventDate(Model, sequelize, DataTypes) {
    class eventDate extends Model {}

    eventDate.init(
        {
            eventId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            date: {
                type: DataTypes.DATEONLY, // 시간 없이 날짜만
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'EventDate',
            timestamps: false,
        }
    )

    return eventDate
}
