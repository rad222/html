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
var colorRange1 = [{
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

var colorRange2 = [{
	min: 0,
	max: 10,
	color: '#1AB0AF'
}, {
	min: 10,
	max: 20,
	color: '#3E8CA4'
}, {
	min: 20,
	max: 30,
	color: '#1D65AF'
}, {
	min: 30,
	max: 50,
	color: '#2040AF'
}, {
	min: 50,
	max: 200,
	color: '#3F1EAD'
}, {
	min: 200,
	max: 300,
	color: '#671CAE'
}];

var colorRange3 = [{
	min: 0,
	max: 8,
	color: '#6BBA70'
}, {
	min: 8,
	max: 14,
	color: '#FFFE3E'
}, {
	min: 14,
	max: 20,
	color: '#EA4949'
}];

var colorRange = colorRange1;


function getColor(radon_mean) {
	for (var i = 0; i < colorRange.length; i++) {
		if (radon_mean >= colorRange[i].min && radon_mean < colorRange[i].max) {
			return colorRange[i].color;
		} else if (radon_mean === 'nan') {
			return 'white';
		}
	}
};

// highlight layer for point&polygon overlay layer
var highlight = L.geoJson(null);
var highlightStylePoint = {
	stroke: false,
	fillColor: "#00FFFF",
	fillOpacity: 0.7,
	radius: 10
};
var highlightStylePolygon = {
	color: '#00FFFF',
	weight: 5,
	fillOpacity: 0
};


function showPopupClickPoint(e) {
	if ($("#optradio_point_click").prop('checked')) {
		$(".info.layerinfo").show();
		var layer = e.target;
		var feature = layer.feature;
		var notShownProperties = ['xxx'];

		// add lat/lng properties
		feature.properties['lat,lng'] = feature.geometry.coordinates[1].toFixed(4) + ',' + feature.geometry.coordinates[0].toFixed(4);

		var source = $("#popover-feature-content-template").html();
		var template = Handlebars.compile(source);
		var html = template({
			'featureObject': feature.properties,
			'notShownProperties': notShownProperties
		});

		highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStylePoint));

		info.update(html);
		initTranslate();
	};

};

function showPopupMouseoverPoint(e) {
	if ($("#optradio_point_mouseover").prop('checked')) {
		$(".info.layerinfo").show();
		var layer = e.target;
		var feature = layer.feature;
		var notShownProperties = ['xxx'];

		// add lat/lng properties
		feature.properties['lat,lng'] = feature.geometry.coordinates[1].toFixed(4) + ',' + feature.geometry.coordinates[0].toFixed(4);

		var source = $("#popover-feature-content-template").html();
		var template = Handlebars.compile(source);
		var html = template({
			'featureObject': feature.properties,
			'notShownProperties': notShownProperties
		});

		highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStylePoint));

		info.update(html);
		initTranslate();
	};

};

function showPopupClickPolygon(e) {
	if ($("#optradio_polygon_click").prop('checked')) {
		$(".info.layerinfo").show();
		var layer = e.target;
		var feature = layer.feature;
		var notShownProperties = ['NAME_0'];

		// change digits count for 'radon_mean'
		feature.properties['radon_mean'] = feature.properties['radon_mean'].toFixed(2);

		var source = $("#popover-feature-content-template").html();
		var template = Handlebars.compile(source);
		var html = template({
			'featureObject': feature.properties,
			'notShownProperties': notShownProperties
		});

		highlight.clearLayers().addLayer(L.geoJson(feature.geometry, highlightStylePolygon));

		info.update(html);
		initTranslate();
	};
};

function showPopupMouseoverPolygon(e) {
	if ($("#optradio_polygon_mouseover").prop('checked')) {
		$(".info.layerinfo").show();
		var layer = e.target;
		var feature = layer.feature;
		var notShownProperties = ['NAME_0'];

		// change digits count for 'radon_mean'
		feature.properties['radon_mean'] = feature.properties['radon_mean'].toFixed(2);

		var source = $("#popover-feature-content-template").html();
		var template = Handlebars.compile(source);
		var html = template({
			'featureObject': feature.properties,
			'notShownProperties': notShownProperties
		});

		highlight.clearLayers().addLayer(L.geoJson(feature.geometry, highlightStylePolygon));

		info.update(html);
		initTranslate();
	};
};


