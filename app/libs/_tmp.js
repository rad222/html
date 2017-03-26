
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