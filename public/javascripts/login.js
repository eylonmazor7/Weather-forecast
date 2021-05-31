function checkUser()
{
    document.getElementById('submitLogin').addEventListener("click", userValidator);
    let errorBox = document.getElementById('errorsBox'); //to show errors on screen

    function userValidator(event)
    {
        let ok = true; //to mark if something is wrong
        let errorList = document.getElementById('errorsList');
        errorList.innerHTML=''; //clear the errors field
        errorBox.style.display = 'none';

        let addToList = (key) => {      //add new error to list of errors
            errorBox.style.display = 'block';
            ok = false;
            event.preventDefault(); //do not move on after submit
            let newItem = document.createElement('li');
            let newError = document.createTextNode(key);
            newItem.appendChild(newError);
            errorList.appendChild(newItem);
        }

        if(document.getElementById('loginEmail').value === '')
            addToList ('Email input should not be empty');

        if (document.getElementById('loginPassword').value === '')
            addToList('Password input should not be empty');

    }


}


