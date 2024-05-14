import "./jquery.js";
let userName = document.querySelector("#username");
let userEmail = document.querySelector("#email");
let userPass = document.querySelector("#pass");
let userRePass = document.querySelector("#RePass");
let submitBtn = document.querySelector("input[type='submit']");

//------------------ animation
let popUpNew = document.querySelector(".popUpNew");
// Validation tests
let userNameTest = /^[a-z A-Z\-]+$/;
let userEmailTest =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
let userPassTest = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
// ------------------
$(userName).on("input", function () {
  validUserName();
});
//
$(userEmail).on("input", function () {
  validUserEmail();
});
//
$(userPass).on("input", function () {
  validUserPass();
});
//
$(userRePass).on("input", function () {
  validUserRePass();
});

// ------------ Submit Button
$(submitBtn).on("click", function (e) {
  e.preventDefault();
  let addFlag = 1;
  if (localStorage.userSavedInfo) {
    let length = JSON.parse(localStorage.userSavedInfo).length;
    let arr = JSON.parse(localStorage.userSavedInfo);
    for (let i = 0; i < length; i++) {
      if (userEmail.value === arr.getEmail) {
        addFlag = 0;
      } else {
        addToLocalStorage();
      }
    }
  }

  if (addFlag) {
    addToLocalStorage();
  } else {
    alert("Eamil Adress Already Used");
  }
});

// validation functions

// ------ user name Validation
function validUserName() {
  if (userNameTest.test(userName.value)) {
    $(userName).next().html("User Name Valid");
    $(userName).next().css("color", "green");
    return true;
  } else {
    $(userName).next().html("User Name Is Not Valid");
    $(userName).next().css("color", "red");
  }
}
//email
function validUserEmail() {
  if (userEmailTest.test(userEmail.value)) {
    $(userEmail).next().html("User Email Valid");
    $(userEmail).next().css("color", "green");
    return true;
  } else {
    $(userEmail).next().html("User Email Is Not Valid");
    $(userEmail).next().css("color", "red");
  }
}
// pass
function validUserPass() {
  if (userPassTest.test(userPass.value)) {
    $(userPass).next().html("User Password Valid");
    $(userPass).next().css("color", "green");
    return true;
  } else {
    $(userPass)
      .next()
      .html(
        "It Must 6 To 16 Length & Contain Letters, Numbers and Special Character"
      );
    $(userPass).next().css("color", "red");
  }
}
function validUserRePass() {
  if (userRePass.value === userPass.value) {
    $(userRePass).next().html("Passwords Are Match");
    $(userRePass).next().css("color", "green");
    return true;
  } else {
    $(userRePass).next().html("Passwords Are Not Match Together");
    $(userRePass).next().css("color", "red");
  }
}

// ------------------------ submit Function
// add to local storage
let userData;
if (localStorage.userSavedInfo) {
  userData = JSON.parse(localStorage.userSavedInfo);
} else {
  userData = [];
}
function Person(userName, userEmail, userPass, HTML, CSS) {
  this.getName = userName;
  this.getEmail = userEmail;
  this.getPassword = userPass;
  this.HTML = HTML;
  this.CSS = CSS;
}
function addToLocalStorage() {
  if (
    validUserName() &&
    validUserEmail() &&
    validUserRePass() &&
    validUserPass()
  ) {
    let tableOfData = new Person(
      userName.value,
      userEmail.value,
      userPass.value,
      0,
      0
    );
    // let tableOfData = {
    //   getName: userName.value,
    //   getEmail: userEmail.value,
    //   getPassword: userPass.value,
    //   HTML: 0,
    //   CSS: 0,
    // };

    userData.push(tableOfData);
    localStorage.setItem("userSavedInfo", JSON.stringify(userData));
    setTimeout(popUpFunction, 700);
    setTimeout(redirectToSignIn, 2500);
  }
}

// ----- valid popUp
function popUpFunction() {
  $(popUpNew).css({
    display: "block",
    "animation-duration": "0.3s",
    "animation-name": "popUp",
    "animation-timing-function": "linear",
    "animation-fill-mode": "forwards",
  });
}
// ----- Redirect to Another Webpage
function redirectToSignIn() {
  window.location.replace("../index.html");
}
