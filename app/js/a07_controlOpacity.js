'use strict';

$('#rangeSliderForVektorLayers').slider({
    formatter: function (value) {
        return 'Current value: ' + value;
    }
});

function updateVektorLayersOpacity(value) {
    geojsonCCAA.setStyle({fillOpacity: value / 100});
    geojsonProvincias.setStyle({fillOpacity: value / 100});
    geojsonZonas.setStyle({fillOpacity: value / 100});
}