var express = require('express');
var router = express.Router();
var firstTime = true;
var Cookies = require('cookies');
var keys = ['keyboard cat'];

const db = require('../models');

/* GET home page. */
router.get('/', function(req, res) {
    if(firstTime) {
        req.session.canGoIn = true;
        firstTime = false;
    }
    //if someone disconnect from other tab -> req.session.canGoIn will be false, and the user will need to reconnect
    //from loginPage, if he wants to edit (save or delete) the dataBase.
    if(req.session.canGoIn === false){
        res.render('weatherPage', {name1: req.session.userNameConnect});
    }
    else
        res.render('register', {errorM :""});
});

router.get('/register', function(req, res) {
    if(firstTime) { //checking if its first time that someone tries to login in the session
        req.session.canGoIn = true;
        firstTime = false;
    }
    //if someone disconnect from other tab -> req.session.canGoIn will be false, and the user will need to reconnect
    //from loginPage, if he wants to edit (save or delete) the dataBase.
    if(req.session.canGoIn === false){
        res.render('weatherPage', {name1: req.session.userNameConnect});
    }
    else
        res.render('register', {errorM :""});
});

router.get('/loginPage', function(req, res){
    if(firstTime) { //checking if its first time that someone tries to login in the session
        req.session.canGoIn = true;
        firstTime = false;
    }

    if(req.session.canGoIn === false) //if someone's online
        res.render('weatherPage', {name1: req.session.userNameConnect});
    res.render('loginPage', {message : ""});
});

router.get('/weatherPage', function(req, res){
    if(firstTime) { //checking if its first time that someone tries to login in the session
        req.session.canGoIn = true;
        firstTime = false;
        res.render('loginPage', {message : ""});
    }

    else if(req.session.canGoIn === false) //if someone's online
        res.render('weatherPage', {name1: req.session.userNameConnect});
    else
        res.render('loginPage', {message : ""});

});

router.get('*', function(req, res) { //for all urls that are incorrect
    if(req.session.canGoIn === false) //if someone online
        res.render('weatherPage', {name1: req.session.userNameConnect});
    else
        res.render('loginPage', {message : ""}); //default page
});

/*-------------------------------------------POST pages----------------------------------------------------*/
//---------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------//
/*-------------------------------------------POST pages----------------------------------------------------*/

router.post('/validEmail', function(req, res){
  //if someone disconnect from other tab -> req.session.canGoIn will be false, and the user will need to reconnect
  //from loginPage, if he wants to edit (save or delete) the dataBase.
  if(req.session.canGoIn === true){
  let cookies = new Cookies(req, res, {keys: keys});

  req.session.email = req.body.myEmail.toLowerCase();
  req.session.firstName = req.body.myFirstName;
  req.session.lastName = req.body.myLastName;

  //database request to validate email via database
  db.OurUsers.findOne({where:{userEmail : req.session.email}})
      .then((response) => {
          if(!response) {
              let lastVisit = cookies.get('LastVisit', {signed : true}); //cookie to measure 60 seconds for password setup
              if (!lastVisit)
                cookies.set('LastVisit', new Date().toISOString(), {signed: true, maxAge: 60*1000});

              res.render('password', {email: req.session.email}); //email is valid, go to password setup
          }
          else
              res.render('emailError'); //email is invalid, show error

      }).catch((err) => res.render('emailError'));
    }
    else {
        console.log("Operation blocked!");
        res.render('weatherPage', {name1: req.session.userNameConnect}); //someone already logged in, go to weather
    }
});

router.post('/loginPage', function(req, res, next){
    if(req.session.canGoIn === true) { //no one is logged in
        let cookies = new Cookies(req, res, {keys: keys}); //cookie for the 60 seconds measuring
        let lastVisit = cookies.get('LastVisit', {signed : true});

        if(!lastVisit) { //60 seconds past, start registration again
            res.render('register', {errorM: "You must set a password in 60 seconds!"});
        }
        else
            next(); //middleware
    }
    else { //someone's logged in, go to weather
        console.log("Operation blocked!");
        res.render('weatherPage', {name1: req.session.userNameConnect});
    }
});

router.post('/loginPage', function(req, res){
    let pass = req.body.pass;
    let mail = req.session.email;

    //database request to validate email
    db.OurUsers.findOne({where:{userEmail : mail}})
        .then((response) => {
            if(response)
               res.render('emailError');
        }).catch((err) => res.render('emailError'));

    //database request to create a password for the specific email
    return db.OurUsers.create({userEmail : mail, userPassword: pass,
        firstName: req.session.firstName, lastName: req.session.lastName})
        .then((currUser) => {
            res.render('loginPage', {message : "You are registered"});
        })
        .catch((err) => {
            return res.status(400).send(err)
        })
});

router.post('/checkUser', function(req, res,) {
    //if someone disconnect from other tab -> req.session.canGoIn will be false, and the user will need to reconnect
    //from loginPage, if he wants to edit (save or delete) the dataBase.
    if(req.session.canGoIn === true){
    req.session.weatherEmail = req.body.email.toLowerCase();
    let pass = req.body.loginPass;

    if(req.session.canGoIn === false) //someone's logged in, go to weather
        res.render('weatherPage', {name1: req.session.userNameConnect});

    //database request to validate user and get name
    db.OurUsers.findOne({where:{userEmail : req.session.weatherEmail}})
        .then((response) => {
            if(response) {
                if (response.dataValues.userPassword === pass) {
                    req.session.canGoIn = false;
                    req.session.userNameConnect = response.dataValues.firstName;
                    res.render('weatherPage', {name1: response.dataValues.firstName});
                }
                else //wrong password
                    res.render('loginPage', {message : "Wrong password"});
                }
            else //invalid email
                res.render('loginPage', {message : "Invalid Email"});
        }).catch((err) => res.render('userError', {message : "something wrong"}));}
    else { //someone's logged in, go to weather
        console.log("Operation blocked!");
        res.render('weatherPage', {name1: req.session.userNameConnect});
    }
});

router.post('/logOut', function(req, res){
    req.session.canGoIn = true;
    res.render('loginPage', {message : ""});
});

module.exports = router;

/*
-------------------------------------------------------!!!!!!!!!לא למחוק!!!!!!-----------------------------------------

node_modules\.bin\sequelize model:generate --name OurUsers --attributes userEmail:string,userPassword:string,firstName:string,lastName:string
node_modules\.bin\sequelize model:generate --name Weather  --attributes userEmail:string,location:string,lon:float,lat:float
node_modules\.bin\sequelize db:migrate

- design
- - responsive
- - delete all console.log()

for README:
- first/last names must contain only English letters.
- write comments
- default page in case wrong URL - login-page
- all the rules about 2 tabs open -
- - a. if one user is online (in weather page) - no one else can register or connect (if he try to connect -
       its show the weather page, but weather page of the online user.
       its means that if new tab will open in localhost -> the new tab automatically redirect to weather page of the
       online user.
- - b. if 2 tabs are open in weather page, and the user logOut from one of them -> the other can't change the dataBase,
       but still can to show the weather and add new places to DOM object,***---but it will not change the database---***.
       in this case: if the other tab want to change the dataBase -> it need to reLogin from loginPage.
- - c. if someOne disconnected -> no one can change the DataBase until reconnect.
- - d. only one user can be online!
*/