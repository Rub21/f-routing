var fs = require("fs");
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

function getDataDB(callback) {
    firebase
            .database()
            .ref('features')
            .on(
                    'value',
                    function (d_database) {
                        callback(d_database.val());
                    },
                    function (errorObject) {
                        console.log('The read failed: ' + errorObject.code);
                    }
            );
}

getDataDB((data) => {
    fs.writeFileSync('data_backup.geojson', JSON.stringify({
        "type": "FeatureCollection",
        "features": data
    }));
});