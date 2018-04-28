var config = {
    apiKey: "AIzaSyDAk4WRCP4zx4JhkF2czVu4LJkzvVMN_Rg",
    authDomain: "roads-a384c.firebaseapp.com",
    databaseURL: "https://roads-a384c.firebaseio.com",
    projectId: "roads-a384c",
    storageBucket: "roads-a384c.appspot.com",
    messagingSenderId: "1005333787675"
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



loadGist((data) => {
    //validateDataDB(data, (df) => {
    //console.log(data);
    //console.log(df);
    /*
     map.on('load', () => {
     map.addLayer({
     "id": "roads",
     "type": "line",
     "source": {
     "type": "geojson",
     "data": df
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
     ['marked', '#f4f0a1'],
     ['validate', '#0ff']
     ]
     },
     'line-opacity': 1,
     "line-width": 5
     
     }
     });
     });
     */
    //});
    //console.log(data_demo);

    prepareData(data, data_demo.roads.way, (df) => {
        //console.log(df);
        updateMap(df);
    });
});
function updateMap(data) {
    map.on('load', () => {
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
function validateDataDB(data, callback) {
    var d_final = data;
    //var d_features = d_final.features;
    firebase
            .database()
            .ref('roads/way')
            .on(
                    'value',
                    function (d_database) {

                        /*for (var i = 0; i < d_features.length; i++) {
                         if (d_features[i].id.startsWith("way/")) {
                         var db_ref = d_database.val();
                         var id_r = extractIdString(d_features[i].id);
                         if (db_ref[id_r]) {
                         d_features[i].properties.status = db_ref[id_r].status;
                         d_features[i].status = db_ref[id_r].status;
                         }
                         }
                         }
                         callback(d_final);*/
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

map.on('click', 'roads', function (e) {
    //console.log(e.features);
    //var coordinates = e.features[0].geometry.coordinates.slice();
    var id = e.features[0].properties.id;
    console.log(extractIdString(id));

    changeStatus(extractIdString(id), (df) => {
        updateMap(df);
    });
    //searchID(extractIdString(id), () => { });
    /*
     firebase
     .database()
     .ref('roads/' + id)
     .set({
     status: 'marked',
     date: Date()
     })*/


});

function changeStatus(id, callback) {

}