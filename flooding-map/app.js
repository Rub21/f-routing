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
	center: [-122.486052, 37.830348],
	zoom: 15,
	hash: true
});


loadGist(function(data) {


	for (var i = 0; i < 1000; i++) {
		data.features[i].properties.status="marked" 
	}


for (var i = 800; i < 1000; i++) {
		data.features[i].properties.status="validate" 
	}


	map.on('load', function() {
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
						['marked', '#f4f0a1'],
						['validate', '#0ff']

						// ['progress', '#eaa8a8'],
						// ['done', '#f4f0a1'],
						// ['validate', '#8ef9be']
					]
				},
				'line-opacity': 1,
				            "line-width": 5

			}
		});
	});


})



map.on('click', 'roads', function(e) {
	var coordinates = e.features[0].geometry.coordinates.slice();
	var id = e.features[0].properties.id;
	console.log(id)

	firebase
		.database()
		.ref('roads/' + id)
		.set({
			status: 'marked',
			date: Date()
		})


});