import "./jquery.js";

// ----------------------- Select Element

let currentQuestion = document.querySelector(".header-section .current-qu");
let quesionCounter = document.querySelector(".header-section .counter-qu");
let bulletsContainer = document.querySelector(".quez-sidebar .bullets");
let quezName = document.querySelector(".header-section .name span");
// marked
let markBtn = document.querySelector(".mark-btn");
let markQuestion = document.querySelector(".quez-sidebar .marked");

// ---------------
let current = 1;
let quezType = window.localStorage.choosenExam;
let trueAnswer = {};
let grade = 0;
// ----------------
let questionSection = document.querySelector(".question-section");

// ----------------------- Ajax Promise Function
let myPromiseRequest = function () {
  return new Promise((res, rej) => {
    let myReq = new XMLHttpRequest();
    myReq.open("GET", "./quesion.json", true);
    myReq.send();

    myReq.addEventListener("load", function () {
      if (this.readyState === 4 && this.status === 200) {
        res(JSON.parse(this.responseText));
      } else {
        rej(Error("Not Found The Request"));
      }
    });
  });
};

myPromiseRequest().then((result) => {
  let lengthOfData = result.filter((item) => {
    return item.type.toLowerCase() === quezType.toLowerCase();
  }).length;

  // ---
  countQuestion(lengthOfData);
  // ------------
  let shuffleData = result
    .filter((item) => {
      return item.type.toLowerCase() === quezType.toLowerCase();
    })
    .sort(() => {
      return Math.random() - 0.5;
    });
  //

  addQuestionData(shuffleData[current - 1]);
  //   -------- dynamic change
  dynamicChange();

  //   ----------------- Next function -----------------------------
  $(".next-button").on("click", function () {
    if (questionSection.querySelector(".answer:has(input:checked)")) {
      if (current < lengthOfData) {
        RemovePointerEvent();
        AddPointerEvent();
        completedQuestions();
        let target = questionSection
          .querySelector(".answer:has(input:checked) input")
          .getAttribute("answer");

        // ------ checkAnswer ------------------------------------
        checkAnswer(
          target,

          current
        );
        current++;
        // console.log(current);
        // ------ clearActive ------------------------------------
        clearActive(bulletsContainer.children, lengthOfData);
        dynamicChange();
        addQuestionData(shuffleData[current - 1], lengthOfData);
        backToQuestion(trueAnswer, current, questionSection);
        // console.log(trueAnswer);
      } else {
        completedQuestions();
        let target = questionSection
          .querySelector(".answer:has(input:checked) input")
          .getAttribute("answer");

        // ------ checkAnswer ------------------------------------
        checkAnswer(
          target,

          current
        );
      }
    }
    // ------------
  });

  //   ---------- list click bullets -----------------------------------------------
  let target;
  for (let i = 0; i < lengthOfData; i++) {
    bulletsContainer.children[i].addEventListener("click", function () {
      RemovePointerEvent();
      AddPointerEvent();
      target = bulletsContainer.children[i].innerHTML;
      current = parseInt(target);
      clearActive(bulletsContainer.children, lengthOfData);
      dynamicChange();
      addQuestionData(shuffleData[current - 1], lengthOfData);
      backToQuestion(trueAnswer, current, questionSection);
    });
  }
  // add mark question
  markBtn.addEventListener("click", function () {
    if (!$(markQuestion).hasClass(current.toString())) {
      $(markQuestion).addClass(current.toString());
      $(markQuestion.querySelector("ul")).append(`<li>${current}</li>`);
    }
    $(markQuestion.querySelectorAll("ul li")).on("click", function () {
      RemovePointerEvent();
      AddPointerEvent();
      current = $(this).html();
      clearActive(bulletsContainer.children, lengthOfData);
      dynamicChange();
      addQuestionData(shuffleData[current - 1], lengthOfData);
      backToQuestion(trueAnswer, current, questionSection);
      $(markQuestion).removeClass(current.toString());
      $(this).remove();
    });

    // console.log(lengthOfData);
  });

  //   ----------------- sumbit Function -----------------------------
  $(".submit-button").on("click", function () {
    let myAlert = confirm("Do You Want To Submit The Answers?");
    // console.log(myAlert === true);
    if (myAlert) {
      submitQuez(shuffleData, lengthOfData);

      $(".mark-btn").css("pointer-events", "none");
      $(".marked ul").css("pointer-events", "none");
      $(bulletsContainer).css("pointer-events", "none");
      $(".submit-button").addClass("disable");
      finalResult(shuffleData);
      editProfile(grade, lengthOfData);
    }
  });
});
// ----------------------------------------------------------------------------------------------------
// ----------------------- Start Functions

