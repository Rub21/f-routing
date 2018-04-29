var usuario = '';
var dni = '';

$(document).on("click", '#crearIncidente', function() {
    var formData = new FormData($("#formulario")[0]);
    var ruta = "http://52.168.81.187:3021/upload";
    $.ajax({
        url: ruta,
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function(datos) {
            $('#form_up').hide();
            $('#img_demo').attr('src', datos.location);
            $('#form_prev').show();
            updateState(localStorage.way_id, datos.location, (data) => {
                var geo = {
                    "type": "FeatureCollection",
                    "features": []
                };
                $.each(data, function(k, v) {
                    geo.features.push(v);
                });

                updateMap(geo);
            });
        }
    });
});
var config = {
    apiKey: "AIzaSyBVJcbV9LSNh4ewiF1M9SR4eVslUNPKv_8",
    authDomain: "i-data-project.firebaseapp.com",
    databaseURL: "https://i-data-project.firebaseio.com",
    projectId: "i-data-project",
    storageBucket: "i-data-project.appspot.com",
    messagingSenderId: "934125373941"
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

getDataDB((data) => {
    var geo = {
        "type": "FeatureCollection",
        "features": []
    };
    $.each(data, function(k, v) {
        geo.features.push(v);
    });

    updateMap(geo);
});

function updateMap(data) {
    if (!map.getSource('roadsSource')) {
        map.addSource('roadsSource', {
            "type": "geojson",
            "data": data
        });

    } else {
        map.getSource('roadsSource').setData(data);
    }

    map.addLayer({
        "id": "roads",
        "type": "line",
        "source": 'roadsSource',
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
                ],
                "default": "#ddd"

            },
            "line-width": 12,
            'line-opacity': 0.5
        }
    });
}

function getDataDB(callback) {
    firebase
        .database()
        .ref('features')
        .on(
            'value',
            function(d_database) {
                callback(d_database.val());
            },
            function(errorObject) {
                console.log('The read failed: ' + errorObject.code);
            }
        );
}

map.on('click', 'roads', function(e) {
    changeStatus(e);
});

map.on('mouseenter', 'roads', function() {
    map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'roads', function() {
    map.getCanvas().style.cursor = '';
});


var p = `
        <div id="form_up">
            <form method="post" id="formulario" enctype="multipart/form-data">
                Subir imagen: <input type="file" name="file">
            </form>
            <button id="crearIncidente">Reportar calle inundada</button>
        </div>
        <div id="form_prev" style="display: none">
            <h3>Se registró la calle inundada</h3><br/>
            <img id="img_demo" src="" alt="Prev" width="300">
        </div>`;

function updateState(id, url, callback) {
    var ref = firebase.database().ref('features/' + id.split('/')[1]);
    ref.on('value', function(db_feature) {
        var r = db_feature.val();
        if (!r.properties.status) {
            r.properties.status = "marked";
            r.properties.usuario = usuario;
            r.properties.dni = dni;
            r.properties.img = url;
            ref.update(r);
        }
    });

    firebase
        .database()
        .ref('features')
        .on(
            'value',
            function(d_database) {
                callback(d_database.val());
            },
            function(errorObject) {
                console.log('The read failed: ' + errorObject.code);
            }
        );
}

function changeStatus(e) {
    var rd = e.features[0];
    var coordinates = [e.lngLat.lng, e.lngLat.lat];

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    var pu = new mapboxgl.Popup();
    pu.setHTML(p);
    pu.on('close', function(e) {
        console.log('Close!');
    });
    pu.setLngLat([e.lngLat.lng, e.lngLat.lat])
        .setHTML(p)
        .addTo(map);
    localStorage.way_id = rd.properties.id;
}

$(document).on('click', '#btnAccess', function(e) {
    usuario = $('#fieldusuario').val()
    console.log(usuario)
    dni = $('#fiellddni').val();
    $('#usuario').text('| User: ' + usuario);
    $('.lock').parent().remove();
});