const alertR = flashAlert.error;


console.log(window.location)


if (alertR) {
    showFormAlert(alertR[0],"danger");
}


function showFormAlert(message,type) {
    const formAlert = document.getElementById("form-alert");
    formAlert.classList.add(type);
    formAlert.textContent = message;
    setTimeout(() => {
        formAlert.style.maxHeight = "50px";
        formAlert.style.padding = "8px 0";
    }, 50);
    setTimeout(() => {
        formAlert.style.maxHeight = 0;
        formAlert.style.padding = 0;
    }, 7000);
}