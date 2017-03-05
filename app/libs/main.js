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


// markers, polygons and legend color range style
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

var colorRange = colorRange1; // define global colorRange variable


function getColor(radon_mean) {
	for (var i = 0; i < colorRange.length; i++) {
		if (radon_mean >= colorRange[i].min && radon_mean < colorRange[i].max) {
			return colorRange[i].color;
		} else if (radon_mean === 'nan') {
			return 'white';
		}
	}
};

// highlight layer for point & polygon overlay layer
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

// stations popup events
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


// polygons popup events
function showPopupClickPolygon(e) {
	if ($("#optradio_polygon_click").prop('checked')) {
		$(".info.layerinfo").show();
		var layer = e.target;
		var feature = layer.feature;
		var notShownProperties = ['NAME_0'];

		// change digits count for 'radon_mean'
		feature.properties['radon_mean'] = +feature.properties['radon_mean'].toFixed(2);

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
		feature.properties['radon_mean'] = +feature.properties['radon_mean'].toFixed(2);

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


// define map base layers
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

// map initialization
var map = new L.map('map', {
	center: [40.416775, -3.703790],
	zoom: 6,
	layers: [OpenStreetMap_Mapnik, highlight],
	loadingControl: true
});

// add Leaflet scale control
L.control.scale().addTo(map);
// add Leaflet sidebar control
L.control.sidebar('sidebar').addTo(map);
// add Leaflet Geocoder control
var geocoder = L.Control.geocoder({
	position: 'topleft',
	placeholder: 'Search...'
}).addTo(map);

// define polygonal layers
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

var baseLayers = {
	"OpenStreetMap": OpenStreetMap_Mapnik,
	"Water color": Stamen_Watercolor,
	"OpenTopoMap": OpenTopoMap,
	"Bing Aerial": BingAerial
};


var layerControl = L.control.groupedLayers(baseLayers, null, {
	collapsed: false
}).addTo(map);

layerControl.addOverlay(geojsonCCAA, "CCAA", "Layers");
layerControl.addOverlay(geojsonProvincias, "Provincias", "Layers");
layerControl.addOverlay(geojsonZonas, "Zonas", "Layers");


// var overlayLayerObject = {};
// // add polygonal overlay layers to overlayLayerObject
// overlayLayerObject['geojsonCCAA'] = geojsonCCAA;
// overlayLayerObject['geojsonProvincias'] = geojsonProvincias;
// overlayLayerObject['geojsonZonas'] = geojsonZonas;


// ----------------------------------------------------------------------------------------------


// define stations GeoJSON data from meta.csv
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


var clusterType = 'average';

// define stations markercluster group
var stationsMCG = L.markerClusterGroup.layerSupport({
	iconCreateFunction: function (cluster) {

		if (clusterType === 'average') {
			// average marcercluster value with legend color
			var children = cluster.getAllChildMarkers();
			var childCount = cluster.getChildCount();

			var c = ' marker-cluster-';
			if (childCount < 10) {
				c += 'small';
			} else if (childCount < 100) {
				c += 'medium';
			} else {
				c += 'large';
			};

			var sum = 0;
			for (var i = 0; i < children.length; i++) {
				var val = isNaN(parseFloat(children[i].feature.properties.value)) ? 0 : parseFloat(children[i].feature.properties.value);
				sum += val;
			};

			var average = sum / childCount;
			average = Math.round(average); // round
			var color = getColor(average);

			return new L.DivIcon({
				html: '<div style="background-color:' + color + '; border: 1px solid #000000; border-color: rgba(0,0,0,0.4);"><span>' + average + '</span></div>',
				className: 'marker-cluster',
				iconSize: new L.Point(40, 40)
			});
		};

		if (clusterType === 'max') {
			// maximum marcercluster value with legend color
			var children = cluster.getAllChildMarkers();
			var childCount = cluster.getChildCount();

			var c = ' marker-cluster-';
			if (childCount < 10) {
				c += 'small';
			} else if (childCount < 100) {
				c += 'medium';
			} else {
				c += 'large';
			};

			var valArray = [];
			for (var i = 0; i < children.length; i++) {
				var val = isNaN(parseFloat(children[i].feature.properties.value)) ? 0 : parseFloat(children[i].feature.properties.value);
				valArray.push(val);
			};

			var max_val = Math.max(...valArray);
			max_val = Math.round(max_val); // round
			var color = getColor(max_val);

			return new L.DivIcon({
				html: '<div style="background-color:' + color + '; border: 1px solid #000000; border-color: rgba(0,0,0,0.4);"><span>' + max_val + '</span></div>',
				className: 'marker-cluster',
				iconSize: new L.Point(40, 40)
			});
		};

		/*
				if (clusterType === 'count') {
					// default marcercluster
					var childCount = cluster.getChildCount();

					var c = ' marker-cluster-';
					if (childCount < 10) {
						c += 'small';
					} else if (childCount < 100) {
						c += 'medium';
					} else {
						c += 'large';
					};

					return new L.DivIcon({
						html: '<div><span>' + childCount + '</span></div>',
						className: 'marker-cluster' + c,
						iconSize: new L.Point(40, 40)
					});

				};
		*/

	}
}).addTo(map);

function initStations() {
	setTimeout(() => {
		var categories = {},
			category;

		console.time("init allStations");

		var allStations = L.geoJson(null, {
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
				// define click and mouseover events
				layer.on({
					click: showPopupClickPoint,
					mouseover: showPopupMouseoverPoint
				});

				// define stations layer category
				category = feature.properties.id_network;
				if (typeof categories[category] === "undefined") {
					categories[category] = [];
				};
				categories[category].push(layer);
			}
		});
		allStations.addData(stationsMetaData);

		console.timeEnd("init allStations");

		updateOverlaysObj(categories);

	}, 700);
};

var overlaysObj = {};
var allStationsLG = L.layerGroup();


function updateOverlaysObj(categories) {
	stationsMCG.clearLayers();
	allStationsLG.clearLayers();

	overlaysObj["All / none"] = allStationsLG;

	for (var categoryName in overlaysObj) {
		layerControl.removeLayer(overlaysObj[categoryName]);
		overlaysObj[categoryName].clearLayers();
	};

	var categoryName,
		categoryArray,
		categoryLG;

	for (categoryName in categories) {
		categoryArray = categories[categoryName];
		categoryLG = L.layerGroup(categoryArray);
		categoryLG.categoryName = categoryName;
		overlaysObj[categoryName] = categoryLG;

		// add stations overlay layers to overlayLayerObject
		//overlayLayerObject[categoryName] = categoryLG;
	};
	initStationsLayerControl(overlaysObj)
};




function initStationsLayerControl(overlaysObj) {

	// add layers to layerControl
	for (var categoryName in overlaysObj) {
		layerControl.addOverlay(overlaysObj[categoryName], categoryName, "Stations");
	};


	var stationStamps = [];
	for (var categoryName in overlaysObj) {
		if (categoryName !== "All / none") {
			stationStamps.push(overlaysObj[categoryName]);
		};
	};
	stationsMCG.checkIn(stationStamps);

	map.removeLayer(allStationsLG);
	map.addLayer(allStationsLG);
};



// overlayadd overlayremove for stations layer
map.on("overlayadd overlayremove", function (event) {

	var layer = event.layer,
		layerCategory;
	if (layer === allStationsLG) {
		if (layer.notUserAction) {
			layer.notUserAction = false;
			return;
		};
		for (var categoryName in overlaysObj) {
			if (categoryName !== "All / none") {
				if (event.type === "overlayadd") {
					overlaysObj[categoryName].addTo(map);
				} else {
					map.removeLayer(overlaysObj[categoryName]);
				};
			};
		};
		layerControl._update();
	} else if (layer.categoryName && layer.categoryName in overlaysObj) {
		if (event.type === "overlayadd") {
			for (var categoryName in overlaysObj) {
				layerCategory = overlaysObj[categoryName];
				if (categoryName !== "All / none" && !layerCategory._map) {
					return;
				};
			};
			allStationsLG.addTo(map);
			layerControl._update();
		} else if (event.type === "overlayremove" && allStationsLG._map) {
			allStationsLG.notUserAction = true;
			map.removeLayer(allStationsLG);
			layerControl._update();
		};
	};
	// change order Stations and Layers groups
	$("#leaflet-control-layers-group-1").insertAfter("#leaflet-control-layers-group-2");

});

// ----------------------------------------------------------------------------------------------

// overlay layer opacity control
$('#rangeSliderForOverlayLayers').slider({});
$('#rangeSliderForOverlayLayers').on("slide", function (e) {
	$("#overlayOpacityVal").text(e.value);
});

// update polygonal layer opacity
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

// layer (stations and zones) info control
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

	// remove geocoder marker
	map.removeLayer(geocoder._geocodeMarker);

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

	// update style for stations layer
	initStations();

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

	$("#legend-layers").remove();
	$(".info.legend.leaflet-control").append(html);

	// change text color in '.color-block'
	if (value === 'colorRange2') {
		$("#legend-layers>div>div>.color-block").css('color', '#FFFFFF');
	} else {
		$("#legend-layers>div>div>.color-block").css('color', '#000000');
	};
});

