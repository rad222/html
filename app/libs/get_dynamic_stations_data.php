<?php
	
	ini_set('memory_limit', '256M');
	
	$sdate = $_REQUEST['sdate'];
	$country = $_REQUEST['country'];
	$alt_min = $_REQUEST['alt_min'];
	$alt_max = $_REQUEST['alt_max'];
	$val_min = $_REQUEST['val_min'];
	$val_max = $_REQUEST['val_max'];
		
	$db = new PDO('sqlite:../data/stations.db');
	
	if($country == 'All countries')
	{
		$sql_query = 'SELECT date, id_station, \'Network\' AS id_network, latitude AS lat, longitude AS lon, altitude, country, area_adm_1, area_adm_2, area_adm_3, name, value, value_max FROM stable WHERE date = "'.$sdate.'" AND altitude >= '.$alt_min.' AND altitude <= '.$alt_max.' AND value >= '.$val_min.' AND value <= '.$val_max;
	} else {
		$sql_query = 'SELECT date, id_station, \'Network\' AS id_network, latitude AS lat, longitude AS lon, altitude, country, area_adm_1, area_adm_2, area_adm_3, name, value, value_max FROM stable WHERE date = "'.$sdate.'" AND country = "'.$country.'" AND altitude >= '.$alt_min.' AND altitude <= '.$alt_max.' AND value >= '.$val_min.' AND value <= '.$val_max;
	}

	$result = $db->query($sql_query);
	
	if (!$result) {
		echo "An SQL error occured.\n";
		exit;
	}	
	
	$data = array();
	while($r = $result->fetch(PDO::FETCH_ASSOC)) {
		$data[] = $r;
	}
	
	print json_encode($data);

	$db = NULL;
	
?>