//--- counter Function
function countQuestion(length) {
  quesionCounter.innerHTML = length;
  for (let i = 0; i < length; i++) {
    let listItem = document.createElement("li");
    listItem.innerHTML = i + 1;
    bulletsContainer.append(listItem);
  }
  // ------------------------ quez Name
  quezName.innerHTML = quezType.toUpperCase();

  // ----------------------
  // --------------------------------------------------------------------------
}

// ---- Add Data Function
function addQuestionData(element) {
  questionSection.innerHTML = `
    <h1>${element.title}</h1>
          <!--  -->
          <div class="answer">
            <input type="radio" answer='${element.answer_1}' id="answer-1" name="question" />
            <label for="answer-1">${element.answer_1}</label>
          </div>
          <!--  -->
          <!--  -->
          <div class="answer">
            <input type="radio" answer='${element.answer_2}' id="answer-2" name="question" />
            <label for="answer-2">${element.answer_2}</label>
          </div>
          <!--  -->
          <!--  -->
          <div class="answer">
            <input type="radio" answer='${element.answer_3}' id="answer-3" name="question" />
            <label for="answer-3">${element.answer_3}</label>
          </div>
          <!--  -->
          <!--  -->
          <div class="answer">
            <input type="radio" answer='${element.answer_4}' id="answer-4" name="question" />
            <label for="answer-4">${element.answer_4}</label>
          </div>
          <!--  -->
        </div>

    `;
}

// ---- dynamix change function on bullets click
function dynamicChange() {
  currentQuestion.innerHTML = current;
  bulletsContainer.children[current - 1].classList.add("active");
}
// ---- clear active class
function clearActive(list, length) {
  for (let i = 0; i < length; i++) {
    list[i].classList.remove("active");
  }
}
// ----------------- add complete question to list
let arr = [];
function completedQuestions() {
  if (!$(".completed ul").hasClass(current.toString())) {
    $(".completed ul").addClass(current.toString());

    arr.push(current);
    arr.sort((a, b) => {
      return a - b;
    });

    $(".completed ul").html("");
    for (let i = 0; i < arr.length; i++) {
      $(".completed ul").append(`<li>${arr[i]}</li>`);
    }
  }
}
// ----- function check answer

function checkAnswer(answ, currentEl) {
  trueAnswer[currentEl - 1] = answ;
}
let showGrade = document.querySelector(".finalResult");

function submitQuez(solution, lengthOfData) {
  for (let i = 0; i < solution.length; i++) {
    if (trueAnswer[i] === solution[i].trueAnswer) {
      ++grade;
    }
  }
  showGrade.innerHTML = "Your Grade Is " + grade + " Of " + lengthOfData;
  stopTimerFunction();
}

// ---------- list click
// function bulletClick(list, length) {
//   for (let i = 0; i < length; i++) {
//     list[i].addEventListener("click", function () {
//       let target = list[i].innerHTML;
//       current = parseInt(target);
//     });
//   }
// }
// ---------------------- timer
let menutes = document.querySelector(".minute");
let sec = document.querySelector(".sec");
let stopTimerFunction;
function timer() {
  let i = 60;
  setTimeout(() => {
    menutes.innerHTML -= 1;
    sec.innerHTML = "59";
  }, 1000);
  let secound = setInterval(() => {
    i--;

    sec.innerHTML = i;
    if (i == 0) {
      menutes.innerHTML -= 1;
      i = 59;
    }
    if (parseInt(menutes.innerHTML) === 0) {
      sec.innerHTML = "00";
      menutes.innerHTML = 0;
      setTimeout(() => {
        alert("Time Out");
        window.location.replace("../profile.html");
      }, 1000);
      clearInterval(secound);
    }
  }, 1000);
  stopTimerFunction = function () {
    clearInterval(secound);
  };
}
timer();

