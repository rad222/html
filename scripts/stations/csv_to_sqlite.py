#!/usr/bin/env python

# python ~/html/scripts/stations/csv_to_sqlite.py 201704040006

# sudo apt-get install sqlite

import os
import sqlite3
import csv
import argparse

# base dir
base_dir = os.path.realpath(os.path.dirname(__file__))

parser = argparse.ArgumentParser(description='Import stations data from csv to SQLite database')
parser.add_argument('csv', metavar='-csv', help='csv file name')
args = parser.parse_args()
csv_file = args.csv

# create 'stations.db' with stations table 'stable'
def initStationsDatabase():
	con = sqlite3.connect(os.path.join(base_dir, "outputs/stations.db"))
	cur = con.cursor()
	
	'''
	- date VARCHAR(14)
	- id_station VARCHAR(10)
	- id_network VARCHAR(10)
	- type VARCHAR(10)
	- latitude NUMERIC(10,2)
	- longitude NUMERIC(10,2)
	- altitude NUMERIC(10,1)
	- country VARCHAR(50)
	- area_adm_1 VARCHAR(100)
	- area_adm_2 VARCHAR(100)
	- area_adm_3 VARCHAR(100)
	- name VARCHAR(100)
	- value NUMERIC(10,3)
	- value_max NUMERIC(10,3)
	'''
	
	# drop 'stable' table if exists	
	cur.execute('DROP TABLE IF EXISTS stable;')
	con.commit()	
	
	# create 'stable' table 
	cur.execute('CREATE TABLE stable (id INTEGER PRIMARY KEY, date VARCHAR(14), id_station VARCHAR(10), id_network VARCHAR(10), type VARCHAR(10), latitude NUMERIC(10,2), longitude NUMERIC(10,2), altitude NUMERIC(10,1), country VARCHAR(50), area_adm_1 VARCHAR(100), area_adm_2 VARCHAR(100), area_adm_3 VARCHAR(100), name VARCHAR(100), value NUMERIC(10,3), value_max NUMERIC(10,3))')
	con.commit()

	con.close()

	
def importStationsDataToDatabase():
	con = sqlite3.connect(os.path.join(base_dir, "outputs/stations.db"))
	con.text_factory = str
	cur = con.cursor()
	
	# import data from csv file to database
	with open(os.path.join(base_dir, "outputs/" + csv_file + ".csv"), 'rb') as csvfile:
		dr = csv.DictReader(csvfile, delimiter=';')
		to_db = [(i['date'][:8], i['id_station'], i['id_network'], i['type'], i['latitude'], i['longitude'], i['altitude'], i['country'], i['area_adm_1'], i['area_adm_2'], i['area_adm_3'], i['name'], i['value'], i['value_max']) for i in dr]
	cur.executemany("INSERT INTO stable (id, date, id_station, id_network, type, latitude, longitude, altitude, country, area_adm_1, area_adm_2, area_adm_3, name, value, value_max) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", to_db)
	con.commit()

	# delete duplicates
	cur.execute('DELETE FROM stable WHERE id NOT IN ( SELECT MAX(id) FROM stable GROUP BY date, id_station);')
	con.commit()
	
	con.close()
	
	
#initStationsDatabase()
importStationsDataToDatabase()


'''
# test import commands
python ~/html/scripts/stations/csv_to_sqlite.py 201704040006
python ~/html/scripts/stations/csv_to_sqlite.py 201704041205
python ~/html/scripts/stations/csv_to_sqlite.py 201704042359
python ~/html/scripts/stations/csv_to_sqlite.py 201704051205
python ~/html/scripts/stations/csv_to_sqlite.py 201704061156
python ~/html/scripts/stations/csv_to_sqlite.py 201704070006
python ~/html/scripts/stations/csv_to_sqlite.py 201704071205
python ~/html/scripts/stations/csv_to_sqlite.py 201704080008
python ~/html/scripts/stations/csv_to_sqlite.py 201704081201
python ~/html/scripts/stations/csv_to_sqlite.py 201704090002
python ~/html/scripts/stations/csv_to_sqlite.py 201704091201
python ~/html/scripts/stations/csv_to_sqlite.py 201704100002
python ~/html/scripts/stations/csv_to_sqlite.py 201704101205
python ~/html/scripts/stations/csv_to_sqlite.py 201704110003
python ~/html/scripts/stations/csv_to_sqlite.py 201704111204
python ~/html/scripts/stations/csv_to_sqlite.py 201704120004
python ~/html/scripts/stations/csv_to_sqlite.py 201704121203
python ~/html/scripts/stations/csv_to_sqlite.py 201704130036
python ~/html/scripts/stations/csv_to_sqlite.py 201704131237
python ~/html/scripts/stations/csv_to_sqlite.py 201704140038
python ~/html/scripts/stations/csv_to_sqlite.py 201704141235
python ~/html/scripts/stations/csv_to_sqlite.py 201704151235
'''