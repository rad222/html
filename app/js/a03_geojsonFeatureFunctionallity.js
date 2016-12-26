'use strict';

var colorRange = [
    {min: 0, max: 5, color: '#A6F9FF'},
    {min: 5, max: 6, color: '#05FDFF'},
    {min: 6, max: 7, color: '#37C79C'},
    {min: 7, max: 8, color: '#00FF09'},
    {min: 8, max: 9, color: '#8EFF03'},
    {min: 9, max: 10, color: '#96CC34'},
    {min: 10, max: 11, color: '#CAFF64'},
    {min: 11, max: 12, color: '#FCFE8B'},
    {min: 12, max: 13, color: '#FFFD74'},
    {min: 13, max: 14, color: '#FFFF08'},
    {min: 14, max: 15, color: '#FCCE00'},
    {min: 15, max: 16, color: '#FF9765'},
    {min: 16, max: 17, color: '#FF9735'},
    {min: 17, max: 18, color: '#FF6400'},
    {min: 18, max: 19, color: '#CA6836'},
    {min: 19, max: 20, color: '#D23003'},
    {min: 20, max: 21, color: '#F60400'},
    {min: 21, max: 25, color: '#9E0005'},
    {min: 25, max: 30, color: '#CD326C'}
];

function getColor(radon_mean) {

    for (var i = 0; i < colorRange.length; i++) {
        if (radon_mean >= colorRange[i].min && radon_mean < colorRange[i].max) {
            return colorRange[i].color;
        } else if (radon_mean == 'nan') {
			return 'white';
		}
    }
}

function onMouseOver(e) {
    var layer = e.target;
    var feature = layer.feature;
    var notShownProperties = ['ISO', 'ID_0', 'ID_1', 'NAME_0', 'NAME_1', 'HASC_1', 'CCN_1', 'CCA_1', 'TYPE_1', 'ENGTYPE_1', 'NL_NAME_1', 'VARNAME_1'];

    var source = $("#popover-feature-content-template").html();
    var template = Handlebars.compile(source);
    var html = template({'featureObject': feature.properties, 'notShownProperties': notShownProperties});


    var popup = L.popup()
        .setLatLng(e.latlng)
        .setContent(html)
        .openOn(map);

}

var onEachFeature = function (feature, layer) {
    if (feature.properties && feature.properties.radon_mean) {
        var radon_mean = feature.properties.radon_mean;
        layer.setStyle({
            fillColor: getColor(radon_mean)
        });
    }
    ;
    layer.on({
        mouseover: onMouseOver,
        // mouseout: resetHighlight,
        // click: zoomToFeature
    });
};