let username;
let socket = io();
do {
   username = prompt("Enter your username");
} while (!username);

const textarea = document.querySelector("#textarea");
const submitBtn = document.querySelector("#submitBtn");
const commentBox = document.querySelector(".comment__box");

submitBtn.addEventListener("click", (e) => {
   e.preventDefault();
   let comment = textarea.value;
   if (!comment) {
      return;
   }
   postComment(comment);
});

function postComment(comment) {
   //append to dom
   let data = {
      username: username,
      comment: comment,
   };
   appendToDom(data);
   textarea.value = "";
   //broadcust
   broadcastComment(data);
   // sync with mongoDb
}

function appendToDom(data) {
   let LTag = document.createElement("div");
   LTag.classList.add("comment", "mt-2");

   // let markup = ` <div class="row d-flex justify-content-center">
   //                   <div class="col-md-12">
   //                      <div class="card p-3">
   //                         <div class="d-flex justify-content-between align-items-center">
   //                            <div class="user d-flex flex-row align-items-center"> <img src="/img/default.png"
   //                                     width="30" class="user-img rounded-circle mr-2">
   //                                  <span>
   //                                     <small class="font-weight-bold text-primary">${
   //                                        data.username
   //                                     }</small>
   //                                     <small class="font-weight-bold">${
   //                                        data.comment
   //                                     }</small>
   //                                  </span>
   //                            </div>
   //                            <small>${moment(data.time).format("LT")}</small>
   //                         </div>
   //                      </div>
   //                   </div>
   //                  </div>`;
   let markup = ` <div class="card border-light mb-3">
                            <div class="card-body">
                            <img src="/img/default.png"width="30" class="user-img rounded-circle mr-2 mb-3">
                                <h6>${data.username}</h6>
                                <p>${data.comment}</p>
                                <div>
                                    <img src="/img/clock.png" alt="clock">
                                    <small>${moment(data.time).format(
                                       "LT"
                                    )}</small>
                                </div>
                            </div>
                        </div>`;
   LTag.innerHTML = markup;
   commentBox.prepend(LTag);
}

function broadcastComment(data) {
   //socket

   socket.emit("comment", data);
}

socket.on("comment", (data) => {
   appendToDom(data);
});

let timerId = null;
function debounce(func, timer) {
   if (timerId) {
      clearTimeout(timerId);
   }
   timerId = setTimeout(() => {
      func();
   }, timer);
}
let typingDiv = document.querySelector(".typing");
socket.on("typing", (data) => {
   typingDiv.innerText = `${data.username} is typing...`;
   debounce(function () {
      typingDiv.innerText = "";
   }, 1000);
});

//event liscenr on textarea
textarea.addEventListener("keyup", (e) => {
   socket.emit("typing", { username });
});
