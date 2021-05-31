function verifyPassword(event)
{
    let errorsList = [];
    document.getElementById('submitButton').addEventListener('click', goVerify);

    function goVerify(event){
        document.getElementById('errorsBox').style.display = 'none';

        let child = document.getElementById('errorsList');
        child.innerHTML=''; //remove list of errors

        let pass1 = document.getElementById('password1').value;
        let pass2 = document.getElementById('password2').value; //get both password fields details

        let passEqual = (pass1 !== pass2), passLength = (pass1.toString().length < 8);

        if(passEqual || passLength) { //there's some errors
            document.getElementById('errorsBox').style.display = 'block';
            let errorsList = document.getElementById('errorsList');

            let addToList = (key) => {      //add new error to list of errors
                let newItem = document.createElement('li');
                let newError = document.createTextNode(key);
                newItem.appendChild(newError);
                errorsList.appendChild(newItem);
            }

            if (passEqual) {
                addToList('Passwords are not identical');

            }

            if (passLength) {
                addToList('Password should contain at least 8 characters.');
            }

            event.preventDefault(); //do not move on after submit
        }

    }
}