//Stations cluster mode selector
$(".switch-field.cluster").change(function (e) {
	var value = e.target.value;

	if (value === 'modeAverage') { // Average value cluster
		clusterType = 'average';
	} else if (value === 'modeMax') { // Max value cluster
		clusterType = 'max';
	};

	// update style for stations layer
	initStations();
});

// document ready event
$(document).ready(function () {
	initStations();

	// add RaViewer logo
	var mapControlsContainer = $('.leaflet-top.leaflet-left > .leaflet-control-zoom');
	var logoContainer = $('#logo-container');
	mapControlsContainer.append(logoContainer);

	// change Leaflet Control.Layers view
	$('.leaflet-control-layers-base').prepend('&nbsp<b tkey="baselayers">Base Layers</b>');
	//$('.leaflet-control-layers-overlays').prepend('<b tkey="layers">Layers:</b>');
	$('.leaflet-control-layers-overlays').prependTo('.leaflet-control-layers-list');
	$('.leaflet-control-layers-base').appendTo('.leaflet-control-layers-list');
});




// ----------------------------------------------------------------------------------------------

// disable map dragging on opacity control
// $('#opacity-control > div > div.slider-handle.min-slider-handle.round').mousedown(function () {
// 	map.dragging.disable();
// });
// $('#opacity-control > div > div.slider-handle.min-slider-handle.round').mouseleave(function () {
// 	map.dragging.enable();
// });


