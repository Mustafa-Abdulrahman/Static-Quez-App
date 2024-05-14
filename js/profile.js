import "./jquery.js";

$(".dropList a").on("click", function (e) {
  if ($(".dropList ul").height() == 0) {
    $(".dropList ul").height(this.nextElementSibling.scrollHeight);
  } else {
    $(".dropList ul").height(0);
  }
});

$(".dropSideBar").on("click", function () {
  $(".mainPage .sideBar").toggleClass("active");
});
// console.log($(".dropSideBar"));
// console.log($(".mainPage .sideBar"));

let currentUser;
if (window.localStorage.currentUserData) {
  currentUser = JSON.parse(window.localStorage.currentUserData);
} else {
  currentUser = {};
}
// console.log(currentUser);

let userName = document.querySelectorAll(".userName");

userName.forEach((e) => {
  e.innerHTML = currentUser.userName;
});

let usersData;
if (localStorage.userSavedInfo) {
  usersData = JSON.parse(localStorage.userSavedInfo);
} else {
  usersData = [];
}

let htmlSkill = document.querySelector(".html");
let cssSkill = document.querySelector(".css");

for (let i = 0; i < usersData.length; i++) {
  if (usersData[i].getEmail === currentUser.userEmail) {
    htmlSkill.setAttribute("value", usersData[i].HTML);
    htmlSkill.nextElementSibling.innerHTML = parseInt(usersData[i].HTML) + "%";
    htmlSkill.nextElementSibling.style.left = usersData[i].HTML + "%";
    cssSkill.setAttribute("value", usersData[i].CSS);
    cssSkill.nextElementSibling.innerHTML = parseInt(usersData[i].CSS) + "%";
    cssSkill.nextElementSibling.style.left = usersData[i].CSS + "%";
    console.log(cssSkill);
  }
}

let chooseExam = document.querySelectorAll(".chooseExam");

let str = "";
chooseExam.forEach((e) => {
  e.addEventListener("click", function () {
    window.localStorage.choosenExam = this.innerHTML;
  });
});
