
const init = () => {
    declareEvents()
}

const declareEvents = () => {
    let id_form = document.querySelector("#id_form");

    id_form.addEventListener("submit", (e) => {
        e.preventDefault()

        let email_val = document.querySelector("#id_email").value
        let pass_val = document.querySelector("#id_password").value

        if(!validate(email_val, pass_val)){
            return;
        }

        if (!validDetails(email_val, pass_val)) {
            return;
        }

        window.location.href = "games.html"
    })

}

const validate = (email_val, pass_val) => {
    if (email_val.indexOf("@gmail") == -1 || email_val.indexOf(".") == -1) {
        document.querySelector("#email_error").innerHTML = "Not Valid Email"
        document.querySelector("#email_error").style.color = "red"
        return false;
    }
    else {
        document.querySelector("#email_error").innerHTML = "";
    }

    if (pass_val.length < 8) {
        document.querySelector("#error_pass").innerHTML = "password too short"
        document.querySelector("#error_pass").style.color = "red"
        return false;
    }
    else {
        document.querySelector("#error_pass").innerHTML = "";
    }

    return true;
}

const validDetails = (email_val, pass_val) => {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    for (let i = 0; i < users.length; i++) {
        if (email_val === users[i].email) {
            if (pass_val === users[i].password) {
                return true;
            } else {
                document.querySelector("#error_pass").innerHTML = "password don't match"
                document.querySelector("#error_pass").style.color = "red"
                return false;
            }
        }
    }
    document.querySelector("#error_pass").innerHTML = "email does not exist"
    document.querySelector("#error_pass").style.color = "red"
    return false;
}

init()