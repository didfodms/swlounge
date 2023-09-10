const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

const UserNAME = get("#UserNAME").innerText;

// Icons made by Freepik from www.flaticon.com
const BOT_IMG = "https://cdn-icons-png.flaticon.com/512/1782/1782384.png";
const PERSON_IMG = "https://cdn-icons-png.flaticon.com/512/1077/1077012.png";
const BOT_NAME = "ChatGPT";
const PERSON_NAME = UserNAME;

msgerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;

  appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
  msgerInput.value = "";

  const data = {};
  const userRequest = msgText;
  const chatGPTResponse = await new Promise((resolve, reject) => {
    botResponse(userRequest);
  });
});

function appendMessage(name, img, side, text) {
  //   Simple solution for small apps
  //  chatGPT 답변에 공백, 개행 추가하는 법 -> style="white-space:pre;" 추가하기
  // const msgHTML = `
  //   <div class="msg ${side}-msg">
  //     <div class="msg-img" style="background-image: url(${img})"></div>

  //     <div class="msg-bubble">
  //       <div class="msg-info">
  //         <div class="msg-info-name">${name}</div>
  //         <div class="msg-info-time">${formatDate(new Date())}</div>
  //       </div>

  //       <div class="msg-text">${text}</div>
  //       <div style="visibility:hidden;">${text}</div>
  //     </div>
  //   </div>
  // `;

  const msgEl = document.createElement("div");
  msgEl.classList.add("msg");
  msgEl.classList.add(`${side}-msg`);

  const msgImgEl = document.createElement("div");
  msgImgEl.classList.add("msg-img");
  msgImgEl.style.backgroundImage = `url(${img})`;

  const msgBubbleEl = document.createElement("div");
  msgBubbleEl.classList.add("msg-bubble");

  const msgInfoEl = document.createElement("div");
  msgInfoEl.classList.add("msg-info");

  const msgInfoNameEl = document.createElement("div");
  msgInfoNameEl.classList.add("msg-info-name");
  msgInfoNameEl.innerHTML = name;

  const msgInfoTimeEl = document.createElement("div");
  msgInfoTimeEl.classList.add("msg-info-time");
  msgInfoTimeEl.innerHTML = formatDate(new Date());

  const msgTextEl = document.createElement("div");
  msgTextEl.classList.add("msg-text");
  msgTextEl.innerHTML = marked.parse(text);

  msgBubbleEl.appendChild(msgInfoEl);
  msgBubbleEl.appendChild(msgTextEl);
  msgInfoEl.appendChild(msgInfoNameEl);
  msgInfoEl.appendChild(msgInfoTimeEl);

  msgEl.appendChild(msgImgEl);
  msgEl.appendChild(msgBubbleEl);

  // msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  const msgerChatEl = document.querySelector(".msger-chat");
  msgerChatEl.appendChild(msgEl);
  msgerChat.scrollTop += 500;
}

async function botResponse(userMsg) {
  let msgText = "";

  // chatGPT에 질의 전송
  fetch("widget/chatGPT", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userMsg: userMsg,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.chatGPT.length !== 0) {
        msgText = res.chatGPT;
      } else {
        msgText = "error";
      }

      // console.log(`userMsg : ${userMsg}\nchatGPTResponse : ${msgText}`);
      // user와 chatGPT 간의 대화 저장
      // fetch("widget/save-chat", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     userRequest: userMsg,
      //     chatGPTResponse: msgText,
      //   }),
      // })
      //   .then((res) => {
      //     res.json();
      //   })
      //   .then(() => {});

      const delay = msgText.split(" ").length * 100;

      setTimeout(async () => {
        appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
        return await msgText;
      }, delay);
    });
}

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}
