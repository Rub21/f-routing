var config = {
    apiKey: "AIzaSyCdzFXh3lnra26ujzMqEqmRqucsu4Xwcrc",
    authDomain: "i-data-85f05.firebaseapp.com",
    databaseURL: "https://i-data-85f05.firebaseio.com",
    projectId: "i-data-85f05",
    storageBucket: "i-data-85f05.appspot.com",
    messagingSenderId: "834555292442"
};
firebase.initializeApp(config);

mapboxgl.accessToken = 'pk.eyJ1IjoiZGV2c2VlZCIsImEiOiJnUi1mbkVvIn0.018aLhX0Mb0tdtaT2QNe2Q';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-79.00946, -8.10773],
    zoom: 15,
    hash: true
});
/*
 map.addControl(new MapboxDirections({
 api: 'http://localhost:5000/route/v1',
 accessToken: mapboxgl.accessToken,
 unit: 'metric'
 }), 'top-left');*/



//loadGist((data) => {    
//    console.log("Validando");
//    validateDataDB(data, (df) => {
//        console.log("Pintando");
//        updateMap(df);
//    });
//});

getDataDB((data) => {
    updateMap({
        "type": "FeatureCollection",
        "features": data
    });
});

function mapInit(data) {
    map.on('load', function () {
        map.addLayer({
            "id": "roads",
            "type": "line",
            "source": {
                "type": "geojson",
                "data": data
            },
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                'line-color': {
                    property: 'status',
                    type: 'categorical',
                    stops: [
                        ['marked', '#4286f4'],
                        ['validate', '#f44141']
                    ]
                },
                'line-opacity': 1,
                "line-width": 5

            }
        });

    });
}
function updateMap(data) {
    map.addLayer({
        "id": "roads",
        "type": "line",
        "source": {
            "type": "geojson",
            "data": data
        },
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            'line-color': {
                property: 'status',
                type: 'categorical',
                stops: [
                    ['marked', '#4286f4'],
                    ['validate', '#f44141']
                ]
            },
            'line-opacity': 1,
            "line-width": 5

        }
    });
}
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

map.on('click', 'roads', function (e) {
    changeStatus(e.features[0], (df) => {
        updateMap(df);
    });
});

function changeStatus(rd, callback) {
    var ref = firebase.database().ref('features');
    ref.orderByChild("properties/id").equalTo(rd.properties.id).on("child_added", function (db_feature) {
        var r = db_feature.val();
        try {
            if (!r.properties.status) {
                r.properties.status = "marked";
                db_feature.ref.update(r);
            } else if (r.properties.status) {
                if (r.properties.status === 'marked') {
                    r.properties.status = "validate";
                    db_feature.ref.update(r);
                }
            }
        } catch (e) {

        }
        callback({
            "type": "FeatureCollection",
            "features": [r]
        });
    });
}

function validateDataDB(data, callback) {
    var d_final = data;
    firebase
            .database()
            .ref('roads/way')
            .on(
                    'value',
                    function (d_database) {
                        prepareData(d_final, d_database.val(), (df) => {
                            callback(df);
                        });

                    },
                    function (errorObject) {
                        console.log('The read failed: ' + errorObject.code);
                    }
            );
}

function prepareData(d_final, d_database, callback) {
    var d_features = d_final.features;
    for (var i = 0; i < d_features.length; i++) {
        if (d_features[i].id.startsWith("way/")) {
            var db_ref = d_database;
            var id_r = extractIdString(d_features[i].id);
            if (db_ref[id_r]) {
                d_features[i].properties.status = db_ref[id_r].status;
                d_features[i].status = db_ref[id_r].status;
            }
        }
    }
    callback(d_final);
}

function extractIdString(ref) {
    if (ref.startsWith("node/")) {//node/563722449
        return ref.substring(4 + 1, ref.length);
    }
    if (ref.startsWith("way/")) {//way/563722449
        return ref.substring(3 + 1, ref.length);
    }
    if (ref.startsWith("relation/")) {//relation/563722449
        return ref.substring(8 + 1, ref.length);
    }
    return ref;
}

function searchID(id, callback) {
    firebase
            .database()
            .ref('roads/way')
            .on(
                    'value',
                    function (snapshot) {
                        var r = snapshot.val()[id];
                        if (r !== undefined) {
                            console.log('Encontrado');
                            console.log(r);
                        }
                    },
                    function (errorObject) {
                        console.log('The read failed: ' + errorObject.code);
                    }
            );
}