// Define Base Layers
// https://leaflet-extras.github.io/leaflet-providers/preview/
var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
	ext: 'png'
});

var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
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
var map = new L.map('map', {
	center: [40.416775, -3.703790],
	zoom: 6,
	layers: [OpenStreetMap_Mapnik, highlight],
	loadingControl: true
});

// add scale control
var scale = L.control.scale().addTo(map);

// add sidebar control
var sidebar = L.control.sidebar('sidebar').addTo(map);

// define Stations layer: Spain_CSN, Spain_CIEMAT, Eurdep
// https://github.com/mapbox/leaflet-omnivore
// https://github.com/hiasinho/Leaflet.vector-markers
// https://jsfiddle.net/qkvo7hav/7/

var allPointsLG = L.layerGroup();

var layer_Spain_CSN = L.layerGroup();
var layer_Spain_CIEMAT = L.layerGroup();
var layer_Eurdep = L.layerGroup();


// Creates a Marker Cluster Group
var mcg = L.markerClusterGroup.layerSupport().addTo(map);

var stationsMetaData = {};

// worker for update stationsMetaData object from meta.csv every 'n' ms
(function worker() {
	console.time("loading meta.csv");
	$.ajax({
		url: 'data/meta.csv',
		cache: false,
		success: function (csv) {
			csv2geojson.csv2geojson(csv, {
				latfield: 'latitude',
				lonfield: 'longitude',
				delimiter: ';'
			}, function (err, data) {
				stationsMetaData = data;
				console.log('meta.csv loaded. count: ' + stationsMetaData['features'].length);
			});
		},
		complete: function () {
			setTimeout(worker, 1800000);
			//setTimeout(worker, 5000);
		}
	});
	console.timeEnd("loading meta.csv");
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
					iconColor: '#000000',
					popupAnchor: [0, -46]
				}),
				title: feature.properties.name,
				riseOnHover: true
			});
		},
		onEachFeature: function (feature, layer) {
			layer.on({
				click: showPopupClickPoint,
				mouseover: showPopupMouseoverPoint
			});
		}
	})
};


function initStations(stationsMetaData) {
	mcg.clearLayers();

	// layer_Spain_CSN.clearLayers();
	// layer_Spain_CIEMAT.clearLayers();
	// layer_Eurdep.clearLayers();
	// allPointsLG.addTo(map);

	var layer_geojson_Spain_CSN = geoJsonLayer('Spain_CSN');
	layer_geojson_Spain_CSN.addData(stationsMetaData);
	layer_Spain_CSN.addLayer(layer_geojson_Spain_CSN);

	var layer_geojson_Spain_CIEMAT = geoJsonLayer('Spain_CIEMAT');
	layer_geojson_Spain_CIEMAT.addData(stationsMetaData);
	layer_Spain_CIEMAT.addLayer(layer_geojson_Spain_CIEMAT);

	var layer_geojson_Eurdep = geoJsonLayer('Eurdep');
	layer_geojson_Eurdep.addData(stationsMetaData);
	layer_Eurdep.addLayer(layer_geojson_Eurdep);
};

var geojsonCCAA = new L.GeoJSON.AJAX('data/ccaa.json', {
	style: function (feature) {
		return {
			color: '#000000',
			weight: 2
		};
	},
	onEachFeature: function (feature, layer) {
		if (feature.properties && feature.properties.radon_mean) {
			var radon_mean = feature.properties.radon_mean;
			layer.setStyle({
				fillColor: getColor(radon_mean),
				fillOpacity: 0.5
			});
		};
		layer.on({
			click: showPopupClickPolygon,
			mouseover: showPopupMouseoverPolygon,
			mouseout: function (e) {
				geojsonCCAA.setStyle({
					color: '#000000',
					weight: 2
				});
			}
		});
	}
});

var geojsonProvincias = new L.GeoJSON.AJAX('data/provincias.json', {
	style: function (feature) {
		return {
			color: '#0000ff',
			weight: 2
		};
	},
	onEachFeature: function (feature, layer) {
		if (feature.properties && feature.properties.radon_mean) {
			var radon_mean = feature.properties.radon_mean;
			layer.setStyle({
				fillColor: getColor(radon_mean),
				fillOpacity: 0.5
			});
		};
		layer.on({
			click: showPopupClickPolygon,
			mouseover: showPopupMouseoverPolygon,
			mouseout: function (e) {
				geojsonProvincias.setStyle({
					color: '#0000ff',
					weight: 2
				});
			}
		});
	}
});

