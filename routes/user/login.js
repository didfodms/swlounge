const express = require("express");
const router = express.Router();
const db = require("../../db");

/* GET users listing. */
router.get("/", function (req, res, next) {
  if (!req.session.is_logined) {
    res.render("user/login", { 
      session: req.session,
    });
  }
});

// 로그인창에 입력한 nickname과 password 일치하는지 DB에서 체크
// 일치한다면 session 생성 후 저장
// redirect /index
router.post("/", async (req, res, next) => {
  const body = req.body;
  const nickname = body.loginNickname;
  const password = body.loginPassword;

  console.log("nickname", nickname);
  console.log("password", password);

  const checkNicknameSQL = `SELECT * FROM user_table
                            WHERE UserEmail = '${nickname}' AND UserPW = '${password}'`;

  let user;
  const login_flag = await new Promise((resolve, reject) => {
    db.query(checkNicknameSQL, (err, res) => {
      if (err) {
        reject(err);
      }

      // login failed!
      if (!res[0]) {
        resolve(false);
      } // login success!
      else {
        user = res[0];
        resolve(true);
      }
    });
  });

  console.log("login_flag", login_flag);

  if (login_flag) {
    req.session.is_logined = true;
    req.session.UserID = user.UserID;
    req.session.UserEmail = user.UserEmail;
    req.session.Newquestion = user.Newquestion;
    req.session.Permission = user.Permission;

    req.session.save((err) => {
      if (err) throw err;
      res.json({
        result: "success",
      });
    });
  } else {
    res.json({
      result: "error",
    });
  }
});

module.exports = router;
