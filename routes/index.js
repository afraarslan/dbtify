const router = require("express").Router();

const listenersRouter = require("./listeners");
const artistsRouter = require("./artists");

router.get("/", (req, res) => res.send("api"));

router.use("/artists", artistsRouter);
router.use("/listeners", listenersRouter);

module.exports = router;
