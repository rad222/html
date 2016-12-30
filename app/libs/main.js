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



// add GeoJSON feature functionality
var colorRange = [{
	min: 0,
	max: 5,
	color: '#A6F9FF'
}, {
	min: 5,
	max: 6,
	color: '#05FDFF'
}, {
	min: 6,
	max: 7,
	color: '#37C79C'
}, {
	min: 7,
	max: 8,
	color: '#00FF09'
}, {
	min: 8,
	max: 9,
	color: '#8EFF03'
}, {
	min: 9,
	max: 10,
	color: '#96CC34'
}, {
	min: 10,
	max: 11,
	color: '#CAFF64'
}, {
	min: 11,
	max: 12,
	color: '#FCFE8B'
}, {
	min: 12,
	max: 13,
	color: '#FFFD74'
}, {
	min: 13,
	max: 14,
	color: '#FFFF08'
}, {
	min: 14,
	max: 15,
	color: '#FCCE00'
}, {
	min: 15,
	max: 16,
	color: '#FF9765'
}, {
	min: 16,
	max: 17,
	color: '#FF9735'
}, {
	min: 17,
	max: 18,
	color: '#FF6400'
}, {
	min: 18,
	max: 19,
	color: '#CA6836'
}, {
	min: 19,
	max: 20,
	color: '#D23003'
}, {
	min: 20,
	max: 21,
	color: '#F60400'
}, {
	min: 21,
	max: 25,
	color: '#9E0005'
}, {
	min: 25,
	max: 30,
	color: '#CD326C'
}];

function getColor(radon_mean) {
	for (var i = 0; i < colorRange.length; i++) {
		if (radon_mean >= colorRange[i].min && radon_mean < colorRange[i].max) {
			return colorRange[i].color;
		} else if (radon_mean === 'nan') {
			return 'white';
		}
	}
};

function onMouseClick(e) {
	var layer = e.target;
	var feature = layer.feature;
	var notShownProperties = ['ISO', 'ID_0', 'ID_1', 'NAME_0', 'NAME_1', 'HASC_1', 'CCN_1', 'CCA_1', 'TYPE_1', 'ENGTYPE_1', 'NL_NAME_1', 'VARNAME_1'];

	var source = $("#popover-feature-content-template").html();
	var template = Handlebars.compile(source);
	var html = template({
		'featureObject': feature.properties,
		'notShownProperties': notShownProperties
	});

	var popup = L.popup()
		.setLatLng(e.latlng)
		.setContent(html)
		.openOn(map);
};

var onEachFeature = function (feature, layer) {
	if (feature.properties && feature.properties.radon_mean) {
		var radon_mean = feature.properties.radon_mean;
		layer.setStyle({
			fillColor: getColor(radon_mean),
			fillOpacity: 0.5
		});
	};
	layer.on({
		click: onMouseClick,
		//mouseover: onMouseOver,
		//mouseout: resetHighlight,
		// click: zoomToFeature
	});
};



// Define Base Layers
// https://leaflet-extras.github.io/leaflet-providers/preview/
var OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

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



// init map
var map = L.map('map', {
	center: [40.416775, -3.703790],
	zoom: 6,
	layers: [OpenStreetMap_Mapnik]
});

// add scale control
L.control.scale().addTo(map);

var sidebar = L.control.sidebar('sidebar').addTo(map);


// define Stations layer: Spain_CSN, Spain_CIEMAT, Czech_Republic_Monras
// https://github.com/mapbox/leaflet-omnivore
// https://github.com/hiasinho/Leaflet.vector-markers
// https://jsfiddle.net/qkvo7hav/7/

var allPointsLG = L.layerGroup();

var layer_Spain_CSN = L.layerGroup();
var layer_Spain_CIEMAT = L.layerGroup();
var layer_Czech_Republic_Monras = L.layerGroup();


// Creates a Marker Cluster Group
var mcg = L.markerClusterGroup.layerSupport().addTo(map);

var geojsonData = null;

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
				geojsonData = data;
				console.log('meta.csv loaded. count: ' + geojsonData['features'].length);
			});
		},
		complete: function () {
			//setTimeout(worker, 1800000);
			//setTimeout(worker, 3000);
		}
	});
})();



function geoJsonLayer(type) {
	return L.geoJson(null, {
		filter: function (feature, layer) {
			return feature.properties.id_network === type;
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
				click: onMouseClick
			});
		}
	})
};


function initStations(geojsonData) {
	mcg.clearLayers();

	var layer_geojson_Spain_CSN = geoJsonLayer('Spain_CSN');
	layer_geojson_Spain_CSN.addData(geojsonData);
	layer_Spain_CSN.addLayer(layer_geojson_Spain_CSN);

	var layer_geojson_Spain_CIEMAT = geoJsonLayer('Spain_CIEMAT');
	layer_geojson_Spain_CIEMAT.addData(geojsonData);
	layer_Spain_CIEMAT.addLayer(layer_geojson_Spain_CIEMAT);

	var layer_geojson_Czech_Republic_Monras = geoJsonLayer('Czech_Republic_Monras');
	layer_geojson_Czech_Republic_Monras.addData(geojsonData);
	layer_Czech_Republic_Monras.addLayer(layer_geojson_Czech_Republic_Monras);
};



var geojsonCCAA = new L.GeoJSON.AJAX('data/ccaa.json', {
	style: function (feature) {
		return {
			color: "black",
			weight: 2
		};
	},
	onEachFeature: onEachFeature
});
var geojsonProvincias = new L.GeoJSON.AJAX('data/provincias.json', {
	style: function (feature) {
		return {
			color: "blue",
			weight: 2
		};
	},
	onEachFeature: onEachFeature
});
var geojsonZonas = new L.GeoJSON.AJAX('data/zona.json', {
	style: function (feature) {
		return {
			color: "grey",
			weight: 2
		};
	},
	onEachFeature: onEachFeature
});



