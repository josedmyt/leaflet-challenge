// Store API endpoint
var queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json(queryUrl, function(data){
    console.log(data);
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
        layer.bindPopup('<h3>' + feature.properties.place + '</h3><hr>' +
             '<p> Magnitude: ' + feature.properties.mag + '</p>' +
            '<p> Time: ' + new Date(feature.properties.time) + '</p>');
    }
    
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: scaleCircle(feature.properties.mag),
                fillColor: circleColor(feature.properties.mag),
                color: 'black',
                weight: 0.5,
                opacity: 0.5,
                fillOpacity: 0.5
            });
        }
    });   

    createMap(earthquakes);
}

function circleColor(magnitude) {
    switch(true) {
        case magnitude <= 1:
            return 'rgb(0,255,0)';
        case magnitude <= 2:
            return 'rgb(102,255,0)';
        case magnitude <= 3:
            return 'rgb(204,255,0)';
        case magnitude <= 4:
            return 'rgb(255,204,0)';
        case magnitude <= 5:
            return 'rgb(255,102,0)';
        default:
            return 'rgb(255,0,0)';
    }
};

function scaleCircle(magnitude) {
    return magnitude *3
}

function createMap(earthquakes) {

    var streetmap= L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        accessToken: API_KEY
    });

    var baseMaps = {
        "Street Map": streetmap,
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center: [48.8566, 2.3522],
        zoom: 3,
        layers: [streetmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function(myMap) {
        
        var div = L.DomUtil.create('div', 'info legend');
        var magnitudes = [0, 1, 2, 3, 4, 5];
        var labels = [];
    
        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML += '<i style="background:' + circleColor(magnitudes[i] + 1) + '"></i> ' +
                magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(myMap);
};