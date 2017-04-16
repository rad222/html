$.getJSON("libs/get_stations_params.php", function (data) {
	console.log(data)
});


$.get("libs/get_stations_params.php").done(function(data){
    console.log(data)
});