var config = {
    apiKey: "AIzaSyBVJcbV9LSNh4ewiF1M9SR4eVslUNPKv_8",
    authDomain: "i-data-project.firebaseapp.com",
    databaseURL: "https://i-data-project.firebaseio.com",
    projectId: "i-data-project",
    storageBucket: "i-data-project.appspot.com",
    messagingSenderId: "934125373941"
};
var OSRMHost = 'http://52.168.81.187:5000';
// var OSRMHost = 'http://localhost:5000';

var geo = {
    "type": "FeatureCollection",
    "features": []
};

firebase.initializeApp(config);
var damagedRoads = [];
mapboxgl.accessToken = 'pk.eyJ1IjoicnViZW4iLCJhIjoiYlBrdkpRWSJ9.JgDDxJkvDn3us36aGzR6vg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-79.02496, -8.10641],
    zoom: 13
});
map.on('load', function() {});

firebase.database()
    .ref('features')
    .orderByChild("properties/status")
    .equalTo("marked")
    .once('value')
    .then(function(snapshot) {
        snapshot.forEach(function(child) {
            geo.features.push(child.val());
        });
        printFloodingData(geo);
        menuIncidentes(geo);
        // $('#loading').removeClass('spinner');
    });


function printFloodingData(geo) {
    if (!map.getSource('damagedRoads')) {
        map.addSource('damagedRoads', {
            "type": "geojson",
            "data": geo
        });
    } else {
        map.getSource('damagedRoads').setData(geo);
    }
    map.addLayer({
        "id": "roads",
        "type": "line",
        "source": 'damagedRoads',
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            'line-color': '#693bbb',
            "line-width": 8,
            'line-opacity': 0.5
        }
    });

    

}

  map.on('click', 'roads', function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        
console.log(coordinates)
        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML('description')
            .addTo(map);
    });

function menuIncidentes(geo) {
    for (var i = 0; i < geo.features.length; i++) {
        var idWay = geo.features[i].properties.id.split('/')[1];
        $('#incidentes').append('<a href="#" id="way-' + idWay + '"class="list-group-item zoomtofeature"> <input class="selectIncident" name="waySelected" type="checkbox" value="' + idWay + '" id="' + idWay + '">  Calle: ' + idWay + '</a>')
    }
}

$(document).on('click', '.selectIncident', function(e) {
    var idWay = e.target.getAttribute('value');
    if ($('#' + idWay).is(":checked")) {
        damagedRoads.push(idWay);
    } else {
        damagedRoads = damagedRoads.splice(idWay, 1);
    }
});

$(document).on('click', '#validar', function(e) {
    //save in Firebase
    // for (var i = 0; i < damagedRoads.length; i++) {
    //     console.log(damagedRoads[i])
    //     firebase
    //         .database()
    //         .ref('features/' + damagedRoads[i] + '/properties')
    //         .update({
    //             status: 'validate'
    //         });
    // }
    //set speed of roads
    $.ajax({
        contentType: 'application/json',
        data: JSON.stringify({
            ways: damagedRoads
        }),
        dataType: 'json',
        success: function(data) {
            alert('Calles registradas como inundadas')
        },
        // error: function() {
        //     alert('Error en registrar las calles')
        // },
        processData: false,
        type: 'POST',
        url: OSRMHost + '/ignore/v1 '
    });
});


// $(document).on('click', '.zoomtofeature', function(e) {
//     e.preventDefault();
//     e.stopPropagation();
//     var idWay = e.target.getAttribute('id').split('-')[1];
//     var feature;
//     for (var i = 0; i < geo.features.length; i++) {
//         if (idWay === geo.features[i].properties.id.split('/')[1]) {
//             feature = geo.features[i];
//         }
//     }
//     var bbox = turf.bbox(feature);
//     map.fitBounds(bbox);

// });