function RemovePointerEvent(lengthOfData) {
  if (current < lengthOfData) {
    $(".next-button").css("pointer-events", "initial");
  }
}
function AddPointerEvent(lengthOfData) {
  if (current == lengthOfData - 1) {
    $(".next-button").css("pointer-events", "none");
  }
}

function backToQuestion(answers, currentElement, questionSection) {
  if (answers.hasOwnProperty((currentElement - 1).toString())) {
    // -------------------------------------
    let loopingOnQuestion = questionSection.querySelectorAll(".answer");
    for (let i = 0; i < loopingOnQuestion.length; i++) {
      if (
        loopingOnQuestion[i].querySelector("label").innerText ==
        answers[(currentElement - 1).toString()]
      ) {
        loopingOnQuestion[i]
          .querySelector("input")
          .setAttribute("checked", "true");
      } else {
        // console.log(answers[(currentElement - 1).toString()]);
        // console.log(loopingOnQuestion[i].querySelector("label").innerText);
      }
    }
  }
}
// -----------------------------------------------------------------------------------------------------------------------
let questionSection2 = document.querySelector(".question-section2");
let quezContainer = document.querySelector(".quez-container");

function finalResult(element) {
  showGrade.style.display = "block";
  questionSection2.style.display = "block";
  quezContainer.classList.add("showResult");
  for (let i = 0; i < element.length; i++) {
    questionSection2.innerHTML += `
    <h1>${element[i].title}</h1>
          <!--  -->
          <div class='sec'>
          <div class="answer">
            <input type="radio" answer='${element[i].answer_1}' id="answer-1"  />
            <label for="answer-1">${element[i].answer_1}</label>
          </div>
          <!--  -->
          <!--  -->
          <div class="answer">
            <input type="radio" answer='${element[i].answer_2}' id="answer-2"  />
            <label for="answer-2">${element[i].answer_2}</label>
          </div>
          <!--  -->
          <!--  -->
          <div class="answer">
            <input type="radio" answer='${element[i].answer_3}' id="answer-3"  />
            <label for="answer-3">${element[i].answer_3}</label>
          </div>
          <!--  -->
          <!--  -->
          <div class="answer">
            <input type="radio" answer='${element[i].answer_4}' id="answer-4"  />
            <label for="answer-4">${element[i].answer_4}</label>
          </div>
          <!--  -->
        </div>
        </div>

    `;
  }
  // let allInput = questionSection2.querySelectorAll(".sec");
  // for (let i = 0; i < allInput.length; i++) {
  //   for (let i = 0; i < allInput.querySelectorAll(".answer").length; i++) {
  //     if (
  //       allInput[i].querySelectorAll(".answer")[i].querySelector("label")
  //         .innerText == trueAnswer[i]
  //     ) {
  //       console.log(allInput[i]);
  //     }
  //   }
  // }
}
// function showFinalReslutAnswers(){
//    let loopingOnQuestion = questionSection.querySelectorAll(".answer");
//    for (let i = 0; i < loopingOnQuestion.length; i++) {
//      if (
//        loopingOnQuestion[i].querySelector("label").innerText ==
//        answers[(currentElement - 1).toString()]
//      ) {
//        loopingOnQuestion[i]
//          .querySelector("input")
//          .setAttribute("checked", "true");
//      } else {
//        console.log(answers[(currentElement - 1).toString()]);
//        console.log(loopingOnQuestion[i].querySelector("label").innerText);
//      }
//    }
// }
// console.log(questionSection2);
// -----------------------------------------------------------------------------------------------------------
let currentUser;
if (window.localStorage.currentUserData) {
  currentUser = JSON.parse(window.localStorage.currentUserData);
} else {
  currentUser = {};
}
let usersData;
if (localStorage.userSavedInfo) {
  usersData = JSON.parse(localStorage.userSavedInfo);
} else {
  usersData = [];
}

function editProfile(grade, lengthOfData) {
  for (let i = 0; i < usersData.length; i++) {
    if (usersData[i].getEmail === currentUser.userEmail) {
      usersData[i][quezType.toUpperCase()] = (grade * 100) / lengthOfData;
      localStorage.userSavedInfo = JSON.stringify(usersData);
      // console.log(grade);
      // console.log(lengthOfData);
      // console.log(usersData[i][quezType]);
    }
  }
}