// update legend
// if (map.hasLayer(geojsonCCAA) || map.hasLayer(geojsonProvincias) || map.hasLayer(geojsonZonas)) {
// 	$("#legend-layers").remove();
// 	$(".info.legend.leaflet-control").append(html);
// };


// define Stations layer: Spain_CSN, Spain_CIEMAT, Eurdep
// https://github.com/mapbox/leaflet-omnivore
// https://github.com/hiasinho/Leaflet.vector-markers
// https://jsfiddle.net/qkvo7hav/7/

// var allPointsLG = L.layerGroup();

// var layer_Spain_CSN = L.layerGroup();
// var layer_Spain_CIEMAT = L.layerGroup();
// var layer_Eurdep = L.layerGroup();

// // Creates a Marker Cluster Group
// var mcg = L.markerClusterGroup.layerSupport().addTo(map);

// var stationsMetaData = {};

// // worker for update stationsMetaData object from meta.csv every 'n' ms
// (function worker() {
// 	console.time("loading meta.csv");
// 	$.ajax({
// 		url: 'data/meta.csv',
// 		cache: false,
// 		success: function (csv) {
// 			csv2geojson.csv2geojson(csv, {
// 				latfield: 'latitude',
// 				lonfield: 'longitude',
// 				delimiter: ';'
// 			}, function (err, data) {
// 				stationsMetaData = data;
// 				console.log('meta.csv loaded. count: ' + stationsMetaData['features'].length);
// 			});
// 		},
// 		complete: function () {
// 			setTimeout(worker, 1800000);
// 			//setTimeout(worker, 5000);
// 		}
// 	});
// 	console.timeEnd("loading meta.csv");
// })();

