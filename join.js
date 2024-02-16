db.event.findAll({
    include: [
        {
            model: db.user,
            required: false,
            right: true, // RIGHT JOIN -> (User > event)
        },
    ],
})
