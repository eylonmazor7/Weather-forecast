class dataBase
{
    constructor() {
        this.errorProblem = [];
        this.locationMap = new Map();
    }

    //add location to the dataBase.
    addLocation(name, lat, lon)
    {
        this.locationMap.set(name ,{lat ,lon});
    }

    addError(error)
    {
        this.errorProblem.push(error);
    }

    getLatitude(city) {
        let lat = this.locationMap.get(city).lat;
        if (lat === "0")
            lat = "0.0";
        return lat;
    }

    getLongitude(city) {
        let lon = this.locationMap.get(city).lon;
        if (lon === "0")
            lon = "0.0";
        return lon;
    }
}

class domObjects
{
    constructor() {
        this.proList = document.getElementById('problemList');
        this.proBox = document.getElementById('problemBox');
        this.locationText = document.getElementById('locationText');
        this.latitudeText = document.getElementById('latitudeText');
        this.longitudeText = document.getElementById('longitudeText');
        this.weatherSelect = document.getElementById('weatherSelect');
        this.delSelect = document.getElementById('deleteSelect');
        this.tableDiv = document.getElementById('tableDiv');
        this.image = document.getElementById('image');
        this.imageDiv = document.getElementById('imageDiv');
        this.tableHead = document.getElementById('tableHeadLine');
        this.tableDivInside = document.getElementById('tableDivInside');
        this.userName = document.getElementById('user');
        this.gif = document.getElementById('gifDiv');
    }

    //after successful validation -> clear the input fields.
    clearInputFields() {
        this.locationText.value = '';
        this.latitudeText.value = '';
        this.longitudeText.value = '';
    }

    //this function receive city name, and remove it from the selectors
    deleteCity(index) {
        let text = this.delSelect.options[index].text;
        this.delSelect.remove(index);
        this.weatherSelect.remove(index);
        return text;
    }

    deleteAllCities() {
        this.weatherSelect.innerHTML = '';
        this.delSelect.innerHTML = '';

        let option = document.createElement("option");
        option.text = "Choose city to watch the weather...";
        (this.weatherSelect).add(option);

        option = document.createElement("option");
        option.text = "Choose city to delete from the list...";
        (this.delSelect).add(option);
    }

    //this function receive a object and status and change his visibility
    changeTheDisplay(obj , changeTo) {
        obj.style.display = changeTo;
    }

    //this function receive a city name, and add this city to HTML selectors
    addCityToSelectors(city) {
        let option = document.createElement("option");
        option.text = city;
        (this.delSelect).add(option);

        option = document.createElement("option");
        option.text = city;
        (this.weatherSelect).add(option);
    }

    //this function organize the data that receive from the server in the table
    receiveData(response, city, lon, lan) {
        this.changeTheDisplay(this.tableDiv , 'block');
        this.changeTheDisplay(this.tableDivInside, 'block');
        this.tableHead.innerHTML = "Weekly weather forecast for: " + city + " {lon = " + lon + " , lan = " + lan + "}";
        let data = response.dataseries;

        for (let i in data) {
            document.getElementById("date" + i).innerHTML = this.organizeDate(data[i].date.toString());
            document.getElementById("status" + i).innerHTML = this.checkAPIWeather(data[i].weather);
            document.getElementById("maTem" + i).innerHTML = data[i].temp2m.max;
            document.getElementById("miTem" + i).innerHTML = data[i].temp2m.min;
            if (data[i].wind10m_max === 1)
                document.getElementById("wind" + i).innerHTML = '-';
            else
                document.getElementById("wind" + i).innerHTML = data[i].wind10m_max;
        }
    }

    //this function check if the weather status is shortcut,
    //and if so - write the full status.
    checkAPIWeather(weather) {
        switch(weather) {
            case "pcloudy":
                weather = "partly cloudy";
                break;
            case "vcloudy":
                weather = "very cloudy";
                break;
            case "ishower":
                weather = "isolated showers";
                break;
            case "lightrain":
                weather = "light rain";
                break;
            case "oshowers":
                weather = "occasional showers";
                break;
            case "lightsnow":
                weather = "light snow";
                break;
            case "mcloudy":
                weather = "mostly cloudy";
                break;
            case "oshower":
                weather = "";
                break;
            default:
                break;
        }
        return weather;
    }

