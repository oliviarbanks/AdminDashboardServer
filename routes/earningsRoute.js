const router = require("express").Router();
const earningsController = require("../controllers/earningsController");

router
  .route("/")
  .get(earningsController.getData)
  .post(earningsController.addData);

router.route("/:id").delete((req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send("Please provide an ID to delete");
  }

  earningsController.deleteEarning(req, res);
});

module.exports = router;