//Checking in the 'sub groups'
mcg.checkIn([
	layer_Spain_CSN,
	layer_Spain_CIEMAT,
	layer_Czech_Republic_Monras
]);

var baseLayers = {
	"OpenStreetMap": OpenStreetMap_Mapnik,
	"Water color": Stamen_Watercolor,
	"OpenTopoMap": OpenTopoMap,
	"Bing Aerial": BingAerial
};


var layerControlStations = L.control.groupedLayers(baseLayers, null, {
	collapsed: false
}).addTo(map);

layerControlStations.addOverlay(allPointsLG, "All / none", "Stations");
layerControlStations.addOverlay(layer_Spain_CSN, "Spain CSN", "Stations");
layerControlStations.addOverlay(layer_Spain_CIEMAT, "Spain CIEMAT", "Stations");
layerControlStations.addOverlay(layer_Czech_Republic_Monras, "Czech Republic Monras", "Stations");


layerControlStations.addOverlay(geojsonCCAA, "CCAA", "Layers");
layerControlStations.addOverlay(geojsonProvincias, "Provincias", "Layers");
layerControlStations.addOverlay(geojsonZonas, "Zonas", "Layers");



// add check/uncheck functionality for Stations layer
map.on("overlayadd overlayremove", function (event) {
	var layer = event.layer;

	if (event.type === "overlayadd") {
		if (layer === allPointsLG) {
			if (!map.hasLayer(layer_Spain_CSN)) {
				layer_Spain_CSN.addTo(map);
			};
			if (!map.hasLayer(layer_Spain_CIEMAT)) {
				layer_Spain_CIEMAT.addTo(map);
			};
			if (!map.hasLayer(layer_Czech_Republic_Monras)) {
				layer_Czech_Republic_Monras.addTo(map);
			};
		};
		if (map.hasLayer(layer_Spain_CSN) && map.hasLayer(layer_Spain_CIEMAT) && map.hasLayer(layer_Czech_Republic_Monras)) {
			map.addLayer(allPointsLG);
		};
	};

	if (event.type === "overlayremove") {
		if (layer === allPointsLG) {
			map.removeLayer(layer_Spain_CSN);
			map.removeLayer(layer_Spain_CIEMAT);
			map.removeLayer(layer_Czech_Republic_Monras);
		};
		if (!map.hasLayer(layer_Spain_CSN) && !map.hasLayer(layer_Spain_CIEMAT) && !map.hasLayer(layer_Czech_Republic_Monras)) {
			map.removeLayer(allPointsLG);
		};
	};

	layerControlStations._update();
	$('.leaflet-control-layers-base').prepend('&nbsp<b>Base Layers</b>');
});



// add Legend control
var legend = L.control({
	position: 'bottomright'
});

legend.onAdd = function (map) {
	var source = $("#legend-layers-template").html();
	var template = Handlebars.compile(source);
	var html = template({
		'colorRange': colorRange
	});
	var div = L.DomUtil.create('div', 'info legend');
	div.innerHTML += html;

	return div;
};
legend.addTo(map);

// overlayadd&overlayremove legends events
map.on('overlayadd overlayremove', function (e) {
	if (map.hasLayer(geojsonCCAA) || map.hasLayer(geojsonProvincias) || map.hasLayer(geojsonZonas) || map.hasLayer(layer_Spain_CSN) || map.hasLayer(layer_Spain_CIEMAT) || map.hasLayer(layer_Czech_Republic_Monras)) {
		$('#legend-layers').show();
	};

	if (!map.hasLayer(geojsonCCAA) && !map.hasLayer(geojsonProvincias) && !map.hasLayer(geojsonZonas) && !map.hasLayer(layer_Spain_CSN) && !map.hasLayer(layer_Spain_CIEMAT) && !map.hasLayer(layer_Czech_Republic_Monras)) {
		$('#legend-layers').hide();
	};

	if (map.hasLayer(geojsonCCAA) || map.hasLayer(geojsonProvincias) || map.hasLayer(geojsonZonas)) {
		$('#opacity-control').css('display', 'flex');
	} else {
		$('#opacity-control').css('display', 'none');
	};
});



// opacity control
$('#rangeSliderForVektorLayers').slider({
	formatter: function (value) {
		return 'Current value: ' + value;
	}
});


$('#opacity-control > div > div.slider-handle.min-slider-handle.round').mousedown(function () {
	map.dragging.disable();
});
$('#opacity-control > div > div.slider-handle.min-slider-handle.round').mouseleave(function () {
	map.dragging.enable();
});



function updateVektorLayersOpacity(value) {

	geojsonCCAA.setStyle({
		fillOpacity: value / 100
	});
	geojsonProvincias.setStyle({
		fillOpacity: value / 100
	});
	geojsonZonas.setStyle({
		fillOpacity: value / 100
	});
};



$(document).ready(function () {

	setTimeout(function () {
		initStations(geojsonData);
		allPointsLG.addTo(map);
	}, 500);


	// add logo
	var mapControlsContainer = $('.leaflet-top.leaflet-left > .leaflet-control');
	var logoContainer = $('#logo-container');
	mapControlsContainer.append(logoContainer);


	// change Leaflet Control.Layers view
	$('.leaflet-control-layers-base').prepend('&nbsp<b>Base Layers</b>');
	//$('.leaflet-control-layers-overlays').prepend('<b>Layers:</b>');
	$('.leaflet-control-layers-overlays').prependTo('.leaflet-control-layers-list');
	$('.leaflet-control-layers-base').appendTo('.leaflet-control-layers-list');


});