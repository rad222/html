#!/usr/bin/env python

# python ~/html/scripts/stations/csv_to_sqlite.py

# sudo apt-get install sqlite

import os
import logging
import sqlite3

# http://proft.me/2009/05/21/python-i-baza-dannyh-sqlite/
# https://docs.python.org/2/library/sqlite3.html

# base dir
base_dir = os.path.realpath(os.path.dirname(__file__))

# logger
logger = logging.getLogger('myapp')
hdlr = logging.FileHandler(os.path.join(base_dir, "stations.log"))
formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
hdlr.setFormatter(formatter)
logger.addHandler(hdlr) 
logger.setLevel(logging.INFO)

# create 'stations.db' with stations table 'stable'
def initStationsDatabase():
	con = sqlite3.connect(os.path.join(base_dir, "outputs/stations.db"))
	cur = con.cursor()
	
	'''
	date;id_station;id_network;type;latitude;longitude;altitude;country;area_adm_1;area_adm_2;area_adm_3;name;value;value_max
	03/04/17 15:00;AT0001;Eurdep;air;48.73;16.39;180.3;Austria;Baja Austria;Distrito de Mistelbach;;Laa/Thaya;8.2;8.6
	
	- id INTEGER PRIMARY KEY
	- date VARCHAR(14)
	- id_station VARCHAR(10)
	- id_network VARCHAR(10)
	- type VARCHAR(10)
	- latitude DECIMAL(10,2)
	- longitude DECIMAL(10,2)
	- altitude DECIMAL(10,1)
	- country VARCHAR(50)
	- area_adm_1 VARCHAR(100)
	- area_adm_2 VARCHAR(100)
	- area_adm_3 VARCHAR(100)
	- name VARCHAR(100)
	- value DECIMAL(10,1)
	- value_max DECIMAL(10,1)
	'''
	# drop 'stable' table if exists	
	cur.execute('DROP TABLE IF EXISTS stable;')
	con.commit()	
	
	# create 'stable' table 
	cur.execute('CREATE TABLE stable (id INTEGER PRIMARY KEY, date VARCHAR(14), id_station VARCHAR(10), id_network VARCHAR(10), type VARCHAR(10), latitude DECIMAL(10,2), longitude DECIMAL(10,2), altitude DECIMAL(10,1), country VARCHAR(50), area_adm_1 VARCHAR(100), area_adm_2 VARCHAR(100), area_adm_3 VARCHAR(100), name VARCHAR(100), value DECIMAL(10,1), value_max DECIMAL(10,1))')
	con.commit()
	
	# insert test data to 'stable' table
	#cur.execute('INSERT INTO stable (id, date, id_station, id_network, type, latitude, longitude, altitude, country, area_adm_1, area_adm_2, area_adm_3, name, value, value_max) VALUES(NULL, "03/04/17 15:00", "AT0001", "Eurdep", "air", 48.73, 16.39, 180.3, "Austria", "Baja Austria", "Distrito de Mistelbach", "", "Laa/Thaya", 8.2, 8.6)')
	#con.commit()
	#print cur.lastrowid

	# print test data from 'stable' table
	#cur.execute('SELECT * FROM stable')
	#print cur.fetchall()
	
	con.close()

initStationsDatabase()









