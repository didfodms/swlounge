const express = require("express");
const fs = require("fs")
const path = require("path");

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("user/qna-notion", {
    session: req.session,
  });
});

router.get('/api/files', (req, res) => {
  fs.readdir(path.join('public'), (err, files) => {
      if (err) {
          res.status(500).send('Server Error');
          return;
      }
      console.log(files);
      res.json(files);
  });
});

module.exports = router;
