function openListeners()
{
    document.getElementById('submitButton').addEventListener('click', valiForm);
    let domFirstName = document.getElementById('inputFirstName');
    let domLastName = document.getElementById('inputLastName');
    let domEmail = document.getElementById('inputEmail');
    let firstNameError = document.getElementById('firstNameError');
    let lastNameError = document.getElementById('lastNameError');
    let emailError = document.getElementById('emailError');

    function valiForm (event) {
        //need to check first if the email if ok....
        let email = domEmail.value.trim();
        let firstName = domFirstName.value.trim();
        let lastName = domLastName.value.trim();

        emailError.style.display = 'none';
        firstNameError.style.display = 'none';
        lastNameError.style.display = 'none';

        //checking for errors in the form
        if (!checkName(firstName, firstNameError))
            event.preventDefault();

        if (!checkName(lastName, lastNameError))
            event.preventDefault();

        if (!checkMail(email))
            event.preventDefault();
    }

    function checkMail(mail){
        if (mail === "") {
            emailError.innerText = "Name is missing";
            emailError.style.display = 'block';
            return false;
        }
        return true;
    }

    function checkName(name, domError) { //func to check name input
        let flag = true;
        if (name === "") {
            domError.innerText = "Name is missing";
            flag = false;
        }
        if (!name.match(/^[A-Za-z]+$/)) {
            domError.innerText = "Must contain only English letters";
            flag = false;
        }

        if(!flag) //there is an error
            domError.style.display = 'block';

        return flag;
    }
}