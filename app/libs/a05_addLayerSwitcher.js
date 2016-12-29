'use strict';

// register handlebar helpers
Handlebars.registerHelper('ifIn', function (elem, list, options) {
    if (list.indexOf(elem) > -1) {
        return options.fn(this);
    }
    return options.inverse(this);
});
Handlebars.registerHelper('ifNotIn', function (elem, list, options) {
    if (list.indexOf(elem) > -1) {
        return options.inverse(this);
    }
    return options.fn(this);
});
















// https://leaflet-extras.github.io/leaflet-providers/preview/
var Stamen_Watercolor = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
	ext: 'png'
});

var OpenTopoMap = L.tileLayer('http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});


var BingLayer = L.TileLayer.extend({
	getTileUrl: function (tilePoint) {
		this._adjustTilePoint(tilePoint);
		return L.Util.template(this._url, {
			s: this._getSubdomain(tilePoint),
			q: this._quadKey(tilePoint.x, tilePoint.y, this._getZoomForUrl())
		});
	},
	_quadKey: function (x, y, z) {
		var quadKey = [];
		for (var i = z; i > 0; i--) {
			var digit = '0';
			var mask = 1 << (i - 1);
			if ((x & mask) != 0) {
				digit++;
			}
			if ((y & mask) != 0) {
				digit++;
				digit++;
			}
			quadKey.push(digit);
		}
		return quadKey.join('');
	}
});

var BingAerial = new BingLayer('https://t{s}.tiles.virtualearth.net/tiles/a{q}.jpeg?g=2732', {
	subdomains: ['0', '1', '2', '3', '4'],
	attribution: '&copy; <a href="http://bing.com/maps">Bing Maps</a>'
});



var baseMaps = {
	"OSM": OpenStreetMap_Mapnik,
	"Water color": Stamen_Watercolor,
	"OpenTopoMap": OpenTopoMap,
	"Bing Aerial": BingAerial
};


// Stations layer: Spain_CSN, Spain_CIEMAT, Czech_Republic_Monras
// https://github.com/mapbox/leaflet-omnivore
// https://github.com/hiasinho/Leaflet.vector-markers
// https://jsfiddle.net/qkvo7hav/7/


var allPointsLG = L.layerGroup().addTo(map);
var layer_Spain_CSN = L.layerGroup().addTo(map);
var layer_Spain_CIEMAT = L.layerGroup().addTo(map);
var layer_Czech_Republic_Monras = L.layerGroup().addTo(map);


var layerStationsCluster = L.markerClusterGroup().addTo(map);


//Creates a Marker Cluster Group
var mcg = L.markerClusterGroup.layerSupport().addTo(map);


(function worker() {

	$.ajax({
		url: 'data/meta.csv',
		cache: false,
		success: function (csv) {
			csv2geojson.csv2geojson(csv, {
				latfield: 'latitude',
				lonfield: 'longitude',
				delimiter: ';'
			}, function (err, data) {

				console.log('meta.csv loaded. count: ' + data['features'].length);

				mcg.clearLayers();


				var layer_geojson_Spain_CSN = L.geoJson(null, {
					filter: function (feature, layer) {
						return feature.properties.id_network === 'Spain_CSN';
					},
					pointToLayer: function (feature, latlng) {
						return L.marker(latlng, {
							icon: L.VectorMarkers.icon({
								icon: 'nuclear',
								prefix: 'ion',
								markerColor: getColor(feature.properties.value),
								iconColor: 'black',
								popupAnchor: [0, -46]
							}),
							title: feature.properties.name,
							riseOnHover: true
						});
					},
					onEachFeature: function (feature, layer) {
						layer.on({
							click: onMouseOver
						});
					}

				});
				layer_geojson_Spain_CSN.addData(data);
				layer_Spain_CSN.addLayer(layer_geojson_Spain_CSN);


				var layer_geojson_Spain_CIEMAT = L.geoJson(null, {
					filter: function (feature, layer) {
						return feature.properties.id_network === 'Spain_CIEMAT';
					},
					pointToLayer: function (feature, latlng) {
						return L.marker(latlng, {
							icon: L.VectorMarkers.icon({
								icon: 'nuclear',
								prefix: 'ion',
								markerColor: getColor(feature.properties.value),
								iconColor: 'black',
								popupAnchor: [0, -46]
							}),
							title: feature.properties.name,
							riseOnHover: true
						});
					},
					onEachFeature: function (feature, layer) {
						layer.on({
							click: onMouseOver
						});
					}

				});
				layer_geojson_Spain_CIEMAT.addData(data);
				layer_Spain_CIEMAT.addLayer(layer_geojson_Spain_CIEMAT);


				var layer_geojson_Czech_Republic_Monras = L.geoJson(null, {
					filter: function (feature, layer) {
						return feature.properties.id_network === 'Czech_Republic_Monras';
					},
					pointToLayer: function (feature, latlng) {
						return L.marker(latlng, {
							icon: L.VectorMarkers.icon({
								icon: 'nuclear',
								prefix: 'ion',
								markerColor: getColor(feature.properties.value),
								iconColor: 'black',
								popupAnchor: [0, -46]
							}),
							title: feature.properties.name,
							riseOnHover: true
						});
					},
					onEachFeature: function (feature, layer) {
						layer.on({
							click: onMouseOver
						});
					}
				});
				layer_geojson_Czech_Republic_Monras.addData(data);
				layer_Czech_Republic_Monras.addLayer(layer_geojson_Czech_Republic_Monras);
			});
		},
		complete: function () {
			setTimeout(worker, 1800000);
		}
	});
})();





var geojsonCCAA = new L.GeoJSON.AJAX('data/ccaa.json', {
	onEachFeature: onEachFeature
});
var geojsonProvincias = new L.GeoJSON.AJAX('data/provincias.json', {
	onEachFeature: onEachFeature
});
var geojsonZonas = new L.GeoJSON.AJAX('data/zona.json', {
	onEachFeature: onEachFeature
});


//Checking in the 'sub groups'
mcg.checkIn([
	allPointsLG,
	layer_Spain_CSN,
	layer_Spain_CIEMAT,
	layer_Czech_Republic_Monras
]);

var overlayMaps = {
	"Layers": {
		"CCAA": geojsonCCAA,
		"Provincias": geojsonProvincias,
		"Zonas": geojsonZonas
	}
};

var LayerControlStations = L.control.groupedLayers(baseMaps, overlayMaps, {
	collapsed: false
}).addTo(map);



LayerControlStations.addOverlay(allPointsLG, "All/none", "Stations");
LayerControlStations.addOverlay(layer_Spain_CSN, "Spain CSN", "Stations");
LayerControlStations.addOverlay(layer_Spain_CIEMAT, "Spain CIEMAT", "Stations");
LayerControlStations.addOverlay(layer_Czech_Republic_Monras, "Czech Republic Monras", "Stations");





// add check/uncheck functionality for Stations layer
map.on("overlayadd overlayremove", function (event) {
	var layer = event.layer;

	if (event.type === "overlayadd") {
		if (layer === allPointsLG) {
			layer_Spain_CSN.addTo(map);
			layer_Spain_CIEMAT.addTo(map);
			layer_Czech_Republic_Monras.addTo(map);
		};
		if (map.hasLayer(layer_Spain_CSN) && map.hasLayer(layer_Spain_CIEMAT) && map.hasLayer(layer_Czech_Republic_Monras)) {
			map.addLayer(allPointsLG);
		};
	} else if (event.type === "overlayremove") {
		if (layer === allPointsLG) {
			map.removeLayer(layer_Spain_CSN);
			map.removeLayer(layer_Spain_CIEMAT);
			map.removeLayer(layer_Czech_Republic_Monras);
		};
		if (!map.hasLayer(layer_Spain_CSN) && !map.hasLayer(layer_Spain_CIEMAT) && !map.hasLayer(layer_Czech_Republic_Monras)) {
			map.removeLayer(allPointsLG);
		};
	};

	LayerControlStations._update();
	$('.leaflet-control-layers-base').prepend('&nbsp<b>Base Layers</b>');
});







$(document).ready(function () {
	// change Leaflet Control.Layers view
	$('.leaflet-control-layers-base').prepend('&nbsp<b>Base Layers</b>');
	//$('.leaflet-control-layers-overlays').prepend('<b>Layers:</b>');
	$('.leaflet-control-layers-overlays').prependTo('.leaflet-control-layers-list');
	$('.leaflet-control-layers-base').appendTo('.leaflet-control-layers-list');


	map.addLayer(allPointsLG);
	$('#legend-layers').show();
});