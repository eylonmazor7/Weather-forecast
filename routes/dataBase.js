var express = require('express');
var router = express.Router();

const db = require('../models');

router.post('/seeAllUserLocation', function (req, res) {
  return db.Weather.findAll({where:{userEmail : req.session.weatherEmail}})
      .then((accounts) => res.send(accounts)) //database request to load all of the current user locations
      .catch((err) => {
        console.log('There was an error querying contacts', JSON.stringify(err))
        err.error = 1; // some error code for client side
        return res.send(err) //database request to load all of the current user locations
      });
});

router.post('/insertLoc', function(req, res){
  //if someone disconnect from other tab -> req.session.canGoIn will be false, and the user will need to reconnect
  //from loginPage, if he wants to edit (save or delete) the dataBase.
  if(req.session.canGoIn === false)
  {
    let lon = req.body.lonn;
    let lat = req.body.latt;
    let loc = req.body.locationn;
    let userName = req.session.weatherEmail;

    //create a field in the weather database for this user and those details
    return db.Weather.create({userEmail : userName, lon: lon, lat: lat, location: loc})
        .then(res.send("success"))
        .catch((err) => {
          return res.status(400).send(err)
        })
  }
  else
    console.log("Operation blocked!");
});

/*-------------------------------------------DELETE pages----------------------------------------------------*/
//-----------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------//
/*-------------------------------------------DELETE pages----------------------------------------------------*/

router.delete('/deleteLoc', function(req, res){
    //if someone disconnect from other tab -> req.session.canGoIn will be false, and the user will need to reconnect
    //from loginPage, if he wants to edit (save or delete) the dataBase.
    if(req.session.canGoIn === false){
        let location = req.body.locationToDelete;

        //deleting specific location from the database
        db.Weather.destroy({where: {userEmail : req.session.weatherEmail, location: location}})
            .then(res.send("success"))
            .catch((err) => {
                return res.status(400).send(err)
            })}
    else
        console.log("Operation blocked!");
});

router.delete('/deleteAllLoc', function(req, res){
    //if someone disconnect from other tab -> req.session.canGoIn will be false, and the user will need to reconnect
    //from loginPage, if he wants to edit (save or delete) the dataBase.
    if(req.session.canGoIn === false){
        let location = req.body.locationToDelete;
        let userEmail = req.session.weatherEmail;

        //deleting all locations for a specific user
        db.Weather.destroy({where: {userEmail : userEmail}})
            .then(res.send("success"))
            .catch((err) => {
                return res.status(400).send(err)
            })}
    else
        console.log("Operation blocked!");
});

module.exports = router;
