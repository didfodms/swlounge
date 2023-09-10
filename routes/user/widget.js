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
    // const getChatRecordListSQL = `SELECT * FROM chat_table WHERE username = ${req.session.username}`;

    // const getChatRecordList = await new Promise((resolve, reject) => {
    //   db.query(getChatRecordListSQL, (err, res) => {
    //     if (err) {
    //       throw err;
    //       reject(err);
    //     }

    //     resolve(res);
    //   });
    // });

    const getChatRecordList = [];

    res.render("user/widget", {
      session: req.session,
      chatRecordList: getChatRecordList,
      // marked: marked,
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

// BEFORE EDIT
// 1. user가 채팅한거를 chat_table에 INSERT하기 (widget)
// 2. admin이 user 목록 확인하기 -> user 목록 가져오기 (admin-chat)
// 3. admin이 user 목록을 클릭하면 user의 채팅 목록 가져오기 (admin-chat)

// AFTER EDIT
// 1. user가 채팅한거를 username.jsonl에 저장하기 (Question, GPTAnswer)
// 2. admin이 user가 채팅한걸 확인할 수 있도록하는 페이지 만들기
// 3. admin의 답변 내용 역시 username.jsonl에 저장 (LOUNGEAnswer)

const fs = require('fs');
const path = require('path');

// get Q&A
const readChatRecords = (file_path, file_name) => {
  const chatRecordPath = path.join(__dirname, file_path, file_name + '.jsonl');
  const chatRecord = fs.readFileSync(chatRecordPath, "utf-8");
  const records = chatRecord.split("\r\n");

  return records
}

// add LOUNGEAnswer
const editChatRecord = (file_path, file_name, data_index, data_field, data_value) => {
  const chatRecordPath = path.join(__dirname, file_path, file_name + '.jsonl');
  const chatRecords = readChatRecords(file_path, file_name);
  chatRecords[data_index][data_field] = data_value;
  fs.writeFileSync(chatRecordPath, JSON.stringify(chatRecords), (err) => {
    console.log('edit file err : ', err);
  })
}

// save first Q&A
const writeChatRecord = (file_path, file_name, data_field, data_value) => {
  const chatRecordPath = path.join(__dirname, file_path, file_name + '.jsonl');

  fs.writeFileSync()
}

router.post("/save-chat", async (req, res, next) => {
  const username = req.session.username;
  const body = req.body;
  const userRequest = body.userRequest;
  const chatGPTResponse = body.chatGPTResponse;
  const date = moment().format("YYYY-MM-DD hh:mm:ss");



  // const insertChatSQL = `INSERT INTO chat_table (username, Question, GPTAnswer, LOUNGEAnswer, Created_at)
  //                         VALUE(${username}, '${userRequest}', '${chatGPTResponse}', ${null}, '${date}')`;

  // const changeChatStatusSQL = `UPDATE user_table
  //                             SET NewQuestion = 'Y'
  //                             WHERE username = ${username}`;

  // // chat_table에 chat 기록 저장
  // const result = await new Promise((resolve, reject) => {
  //   db.query(insertChatSQL, (err, res) => {
  //     if (err) {
  //       throw err;
  //       reject(err);
  //     }
  //     resolve(res);
  //   });
  // });

  // // user_table에 new chatting status 업데이트
  // const result2 = await new Promise((resolve, reject) => {
  //   db.query(changeChatStatusSQL, (err, res) => {
  //     if (err) {
  //       throw err;
  //       reject(err);
  //     }
  //     resolve(res);
  //   });
  // });

  res.json({
    result: result,
    result2: result2,
  });
});

module.exports = router;
