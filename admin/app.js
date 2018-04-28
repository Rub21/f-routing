var config = {
    apiKey: "AIzaSyCdzFXh3lnra26ujzMqEqmRqucsu4Xwcrc",
    authDomain: "i-data-85f05.firebaseapp.com",
    databaseURL: "https://i-data-85f05.firebaseio.com",
    projectId: "i-data-85f05",
    storageBucket: "i-data-85f05.appspot.com",
    messagingSenderId: "834555292442"
};
firebase.initializeApp(config);
var incidentesReportados = [];
mapboxgl.accessToken = 'pk.eyJ1IjoicnViZW4iLCJhIjoiYlBrdkpRWSJ9.JgDDxJkvDn3us36aGzR6vg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-79.02496, -8.10641],
    zoom: 13,
    hash: true
});

map.on('load', function() {});

firebase.database()
    .ref('features')
    .orderByChild("properties/status")
    .equalTo("marked")
    .once('value')
    .then(function(snapshot) {
        var geo = {
            "type": "FeatureCollection",
            "features": []
        };
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

function menuIncidentes(geo) {
    for (var i = 0; i < geo.features.length; i++) {
        geo.features[i];
        var idWay = geo.features[i].properties.id.split('/')[1];
        $('#incidentes').append('<a href="#" class="list-group-item"> <input class="selectIncident" name="waySelected" type="checkbox" value="' + idWay + '" id="' + idWay + '">  Calle: ' + idWay + '</a>')
    }
}


//========> Actions

$(document).on('click', '#validar', function(e) {


});

$(document).on('click', '.selectIncident', function(e) {
    var idWay = e.target.getAttribute('value');
    if ($('#' + idWay).is(":checked")) {
        incidentesReportados.push(idWay);
    } else {
        incidentesReportados = incidentesReportados.splice(idWay, 1);
    }
    console.log(incidentesReportados)

});