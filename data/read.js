var fs = require("fs");

function readJSON(p) {
    var contents = fs.readFileSync(p);
    return JSON.parse(contents);
}

//var jsonContent = readJSON('only_ways.geojson');
//var c = jsonContent.features.length;  
//
//console.log(jsonContent.features[0]);
//
//console.log(c);

var firebase = require('firebase');

var config = {
    apiKey: "AIzaSyCdzFXh3lnra26ujzMqEqmRqucsu4Xwcrc",
    authDomain: "i-data-85f05.firebaseapp.com",
    databaseURL: "https://i-data-85f05.firebaseio.com",
    projectId: "i-data-85f05",
    storageBucket: "i-data-85f05.appspot.com",
    messagingSenderId: "834555292442"
};
firebase.initializeApp(config);

var ref = firebase.database().ref('features');
ref.orderByChild("properties/id").equalTo('way/26324516').on("child_added", function(snapshot) {
    var r = snapshot.val();
  
  //snapshot.ref.update({ status: "marked" });
  
  console.log(r.status);
});