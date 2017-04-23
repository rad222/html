#!/usr/bin/env python

'''
# install Apache/PHP
# sudo apt-get -y install apache2 && sudo service apache2 restart
# sudo apt-get -y install php5 && sudo service apache2 restart
# sudo apt-get install php5-sqlite && sudo service apache2 restart

# install sqlite
# sudo apt-get install sqlite


# python ~/html/scripts/stations/csv_to_sqlite.py -h
usage: csv_to_sqlite.py [-h] [-c] [-i [IMPORTCSV]]

Script for find common route path and calculate route length.

optional arguments:
  -h, --help            show this help message and exit
  -c, --createdb        Create 'stations.db' database with stations table
                        'stable'
  -i [IMPORTCSV], --importcsv [IMPORTCSV]
                        Import csv file(s) to database. Use '-i' for import
                        all csv files or use '-i <csv file name>' for import
                        specified csv file
'''

import os
import sys
import sqlite3
import csv
import argparse

# base dir
base_dir = os.path.realpath(os.path.dirname(__file__))
csv_dir = os.path.join(base_dir, "outputs")

# define ArgumentParser
def createParser ():
	parser = argparse.ArgumentParser(description='Script for find common route path and calculate route length.')

	parser.add_argument('-c', '--createdb', action='store_true', help='Create \'stations.db\' database with stations table \'stable\'')
	parser.add_argument('-i', '--importcsv', action='store', nargs='?', type=int, default='-1', help='Import csv file(s) to database. Use \'-i\' for import all csv files or use \'-i <csv file name>\' for import specified csv file')
	
	return parser


# Create \'stations.db\' database with stations table \'stable\'
def initStationsDatabase():
	if os.path.exists(os.path.join(csv_dir, "stations.db")):
		os.remove(os.path.join(csv_dir, "stations.db"))

	con = sqlite3.connect(os.path.join(csv_dir, "stations.db"))
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


def importCsv(csvname):
	print "start import", csvname
	con = sqlite3.connect(os.path.join(csv_dir, "stations.db"))
	con.text_factory = str
	cur = con.cursor()
	
	# import data from csv file to database
	with open(os.path.join(csv_dir, str(csvname) + ".csv"), 'rb') as csvfile:
		dr = csv.DictReader(csvfile, delimiter=';')
		to_db = [('20' + i['date'][6:-6] + '-' + i['date'][3:-9] + '-' + i['date'][:2], i['id_station'], i['id_network'], i['type'], i['latitude'], i['longitude'], i['altitude'], i['country'], i['area_adm_1'], i['area_adm_2'], i['area_adm_3'], i['name'], i['value'], i['value_max']) for i in dr]
	cur.executemany("INSERT INTO stable (id, date, id_station, id_network, type, latitude, longitude, altitude, country, area_adm_1, area_adm_2, area_adm_3, name, value, value_max) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", to_db)
	con.commit()

	# delete duplicates
	cur.execute('DELETE FROM stable WHERE id NOT IN ( SELECT MAX(id) FROM stable GROUP BY date, id_station);')
	con.commit()	
	
	# change empty altitude values to -9999
	cur.execute('UPDATE stable SET altitude = -9999 WHERE altitude = "";')
	con.commit()

	# create 'stable_date' table
	cur.execute('DROP TABLE IF EXISTS stable_date;')
	con.commit()
	
	cur.execute('CREATE TABLE stable_date AS SELECT date AS sdate, count(*) AS scount FROM stable GROUP BY date ORDER BY date;')
	con.commit()
	
	con.close()

	
def importStationsDataFromCsvToDatabase(param):
	if param == None:
		csv_files_list = filter(lambda x: x.endswith('.csv'), os.listdir(csv_dir))
		for csv_file in csv_files_list:
			csv_file_name = int(csv_file.replace('.csv', ''))
			importCsv(csv_file_name)
	elif len(str(param)) == 12:
		importCsv(param)


if __name__ == '__main__':
	parser = createParser()

	if len(sys.argv) == 1:
		print '\nERROR! You must specify at least one option\n'
		parser.print_help()
	
	namespace = parser.parse_args()
	
	# Create \'stations.db\' database with stations table \'stable\'
	if namespace.createdb == True:
		initStationsDatabase()
		print "\nDatabase \'stations.db\' and \'stable\' table created successfully\n"

	# Import csv file(s) to database. Use \'-i\' for import all csv files or use \'-i <csv file name>\' for import specified csv file
	if namespace.importcsv != -1:
		importStationsDataFromCsvToDatabase(namespace.importcsv)
