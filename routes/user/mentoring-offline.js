const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("user/mentoring-offline", {
    session: req.session,
  });
});

module.exports = router;
