const knex = require("knex")(require("../knexfile"));
const uuid = require("uuid");

exports.getData = (_req, res) => {
    knex("earnings")
        .select(
            "earnings.id",
            "earnings.name",
            "earnings.date",
            "earnings.amount",
            "earnings.paid"
        )
        .then((data) => {
            const response = data.map((earnings) => {
                return {
                    id: earnings.id,
                    name: earnings.name,
                    date: earnings.date,
                    amount: earnings.amount,
                    paid: earnings.paid
                };
            });
            res.status(200).json(response);
        })
        .catch((err) =>
            res.status(400).send(`Error retrieving Data: ${err}`)
        );
};


exports.addData = (req, res) => {
    const id = uuid.v4 ();
    console.log (req.body);
    if (
        !req.body.name || 
        !req.body.date || 
        !req.body.amount || 
        !req.body.paid
        ) {
        return res.status(400).send('Please make sure to provide name, ma email fields in a request');
    }

    knex('earnings')
        .insert({...req.body, id})
        .then(() => {
            res.status(201).json({
                message: 'Successfully added earnings',
                data: {
                    id,
                    name: req.body.name,
                    date: req.body.date,
                    amount: req.body.amount,
                    paid: req.body.paid
                }
            });
        })
        .catch((err) => res.status(400).send(`Error creating Warehouse: ${err}`));
};