// function geoJsonLayer(type) {
// 	return L.geoJson(null, {
// 		filter: function (feature, layer) {
// 			return feature.properties.id_network === type;
// 		},
// 		pointToLayer: function (feature, latlng) {
// 			return L.marker(latlng, {
// 				icon: L.VectorMarkers.icon({
// 					icon: 'nuclear',
// 					prefix: 'ion',
// 					markerColor: getColor(feature.properties.value),
// 					iconColor: '#000000',
// 					popupAnchor: [0, -46]
// 				}),
// 				title: feature.properties.name,
// 				riseOnHover: true
// 			});
// 		},
// 		onEachFeature: function (feature, layer) {
// 			layer.on({
// 				click: showPopupClickPoint,
// 				mouseover: showPopupMouseoverPoint
// 			});
// 		}
// 	})
// };


// function initStations(stationsMetaData) {
// 	mcg.clearLayers();

// 	// layer_Spain_CSN.clearLayers();
// 	// layer_Spain_CIEMAT.clearLayers();
// 	// layer_Eurdep.clearLayers();
// 	// allPointsLG.addTo(map);

// 	var layer_geojson_Spain_CSN = geoJsonLayer('Spain_CSN');
// 	layer_geojson_Spain_CSN.addData(stationsMetaData);
// 	layer_Spain_CSN.addLayer(layer_geojson_Spain_CSN);

// 	var layer_geojson_Spain_CIEMAT = geoJsonLayer('Spain_CIEMAT');
// 	layer_geojson_Spain_CIEMAT.addData(stationsMetaData);
// 	layer_Spain_CIEMAT.addLayer(layer_geojson_Spain_CIEMAT);

// 	var layer_geojson_Eurdep = geoJsonLayer('Eurdep');
// 	layer_geojson_Eurdep.addData(stationsMetaData);
// 	layer_Eurdep.addLayer(layer_geojson_Eurdep);
// };


//Checking in the 'sub groups'
// mcg.checkIn([
// 	layer_Spain_CSN,
// 	layer_Spain_CIEMAT,
// 	layer_Eurdep
// ]);


// layerControl.addOverlay(allPointsLG, "All / none", "Stations");
// layerControl.addOverlay(layer_Spain_CSN, "Spain CSN", "Stations");
// layerControl.addOverlay(layer_Spain_CIEMAT, "Spain CIEMAT", "Stations");
// layerControl.addOverlay(layer_Eurdep, "Eurdep", "Stations");


// add check/uncheck functionality for Stations layer
// map.on("overlayadd overlayremove", function (event) {
// 	var layer = event.layer;

// 	if (event.type === "overlayadd") {
// 		if (layer === allPointsLG) {
// 			if (!map.hasLayer(layer_Spain_CSN)) {
// 				layer_Spain_CSN.addTo(map);
// 			};
// 			if (!map.hasLayer(layer_Spain_CIEMAT)) {
// 				layer_Spain_CIEMAT.addTo(map);
// 			};
// 			if (!map.hasLayer(layer_Eurdep)) {
// 				layer_Eurdep.addTo(map);
// 			};
// 		};
// 		if (map.hasLayer(layer_Spain_CSN) && map.hasLayer(layer_Spain_CIEMAT) && map.hasLayer(layer_Eurdep)) {
// 			map.addLayer(allPointsLG);
// 		};
// 	};

// 	if (event.type === "overlayremove") {
// 		if (layer === allPointsLG) {
// 			map.removeLayer(layer_Spain_CSN);
// 			map.removeLayer(layer_Spain_CIEMAT);
// 			map.removeLayer(layer_Eurdep);
// 		};
// 		if (!map.hasLayer(layer_Spain_CSN) && !map.hasLayer(layer_Spain_CIEMAT) && !map.hasLayer(layer_Eurdep)) {
// 			map.removeLayer(allPointsLG);
// 		};
// 	};

// 	layerControl._update();
// 	$('.leaflet-control-layers-base').prepend('&nbsp<b tkey="baselayers">Base Layers</b>');
// });