var geojsonZonas = new L.GeoJSON.AJAX('data/zona.json', {
	style: function (feature) {
		return {
			color: '#808080',
			weight: 2
		};
	},
	onEachFeature: function (feature, layer) {
		if (feature.properties && feature.properties.radon_mean) {
			var radon_mean = feature.properties.radon_mean;
			layer.setStyle({
				fillColor: getColor(radon_mean),
				fillOpacity: 0.5
			});
		};
		layer.on({
			click: showPopupClickPolygon,
			mouseover: showPopupMouseoverPolygon,
			mouseout: function (e) {
				geojsonZonas.setStyle({
					color: '#808080',
					weight: 2
				});
			}
		});
	}
});


//Checking in the 'sub groups'
mcg.checkIn([
	layer_Spain_CSN,
	layer_Spain_CIEMAT,
	layer_Eurdep
]);

var baseLayers = {
	"OpenStreetMap": OpenStreetMap_Mapnik,
	"Water color": Stamen_Watercolor,
	"OpenTopoMap": OpenTopoMap,
	"Bing Aerial": BingAerial
};


var layerControl = L.control.groupedLayers(baseLayers, null, {
	collapsed: false
}).addTo(map);

layerControl.addOverlay(allPointsLG, "All / none", "Stations");
layerControl.addOverlay(layer_Spain_CSN, "Spain CSN", "Stations");
layerControl.addOverlay(layer_Spain_CIEMAT, "Spain CIEMAT", "Stations");
layerControl.addOverlay(layer_Eurdep, "Eurdep", "Stations");


layerControl.addOverlay(geojsonCCAA, "CCAA", "Layers");
layerControl.addOverlay(geojsonProvincias, "Provincias", "Layers");
layerControl.addOverlay(geojsonZonas, "Zonas", "Layers");


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
			if (!map.hasLayer(layer_Eurdep)) {
				layer_Eurdep.addTo(map);
			};
		};
		if (map.hasLayer(layer_Spain_CSN) && map.hasLayer(layer_Spain_CIEMAT) && map.hasLayer(layer_Eurdep)) {
			map.addLayer(allPointsLG);
		};
	};

	if (event.type === "overlayremove") {
		if (layer === allPointsLG) {
			map.removeLayer(layer_Spain_CSN);
			map.removeLayer(layer_Spain_CIEMAT);
			map.removeLayer(layer_Eurdep);
		};
		if (!map.hasLayer(layer_Spain_CSN) && !map.hasLayer(layer_Spain_CIEMAT) && !map.hasLayer(layer_Eurdep)) {
			map.removeLayer(allPointsLG);
		};
	};

	layerControl._update();
	$('.leaflet-control-layers-base').prepend('&nbsp<b tkey="baselayers">Base Layers</b>');
});





// overlayadd&overlayremove legends events
map.on('overlayadd overlayremove', function (e) {
	if (map.hasLayer(geojsonCCAA) || map.hasLayer(geojsonProvincias) || map.hasLayer(geojsonZonas) || map.hasLayer(layer_Spain_CSN) || map.hasLayer(layer_Spain_CIEMAT) || map.hasLayer(layer_Eurdep)) {
		$('#legend-layers').show();
	};

	if (!map.hasLayer(geojsonCCAA) && !map.hasLayer(geojsonProvincias) && !map.hasLayer(geojsonZonas) && !map.hasLayer(layer_Spain_CSN) && !map.hasLayer(layer_Spain_CIEMAT) && !map.hasLayer(layer_Eurdep)) {
		$('#legend-layers').hide();
	};

	if (map.hasLayer(geojsonCCAA) || map.hasLayer(geojsonProvincias) || map.hasLayer(geojsonZonas)) {
		$('#opacity-control').css('display', 'flex');
	} else {
		$('#opacity-control').css('display', 'none');
	};
});


// overlay layer opacity control
$('#rangeSliderForOverlayLayers').slider({});
$('#rangeSliderForOverlayLayers').on("slide", function (e) {
	$("#overlayOpacityVal").text(e.value);
});

