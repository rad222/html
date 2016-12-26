'use strict';

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var source = $("#legend-layers-template").html();
    var template = Handlebars.compile(source);
    var html = template({'colorRange': colorRange});
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += html;

    return div;
};
legend.addTo(map);


map.on('overlayadd', function (e) {
    $('#legend-layers').show();
});
map.on('overlayremove', function (e) {
    if (!map.hasLayer(geojsonCCAA) && !map.hasLayer(geojsonProvincias) && !map.hasLayer(geojsonZonas) && !map.hasLayer(stationLayer)) {
        $('#legend-layers').hide();
    }
});