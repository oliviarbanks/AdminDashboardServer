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
                    paid: earnings.paid,
                };
            });
            res.status(200).json(response);
        })
        .catch((err) =>
            res.status(400).send(`Error retrieving Data: ${err}`)
        );
};

exports.addData = (req, res) => {
    const id = uuid.v4();
    console.log(req.body);
    if (
        !req.body.name ||
        !req.body.date ||
        !req.body.amount ||
        req.body.paid === undefined // Ensure paid is provided and not null
    ) {
        return res
            .status(400)
            .send("Please make sure to provide name, date, amount, and paid fields in the request");
    }

    // Convert the paid field to 1 (true) or 0 (false)
    const paid = req.body.paid ? 1 : 0;

    knex("earnings")
        .insert({ ...req.body, paid, id })
        .then(() => {
            res.status(201).json({
                message: "Successfully added earnings",
                data: {
                    id,
                    name: req.body.name,
                    date: req.body.date,
                    amount: req.body.amount,
                    paid: req.body.paid,
                },
            });
        })
        .catch((err) =>
            res.status(400).send(`Error creating Earning: ${err}`)
        );
};


exports.deleteEarning = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send("Please provide an ID to delete");
    }

    knex("earnings")
        .where({ id })
        .del()
        .then((deletedRows) => {
            if (deletedRows === 0) {
                return res.status(404).json({ message: "Earning not found" });
            }

            res.status(200).json({ message: "Earning deleted successfully" });
        })
        .catch((err) =>
            res.status(500).send(`Error deleting earning: ${err}`)
        );
};