// disable map dragging
$('#opacity-control > div > div.slider-handle.min-slider-handle.round').mousedown(function () {
	map.dragging.disable();
});
$('#opacity-control > div > div.slider-handle.min-slider-handle.round').mouseleave(function () {
	map.dragging.enable();
});

// update vector layer opacity
function updateOverlayLayersOpacity(value) {
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

// base layer opacity control
$('#rangeSliderForBaseLayers').slider({});
$('#rangeSliderForBaseLayers').on("slide", function (e) {
	$("#baseOpacityVal").text(e.value);
});

// update base layer opacity
function updateBaseLayersOpacity(value) {
	if (map.hasLayer(OpenStreetMap_Mapnik)) {
		OpenStreetMap_Mapnik.setOpacity(value / 100);
	};
	if (map.hasLayer(Stamen_Watercolor)) {
		Stamen_Watercolor.setOpacity(value / 100);
	};
	if (map.hasLayer(OpenTopoMap)) {
		OpenTopoMap.setOpacity(value / 100);
	};
	if (map.hasLayer(BingAerial)) {
		BingAerial.setOpacity(value / 100);
	};
};

// document ready event
$(document).ready(function () {

	setTimeout(function () {
		initStations(stationsMetaData);
		allPointsLG.addTo(map);
	}, 500);

	// add logo
	var mapControlsContainer = $('.leaflet-top.leaflet-left > .leaflet-control');
	var logoContainer = $('#logo-container');
	mapControlsContainer.append(logoContainer);

	// change Leaflet Control.Layers view
	$('.leaflet-control-layers-base').prepend('&nbsp<b tkey="baselayers">Base Layers</b>');
	//$('.leaflet-control-layers-overlays').prepend('<b tkey="layers">Layers:</b>');
	$('.leaflet-control-layers-overlays').prependTo('.leaflet-control-layers-list');
	$('.leaflet-control-layers-base').appendTo('.leaflet-control-layers-list');

});


// info control
var info = L.control({
	position: 'bottomleft'
});

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info layerinfo');
	this.update();
	return this._div;
};

info.update = function (content) {
	this._div.innerHTML = "<p class='header-info' tkey='information'>Information:</p><a id='some_id' class='leaflet-popup-close-button' href='#' onclick='return hideInfo();'>×</a>" + content;
};

info.addTo(map);

$(".info.layerinfo").hide();

function hideInfo() {
	$(".info.layerinfo").hide();
};

map.on("click", function (e) {
	highlight.clearLayers();
	$(".info.layerinfo").hide();
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



//legend-color-ranges selector
$(".switch-field.color-selector").change(function (e) {
	var value = e.target.value;
	// change legend color range
	if (value === 'colorRange1') { // colorRange1
		colorRange = colorRange1;
	} else if (value === 'colorRange2') { // colorRange2
		colorRange = colorRange2;
	} else { // colorRange3
		colorRange = colorRange3;
	};

	// update style for point layer
	//initStations(stationsMetaData);

	// change polygon layer style
	geojsonCCAA.eachLayer(function (layer) {
		var radon_mean = layer.feature.properties.radon_mean;
		layer.setStyle({
			fillColor: getColor(radon_mean)
		});
	});
	geojsonProvincias.eachLayer(function (layer) {
		var radon_mean = layer.feature.properties.radon_mean;
		layer.setStyle({
			fillColor: getColor(radon_mean)
		});
	});
	geojsonZonas.eachLayer(function (layer) {
		var radon_mean = layer.feature.properties.radon_mean;
		layer.setStyle({
			fillColor: getColor(radon_mean)
		});
	});

	var source = $("#legend-layers-template").html();
	var template = Handlebars.compile(source);
	var html = template({
		'colorRange': colorRange
	});

	if (map.hasLayer(geojsonCCAA) || map.hasLayer(geojsonProvincias) || map.hasLayer(geojsonZonas) || map.hasLayer(layer_Spain_CSN) || map.hasLayer(layer_Spain_CIEMAT) || map.hasLayer(layer_Eurdep)) {
		$("#legend-layers").remove();
		$(".info.legend.leaflet-control").append(html);
	};

	// change text color in '.color-block'
	if (value === 'colorRange2') {
		$("#legend-layers>div>div>.color-block").css('color', '#FFFFFF');
	} else {
		$("#legend-layers>div>div>.color-block").css('color', '#000000');
	};
});