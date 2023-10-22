
const signinBtn = document.getElementById("signin");
const signupBtn = document.getElementById("signup");
const popupForm = document.getElementById("popup-form");
const signForm = document.getElementById("sign-form");
const signFormForm = document.getElementById("sign-form-form");
const formSigninBtn = document.getElementById("form-signinBtn");
const formSignupBtn = document.getElementById("form-signupBtn");
const formClose = document.getElementById("form-close");
const nameField = document.getElementById("name-field");
const formTitle = document.getElementById("form-title");
const passField = document.getElementById("password-field");
const lostPass = document.getElementById("lost-password");
const lostPassClick = document.querySelector("#lost-password a");
const lostPassBtn = document.getElementById("form-lostpassBtn");
const lostPassCancelBtn = document.getElementById("form-lostCancelBtn");


/*--- Alerts ---*/

var signAlertError = flashAlert.signFormError;
var signAlertSuccess = flashAlert.signFormSuccess;
if (signAlertError) {
    showSignForm();
    showFormAlert(signAlertError[0], "danger");
    if (signAlertError[1] == 1) activeSignInFormBtn();
    else if (signAlertError[1] == 2) activeSignUpFormBtn();
    else if (signAlertError[1] == 3) activeLostPassForm();
} else if (signAlertSuccess) {
    showSignForm();
    showFormAlert(signAlertSuccess[0], "success");
    activeSignInFormBtn();
}

/*--- Events ---*/
function eventListeners() {
    signinBtn.addEventListener("click",() => {
        showSignForm();
        activeSignInFormBtn();
    });
    signupBtn.addEventListener("click",() => {
        showSignForm();
        activeSignUpFormBtn();
    });
    formClose.addEventListener("click",() => {
        hideSignForm();
    });
    popupForm.addEventListener("click",(e) => {
        if (e.target.id === "popup-form") 
        hideSignForm();
    });
    formSigninBtn.addEventListener("click",() => {
        activeSignInFormBtn();
    });
    formSignupBtn.addEventListener("click",() => {
        activeSignUpFormBtn();
    });
    lostPassClick.addEventListener("click", () => {
        activeLostPassForm();
    });
    lostPassCancelBtn.addEventListener("click",() => {
        activeSignInFormBtn();
    })
}
eventListeners();




/*--- Functions ---*/
function showFormAlert(message,type) {
    const formAlert = document.getElementById("form-alert");
    formAlert.classList.add(type);
    formAlert.textContent = message;
    formAlert.style.maxHeight = "50px";
    formAlert.style.padding = "8px 0";
    setTimeout(() => {
        formAlert.style.maxHeight = 0;
        formAlert.style.padding = 0;
    }, 7000);
}

function activeSignInFormBtn() {
    formSigninBtn.classList.remove("disable");
    formSignupBtn.classList.add("disable");
    formTitle.textContent = "Sign In";
    setTimeout(() => {
        formSigninBtn.setAttribute("type","submit");
        formSignupBtn.setAttribute("type","button");
        lostPassBtn.setAttribute("type","button");
        formSigninBtn.style.maxWidth = "160px";
        formSignupBtn.style.maxWidth = "160px";
        formSigninBtn.style.padding = "1px 6px";
        formSignupBtn.style.padding = "1px 6px";
        /* */
        lostPassBtn.style.maxWidth = 0;
        lostPassCancelBtn.style.maxWidth = 0;
        lostPassBtn.style.padding = 0;
        lostPassCancelBtn.style.padding = 0;
    }, 50);
    nameField.style.maxHeight = 0;
    passField.style.maxHeight = "55px"
    lostPass.style.display = "block";
    signFormForm.setAttribute("action","/api/auth/login");
}
function activeSignUpFormBtn() {
    formTitle.textContent = "Sign Up";
    formSignupBtn.classList.remove("disable");
    formSigninBtn.classList.add("disable");
    setTimeout(() => {
        formSignupBtn.setAttribute("type","submit");
        formSigninBtn.setAttribute("type","button");
        lostPassBtn.setAttribute("type","button");
        formSigninBtn.style.maxWidth = "160px";
        formSignupBtn.style.maxWidth = "160px";
        formSigninBtn.style.padding = "1px 6px";
        formSignupBtn.style.padding = "1px 6px";
        /* */
        lostPassBtn.style.maxWidth = 0;
        lostPassCancelBtn.style.maxWidth = 0;
        lostPassBtn.style.padding = 0;
        lostPassCancelBtn.style.padding = 0;
    }, 50);
    nameField.style.maxHeight = "55px";
    passField.style.maxHeight = "55px"
    lostPass.style.display = "none";
    signFormForm.setAttribute("action","/api/auth/register");
}
function activeLostPassForm() {
    formTitle.textContent = "Lost Password";
    formSignupBtn.classList.add("disable");
    formSigninBtn.classList.add("disable");
    setTimeout(() => {
        formSignupBtn.setAttribute("type","button");
        formSigninBtn.setAttribute("type","button");
        lostPassBtn.setAttribute("type","submit");
        formSigninBtn.style.maxWidth = 0;
        formSignupBtn.style.maxWidth = 0;
        formSigninBtn.style.padding = 0;
        formSignupBtn.style.padding = 0;
        /* */
        lostPassBtn.style.maxWidth = "160px";
        lostPassCancelBtn.style.maxWidth = "160px";
        lostPassBtn.style.padding = "1px 6px";
        lostPassCancelBtn.style.padding = "1px 6px";
    }, 50);
    nameField.style.maxHeight = 0;
    passField.style.maxHeight = 0;
    lostPass.style.display = "none";
    signFormForm.setAttribute("action","/api/auth/forgotpassword");
}

function showSignForm() {
    popupForm.classList.add("active");
    signForm.classList.add("active");
}
function hideSignForm() {
    popupForm.classList.remove("active");
    signForm.classList.remove("active");
    signFormForm.removeAttribute("action");
}