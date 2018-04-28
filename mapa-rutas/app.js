var config = {
	apiKey: "AIzaSyCdzFXh3lnra26ujzMqEqmRqucsu4Xwcrc",
	authDomain: "i-data-85f05.firebaseapp.com",
	databaseURL: "https://i-data-85f05.firebaseio.com",
	projectId: "i-data-85f05",
	storageBucket: "i-data-85f05.appspot.com",
	messagingSenderId: "834555292442"
};
firebase.initializeApp(config);

mapboxgl.accessToken = 'pk.eyJ1IjoicnViZW4iLCJhIjoiYlBrdkpRWSJ9.JgDDxJkvDn3us36aGzR6vg';
var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v9',
	center: [-79.02496, -8.10641],
	zoom: 13,
	hash: true
});

map.addControl(new MapboxDirections({
	accessToken: mapboxgl.accessToken,
	api: 'http://52.168.81.187:5000/route/v1/',
	unit: 'metric'
}), 'top-left');

//get data from firebase
firebase.database()
	.ref('features')
	.orderByChild("properties/status")
	.equalTo("validate")
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
		$('#loading').removeClass('spinner');
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
			'line-color': '#f44141',
			"line-width": 8,
			'line-opacity': 0.9
		}
	});
}