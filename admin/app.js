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
    style: 'mapbox://styles/mapbox/satellite-streets-v9',
    center: [-79.02496, -8.10641],
    zoom: 13
});

map.on('load', function() {
    map.resize();
});

map.on('mouseenter', 'roads', function() {
    map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'roads', function() {
    map.getCanvas().style.cursor = '';
});
firebase.database()
    .ref('features')
    // .orderByChild("properties/status")
    // .equalTo("marked")
    .once('value')
    .then(function(snapshot) {
        // console.log(snapshot)
        snapshot.forEach(function(child) {
            if (child.val().properties && child.val().properties.status &&
                (child.val().properties.status === 'marked' || child.val().properties.status === 'validate'))
                geo.features.push(child.val());
        });
        menuIncidentesReportados(geo);
        menuCallesinundadas(geo);
        printFloodingData(geo);
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
            'line-color': {
                property: 'status',
                type: 'categorical',
                stops: [
                    ['marked', '#693bbb'],
                    ['validate', '#f44141']
                ],
                "default": "#ddd"

            },
            // 'line-color': '#693bbb',
            "line-width": 8,
            'line-opacity': 0.5
        }
    });
}

map.on('click', 'roads', function(e) {
    console.log(e.features[0].properties)
    var pu = new mapboxgl.Popup();
    pu.setLngLat([e.lngLat.lng, e.lngLat.lat])
        .setHTML(`<h4>Fecha:${e.features[0].properties.fecha}</h4>
            <h4>Usuario :  ${e.features[0].properties.usuario}</h4>
            <h4>DNI :  ${e.features[0].properties.dni}</h4>
            <h4>id:${e.features[0].properties.id}</h4>
            <img id="img_demo" src="" alt="Prev" width="500">`)
        .addTo(map);

    var ref = firebase.database().ref('features/' + e.features[0].properties.id.split('/')[1]);
    ref.on('value', function(db_feature) {
        var r = db_feature.val();
        $('#img_demo').attr('src', r.properties.img);
    });
});

map.on('mouseenter', 'roads', function() {
    map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'roads', function() {
    map.getCanvas().style.cursor = '';
});

function menuIncidentesReportados(geo) {
    for (var i = 0; i < geo.features.length; i++) {

        if (geo.features[i].properties.status === 'marked') {
            var idWay = geo.features[i].properties.id.split('/')[1];
            $('#incidentes').append('<a href="#" id="w-' + idWay + '"class="list-group-item zoomtofeature">' +
                '<input class="selectIncident" name="waySelected" type="checkbox" value="value-' + idWay + '" id="w-' + idWay + '"/> ' +
                geo.features[i].properties.name + ' |' + geo.features[i].properties.fecha + '</a>')
        }

    }
}

function menuCallesinundadas(geo) {
    for (var i = 0; i < geo.features.length; i++) {

        if (geo.features[i].properties.status === 'validate') {
            var idWay = geo.features[i].properties.id.split('/')[1];
            $('#callesinundadas').append('<a href="#" id="w-' + idWay + '"class="list-group-item zoomtofeature">' +
                '<input class="selectIncident" name="waySelected" type="checkbox" value="value-' + idWay + '" id="w-' + idWay + '"/> ' +
                geo.features[i].properties.name + ' |' + geo.features[i].properties.fecha + ' </a>')
        }

    }
}


$(document).on('click', '#validar', function(e) {
    for (var i = 0; i < damagedRoads.length; i++) {
        firebase
            .database()
            .ref('features/' + damagedRoads[i] + '/properties')
            .update({
                status: 'validate'
            });
    }
    setTimeout(function() {
        $.ajax({
            contentType: 'application/json',
            data: JSON.stringify({
                ways: damagedRoads
            }),
            dataType: 'json',
            success: function(data) {
                alert('Calles registradas como inundadas')
            },
            error: function() {
                alert('Re-procesar las calles tomara unos minutos')
            },
            processData: false,
            type: 'POST',
            url: OSRMHost + '/ignore/v1 '
        });
    }, 200);
});



$(document).on('click', '#invalidar', function(e) {
    for (var i = 0; i < damagedRoads.length; i++) {
        firebase
            .database()
            .ref('features/' + damagedRoads[i] + '/properties')
            .update({
                status: null,
                url: null
            });
    }
    setTimeout(function() {
        location.reload();
    }, 1000);

});


$(document).on('click', '.selectIncident', function(e) {
    var idWay = e.target.getAttribute('id').split('-')[1];
    if (e.target.checked) {
        damagedRoads.push(idWay);
    } else {
        var index = damagedRoads.indexOf(idWay);
        if (index > -1) {
            damagedRoads.splice(index, 1);
        }
    }
});
$(document).on('click', '.zoomtofeature', function(e) {
    zoomHighway(e);
});

function zoomHighway(e) {
    var idWay = e.target.getAttribute('id').split('-')[1];
    var feature;
    for (var i = 0; i < geo.features.length; i++) {
        if (idWay === geo.features[i].properties.id.split('/')[1]) {
            feature = geo.features[i];
        }
    }
    var bbox = turf.bbox(feature);
    map.fitBounds(bbox);
}

$(document).on('click', '#btnAccess', function(e) {
    if ($('#fieldUser').val() === 'admin' && $('#fieldPassword').val() === 'admin') {
        $('.lock').parent().remove();
    }
});