    //this function change the date format to be yyyy/mm/dd instead of yyyymmdd
    //return the new date format
    organizeDate(date){
        let newDate = date.substring(0, 4) + "/";
        newDate += date.substring(4, 6) + "/";
        newDate += date.substring(6);
        return newDate;
    }
}

function openListeners() {
    document.getElementById("submitButton").addEventListener("click", validateForm);
    document.getElementById("weatherButton").addEventListener("click", showWeather);
    document.getElementById("deleteButton").addEventListener("click", deleteCity);
    document.getElementById("deleteAllButton").addEventListener("click", deleteAllCitiesFromDb);
    document.getElementById("image").onerror = imageError;

    let myDom = new domObjects();
    let myData = new dataBase()
    loadUserLocationList();


    //this function loads the location list for a specific user
    function loadUserLocationList() {
        fetch("/seeAllUserLocation", {method: "post"})
            .then((response) =>
        {
            if (response.status !== 200) {
                console.log("error");return;}
            response.json().then((data) =>
            {
                for (i in data) {
                    myData.addLocation(data[i].location, data[i].lat, data[i].lat);
                    myDom.addCityToSelectors((data[i].location));
                }
            });
        })
    }

    //this function inserts a new location into the database for a user
    function insertLocation(name ,lat ,lon){
        fetch ("/insertLoc",{
            method: "post", headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({locationn: name, latt: lat, lonn: lon})
        }).then((response) => { if(response === "success") alert("location added successfully") })
            .catch(console.log("insert Loc - error"));
    }

    //this function removes a city from a user's database
    function deleteCityFromDb(city){
        fetch ("/deleteLoc",{
            method: "delete", headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({locationToDelete: city})
        }).then((response) => { if(response === "success") alert("location deleted successfully") })
            .catch(console.log("insert Loc - error"));
    }

    //this function removes all locations from a user's database
    function deleteAllCitiesFromDb(){
        fetch ("/deleteAllLoc",{method: "delete"})
            .then((response) => { if(response === "success") alert("location deleted successfully") })
            .catch(console.log("insert Loc - error"));
        myDom.deleteAllCities();
    }

    //validate func -> check all the input fields,
    // and if everything is ok -> save the data
    // if not - display the errors
    function validateForm() {
        myData.errorProblem = []; //empty the list

        checkLocation();
        checkLatitude();
        checkLongitude();

        if (myData.errorProblem.length !== 0) {//if there is a errors -> display and return
            showError();
            return;
        }

        //else (everything is ok)
        let name = myDom.locationText.value.trim();
        let lat = myDom.latitudeText.value.trim();
        let lon = myDom.longitudeText.value.trim();

        insertLocation(name ,lat ,lon);

        myData.addLocation(name ,lat ,lon)
        myDom.addCityToSelectors(name);
        myDom.clearInputFields(); //clear the input fields
        myDom.changeTheDisplay(myDom.proBox , 'none'); //hide the problem box
    }

    //check the location text if there is number or
    // of this location name already exist or
    function checkLocation() {
        let loc = myDom.locationText.value;
        if (loc === "")
            myData.addError("Location Name is missing");

        if (/\d/.test(loc.trim()))
            myData.addError("Location Name can't contain numbers");

        // check if this location already exist (the name)
        if(myData.locationMap.has(loc.toString().trim()))
            myData.addError("Location Name must be unique");


    }

    //check the latitude text if there is wrong char inside or
    //the number is in the range or not
    function checkLatitude() {
        let lat = myDom.latitudeText.value;
        if (lat === "") {
            myData.addError("latitude is missing");
            return;
        }
        if (!(/^[+-]?((\d+(\.\d*)?)|(\.\d+))$/).test(lat.trim()))
            myData.addError("latitude cant contain non-numbers chars");

        else if (lat > 90 || lat < -90)
            myData.addError("latitude must be between 90+ to 90-");
    }

    //check the longitude text if there is wrong char inside or
    //the number is in the range or not
    function checkLongitude() {
        let lon = myDom.longitudeText.value;
        if (lon === "") {
            myData.addError("longitude is missing");
            return;
        }
        if (!(/^[+-]?((\d+(\.\d*)?)|(\.\d+))$/).test(lon.trim())) {
            myData.addError("longitude cant contain non-numbers chars");
            return;
        }

        if (lon > 180 || lon < -180)
            myData.addError("longitude must be between 180+ to 180-");
    }

    //delete from dataBase and from the selectors
    function deleteCity() {
        if(myDom.delSelect.selectedIndex === 0)
            return;

        let city = myDom.delSelect.options[myDom.delSelect.selectedIndex].text;
        myData.locationMap.delete(myDom.deleteCity(myDom.delSelect.selectedIndex));
        deleteCityFromDb(city);
    }

    //this function show all the error on the HTML page in special box (div)
    function showError() {
        //erase the old errors
        for (let i = myDom.proList.getElementsByTagName("li").length ; i > 0 ; i--)
            myDom.proList.removeChild(myDom.proList.childNodes[i]);

        let addToList = (key) => {
            let newItem = document.createElement('li');
            let newError = document.createTextNode(key);
            newItem.appendChild(newError);
            myDom.proList.appendChild(newItem);
        }

        //run all over the errorArray and insert to the HTML list
        myData.errorProblem.forEach(errorString => addToList(errorString));

        //show the errors
        myDom.changeTheDisplay(myDom.proBox , 'block');
    }

    //this function create the URL and receive the data from the API -
    //and send the data to another function that organize and display it.
    //this function send the location details to image function to load the image.
    function showWeather() {
        myDom.changeTheDisplay(myDom.tableDiv, 'none');
        myDom.changeTheDisplay(myDom.imageDiv, 'none');
        myDom.changeTheDisplay(myDom.proBox , 'none');
        let city = myDom.weatherSelect.options[myDom.weatherSelect.selectedIndex].text;

        myDom.gif.style.display = 'block';

        if (myData.getLatitude(city) === undefined) //if the first line in select - so return;
            return;

        let latitude = myData.getLatitude(city); //get data for url
        let longitude = myData.getLongitude(city);
        let tableUrl = "http://www.7timer.info/bin/api.pl?lon="+longitude+"&lat="+latitude+"&product=civillight&output=json";

        fetch(tableUrl).then(status).then(json)
            .then(function(response){
                myDom.receiveData(response, city, longitude, latitude);
                myDom.changeTheDisplay(myDom.tableDiv , 'block');
                myDom.gif.style.display = 'none';
            })
            .catch(err => (
                alert(err.message)));

        //try to show the table before the picture (not necessary)
        setTimeout(() => { loadImage(latitude,longitude); myDom.gif.style.display = 'none';}, 2000);

        //if the table is not loaded. i want to check after this time.
        setTimeout(() => { errorSituationReceiveTableData(); }, 3500);

    }

    //check if the response status is proper. if not - send Error;
    function status(response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(new Error(response.statusText));
        }
    }

    //convert the response to json object
    function json(response) {
        return response.json()
    }

    //this function build the URL from the parameters, and update the src
    //of the image.
    function loadImage(latitude, longitude) {
        myDom.image.src = "http://www.7timer.info/bin/astro.php? lon="+longitude+"&lat="+latitude+
            "&ac=0&lang=en&unit=metric&output=internal&tzshift=0";

        myDom.changeTheDisplay(myDom.imageDiv , 'block');

    }

    //if the image not load -> load the default image
    function imageError() {
        myDom.image.src="images/default_image.jpg";
        myDom.changeTheDisplay(myDom.imageDiv , 'block');
    }

    //Some of the places on this site are missing data,
    //but they still have a image for the weekly forecast
    function errorSituationReceiveTableData(){
        if(myDom.tableDiv.style.display !== 'none') // if the table had a problem
            return;

        myDom.tableHead.innerHTML = "There is a problem getting the weekly forecast data.\n";
        myDom.changeTheDisplay(myDom.tableDiv, 'block');
        myDom.changeTheDisplay(myDom.tableDivInside, 'none');
    }
}