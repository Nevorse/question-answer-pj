const leftNavItems = document.querySelectorAll("#left-nav a");

/*--- Alert ---*/
const alertDanger = flashAlert.error || flashAlert.askQuestionError;
const alertSuccess = flashAlert.success;

console.log(flashAlert);

if (alertDanger) {
    showAlert(alertDanger[0], "danger");
} else if (alertSuccess) {
    showAlert(alertSuccess[0], "success");
}


const pathnames = window.location.pathname.split("/");
if (pathnames[3] == "tags") leftNavItems[2].classList.add("active");
else if (pathnames[2] == "users") leftNavItems[3].classList.add("active");
else if (pathnames[2] == "questions") leftNavItems[1].classList.add("active");