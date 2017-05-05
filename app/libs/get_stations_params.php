<?php
	
	$db = new PDO('sqlite:../data/stations.db');
	
	$sql_sdates = "SELECT date AS sdate FROM stable GROUP BY date ORDER BY date;";
	$result_sdates = $db->query($sql_sdates);
	
	$sql_country = "SELECT country FROM stable GROUP BY country ORDER BY country;";
	$result_country = $db->query($sql_country);	
	
	$sql_altitude = "SELECT MIN(altitude) AS min, MAX(altitude) AS max FROM stable WHERE altitude != -9999;";
	$result_altitude = $db->query($sql_altitude);
	
	$sql_value = "SELECT MIN(value) AS min, MAX(value) AS max FROM stable WHERE value < 50;";
	$result_value = $db->query($sql_value);
	
	if (!$result_sdates and !$result_country and !$result_altitude and !$result_value) {
		echo "An SQL error occured.\n";
		exit;
	}

	$array_sdates = array();
	while($r = $result_sdates->fetch(PDO::FETCH_ASSOC)) {
		$array_sdates[] = $r['sdate'];
	}
	
	$array_country = array();
	while($r = $result_country->fetch(PDO::FETCH_ASSOC)) {
		$array_country[] = $r['country'];
	}
	
	$array_altitude = array();
	while($r = $result_altitude->fetch(PDO::FETCH_ASSOC)) {
		$array_altitude = array('min' => $r['min'], 'max' => $r['max']);
	}

	$array_value = array();
	while($r = $result_value->fetch(PDO::FETCH_ASSOC)) {
		$array_value = array('min' => $r['min'], 'max' => $r['max']);
	}
		
	$data = array('sdate' => $array_sdates, 'country' => $array_country, 'altitude' => $array_altitude, 'value' => $array_value);
	print json_encode($data);

	$db = NULL;
	
?>