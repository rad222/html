//$.getJSON("libs/get_stations_params.php", function (data) {
//	console.log(data)
//});

//$.get("libs/get_stations_params.php").done(function(data){
//    console.log(data)
//});



var sdate = "2017-04-14";
var country = "Austria";
//var country = "all_countries";
var alt_min = -80.8;
var alt_max = 3511.1;
var val_min = 0;
var val_max = 52.9;


var dataString = 'sdate='+ sdate + '&country=' + country + '&alt_min=' + alt_min + '&alt_max=' + alt_max + '&val_min=' + val_min + '&val_max=' + val_max;
$.ajax({
  type: "POST",
  url: "libs/get_stations_data.php",
  data: dataString,
  success: function(data) {
	console.log(data);
  }
});


