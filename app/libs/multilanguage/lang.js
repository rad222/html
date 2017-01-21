var langs = ['es', 'en'];
var langCode = '';
var langJS = null;

var translate = function (jsdata) {
	$("[tkey]").each(function (index) {
		var strTr = jsdata[$(this).attr('tkey')];
		$(this).html(strTr);
	});
}

langCode = navigator.language.substr(0, 2);

function initTranslate() {
	if (langCode == 'es')
		//$.getJSON('libs/multilanguage/lang/'+langCode+'.json', translate);
		$.getJSON('libs/multilanguage/lang/es.json', translate);
	else
		$.getJSON('libs/multilanguage/lang/en.json', translate);
};

initTranslate();