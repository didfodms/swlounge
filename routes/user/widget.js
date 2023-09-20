const express = require("express");
const moment = require("moment");
const marked = require("marked");
const router = express.Router();
const db = require("../../db.js");
require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const chatGPT = async (prompt) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "당신은 제주대학교 SW라운지의 챗봇입니다. 이제부터 학생들이 질문하는 SW관련 질문들에 대하여 20대 학생처럼 답변해주어야 합니다.",
      },
      { role: "user", content: prompt },
    ],
  });

  return response["data"]["choices"][0]["message"]["content"];
};

/* GET home page. */
router.get("/", async function (req, res, next) {
  if (!req.session.is_logined) {
    res.render("user/widget-no-login", {
      session: req.session,
    });
  } else {
    const getChatRecordListSQL = `SELECT * FROM chat_table WHERE UserID = ${req.session.UserID}`;

    const getChatRecordList = await new Promise((resolve, reject) => {
      db.query(getChatRecordListSQL, (err, res) => {
        if (err) {
          throw err;
          reject(err);
        }

        resolve(res);
      });
    });

    res.render("user/widget", {
      session: req.session,
      chatRecordList: getChatRecordList,
      marked: marked,
    });
  }
});

// ajax로 chatGPT 응답 받아오기!
router.post("/chatGPT", async (req, res, next) => {
  const response = await chatGPT(req.body.userMsg);

  console.log(response);

  res.json({
    chatGPT: response,
  });
});

// 1. user가 채팅한거를 chat_table에 INSERT하기 (widget)
// 2. admin이 user 목록 확인하기 -> user 목록 가져오기 (admin-chat)
// 3. admin이 user 목록을 클릭하면 user의 채팅 목록 가져오기 (admin-chat)

router.post("/save-chat", async (req, res, next) => {
  const UserID = req.session.UserID;
  const body = req.body;
  const userRequest = body.userRequest;
  const chatGPTResponse = body.chatGPTResponse;
  const date = moment().format("YYYY-MM-DD hh:mm:ss");

  const insertChatSQL = `INSERT INTO chat_table (UserID, Question, GPTAnswer, LOUNGEAnswer, Created_at)
                          VALUE(${UserID}, '${userRequest}', '${chatGPTResponse}', ${null}, '${date}')`;

  const changeChatStatusSQL = `UPDATE user_table
                              SET NewQuestion = 'Y'
                              WHERE UserID = ${UserID}`;

  // chat_table에 chat 기록 저장
  const result = await new Promise((resolve, reject) => {
    db.query(insertChatSQL, (err, res) => {
      if (err) {
        throw err;
        reject(err);
      }
      resolve(res);
    });
  });

  // user_table에 new chatting status 업데이트
  const result2 = await new Promise((resolve, reject) => {
    db.query(changeChatStatusSQL, (err, res) => {
      if (err) {
        throw err;
        reject(err);
      }
      resolve(res);
    });
  });

  res.json({
    result: result,
    result2: result2,
  });
});

module.exports = router;
