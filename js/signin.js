import "./jquery.js";

let submitBtn = document.querySelector("input[type='submit']");
let emailInpuit = document.querySelector("input[type='email']");
let passInput = document.querySelector("input[type='password']");
// --------------
console.log(emailInpuit);

let usersData;
if (localStorage.userSavedInfo) {
  usersData = JSON.parse(localStorage.userSavedInfo);
} else {
  usersData = [];
}

// -------------- Submit Function ----------------------------
submitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  searchUser(emailInpuit, usersData);
  currentUserLogin();
});

// -------------- Submit Function ----------------------------
function searchUser(email, usersArray) {
  for (let i = 0; i < usersArray.length; i++) {
    if (
      email.value === usersArray[i].getEmail &&
      passInput.value === usersArray[i].getPassword
    ) {
      // localStorage.userLoginNow = `{userName:${usersArray[i].getName} , userEmail:${usersArray[i].getEmail}}`;
      // statusInLocal();
      console.log(12);
      goToProfile();
    } else {
      document.querySelector(
        "input[type='password']"
      ).nextElementSibling.style.color = "red";

      document.querySelector(
        "input[type='password']"
      ).nextElementSibling.innerHTML = "Email Or Password Is Not Right";
    }
  }
}

function statusInLocal() {
  localStorage.statusItem = "true";
}
function goToProfile() {
  window.location.replace("../profile.html");
}

function currentUserLogin() {
  let myUser = {};
  for (let i = 0; i < usersData.length; i++) {
    if (emailInpuit.value === usersData[i].getEmail) {
      myUser.userName = usersData[i].getName;
      myUser.userEmail = usersData[i].getEmail;
    }
  }
  window.localStorage.currentUserData = JSON.stringify(myUser);
}
