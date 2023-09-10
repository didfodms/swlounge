const express = require("express");
const router = express.Router();
const db = require("../../db");

const crypto = require('crypto');

// register.js
// function djangoPBKDF2(password, salt, iterations = 120000, keylen = 256, digest = 'sha256') {
//   return new Promise((resolve, reject) => {
//     crypto.pbkdf2(password, salt, iterations, keylen/8, digest, (err, derivedKey) => {
//       if(err) {
//         reject(err);
//       } else {
//         resolve(`pbkdf2_${digest}$${iterations}$${salt}$${derivedKey.toString('base64')}`);
//       }
//     })
//   })
// }

// const ALGORITHM = 'sha256';
// const ITERATIONS = 120000;
// const KEY_LENGTH = 33;
// const SALT_LENGTH = 12;
// const SALT_ENCODING = 'base64';

// function set_password(rawPassword) {
//   const salt = crypto.randomBytes(SALT_LENGTH).toString(SALT_ENCODING);
//   const derivedKey = crypto.pbkdf2Sync(rawPassword, salt, ITERATIONS, KEY_LENGTH, ALGORITHM);
//   const hash = derivedKey.toString(SALT_ENCODING);
//   return `pbkdf2_${ALGORITHM}$${ITERATIONS}$${salt}$${hash}`;
// }

// function check_password(rawPassword, encoded) {
//   const [algorithm, iterations, salt, originalHash] = encoded.split('$');
//   const derivedKey = crypto.pbkdf2Sync(rawPassword, salt, parseInt(iterations), KEY_LENGTH, ALGORITHM);
//   const hash = derivedKey.toString(SALT_ENCODING);
//   return hash === originalHash;
// }

// const password = 'fodms1234';
// const hashedPassword = set_password(password);
// console.log('Hashed Password : ', hashedPassword);

// const isMatch = check_password(password, hashedPassword);
// console.log(isMatch);

// // login.js 
// function checkDjangoPassword(rawPassword, hashedPassword) {
//   const [prefix, iterations, salt, storedHash] = hashedPassword.split('$');
//   const digest = prefix.split('_')[1];

//   console.log('prefix : ', prefix);
//   console.log('digest : ', digest);
//   console.log('iterations : ', iterations);
//   console.log('salt : ', salt);
//   console.log('storedHash : ', storedHash);

//   return new Promise((resolve, reject) => {
//     crypto.pbkdf2(rawPassword, salt, parseInt(iterations), storedHash.length * 3 / 4, digest, (err, derivedKey) => {
//       if(err) {
//         reject(err);
//       } else {
//         resolve(storedHash === derivedKey.toString('base64'));
//       }
//     });
//   })
// }

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
  const username = body.loginNickname;
  const password = body.loginPassword;

  console.log("nickname", username);
  console.log("password", password);

  const checkNicknameSQL = `SELECT * FROM public."user"
                            WHERE username = '${username}' AND schoolssn = '${password}';`;

  let user;
  const login_flag = await new Promise((resolve, reject) => {
    db.query(checkNicknameSQL, (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      
      // login failed!
      if (!res.rows[0]) {
        resolve(false);
      } // login success!
      else {
        user = res.rows[0];
        resolve(true);
      }
    });
  });

  if (login_flag) {
    req.session.is_logined = true;
    req.session.username = user.username;
    req.session.realname = user.realname;
    req.session.email = user.email;
    req.session.schoolssn = user.schoolssn;
    req.session.admin_type = user.admin_type;

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

// check test
router.post('/check', async (req, res, next) => {
  const result = await new Promise((resolve) => {
    db.query(`SELECT * FROM public."user"`, (err, res) => {
      if(err) {
        throw err;
      }

      resolve(res.rows);
    })
  })

  console.log(result);

  res.json({
    success: true
  })
})

module.exports = router;
