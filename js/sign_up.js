
const init = () => {
    declareEvents()
}

const declareEvents = () => {
    let id_form = document.querySelector("#id_form");

    id_form.addEventListener("submit", (e) => {
        e.preventDefault()

        let name_val = document.querySelector("#id_name").value
        let email_val = document.querySelector("#id_email").value
        let pass_val = document.querySelector("#id_password").value

        if (!validate(name_val, email_val, pass_val)) {
            return;
        }

        if (userExist(email_val)) {
            document.querySelector("#email_error").innerHTML = `
        Email already exists!<br>
        Please <a href="sign_in.html">Sign In</a>.
        `;
        document.querySelector("#email_error").style.color = "red"

            return;
        }

        saveToLocal(name_val, email_val, pass_val);

        window.location.href = "games.html"
    })

}

const validate = (name_val, email_val, pass_val) => {
    if (name_val.length < 2) {
        document.querySelector("#error_name").innerHTML = "Name too short"
        document.querySelector("#error_name").style.color = "red"
        return false;
    }
    else {
        document.querySelector("#error_name").innerHTML = "";
    }

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

const saveToLocal = (name_val, email_val, pass_val) => {
    // קריאת משתמשים קיימים מה-Local Storage
    let users = JSON.parse(localStorage.getItem("users")) || [];
    // יצירת אובייקט משתמש חדש
    let newUser = {
        name: name_val,
        email: email_val,
        password: pass_val
    };
    // הוספת המשתמש החדש למערך
    users.push(newUser);
    // שמירת המערך המעודכן ב-Local Storage
    localStorage.setItem("users", JSON.stringify(users));
}

const userExist = (email_val) => {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    for (let i = 0; i < users.length; i++) {
        if (email_val === users[i].email) {
            return true;
        }
    }

    return false;
}

init()