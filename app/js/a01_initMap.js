'use strict';

var OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var map = L.map('map', {
    center: [40.416775, -3.703790],
    zoom: 6,
    layers: [OpenStreetMap_Mapnik]
});

L.control.scale().addTo(map);
