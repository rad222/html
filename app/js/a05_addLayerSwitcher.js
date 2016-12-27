'use strict';

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
      getTileUrl: function(tilePoint) {
          this._adjustTilePoint(tilePoint);
          return L.Util.template(this._url, {
              s: this._getSubdomain(tilePoint),
              q: this._quadKey(tilePoint.x, tilePoint.y, this._getZoomForUrl())
          });
      },
      _quadKey: function(x, y, z) {
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

// https://github.com/mapbox/leaflet-omnivore
// https://github.com/hiasinho/Leaflet.vector-markers

var stationLayerGeojson = L.geoJson(null, {
    pointToLayer: function(feature, latlng) {
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
    onEachFeature: function(feature, layer) {
        layer.on({
            click: onMouseOver
        });
    }
});


var stationLayer = omnivore.csv('data/meta.csv', {
    latfield: 'latitude',
    lonfield: 'longitude',
    delimiter: ';'
}, stationLayerGeojson);


var geojsonCCAA = new L.GeoJSON.AJAX('data/ccaa.json', {
    onEachFeature: onEachFeature
});
var geojsonProvincias = new L.GeoJSON.AJAX('data/provincias.json', {
    onEachFeature: onEachFeature
});
var geojsonZonas = new L.GeoJSON.AJAX('data/zona.json', {
    onEachFeature: onEachFeature
});

var overlayMaps = {
    "Stations": stationLayer,
    "CCAA": geojsonCCAA,
    "Provincias": geojsonProvincias,
    "Zonas": geojsonZonas
};

L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
}).addTo(map);

$(document).ready(function() {
    // change Leaflet Control.Layers view
    $('.leaflet-control-layers-base').prepend('<b>Base:</b>');
    $('.leaflet-control-layers-overlays').prepend('<b>Layers:</b>');
    $('.leaflet-control-layers-overlays').prependTo('.leaflet-control-layers-list');
    $('.leaflet-control-layers-base').appendTo('.leaflet-control-layers-list');
	
	// define default layers
	stationLayer.addTo(map);
	$('#legend-layers').show();
});