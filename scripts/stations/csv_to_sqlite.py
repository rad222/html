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

con = sqlite3.connect(os.path.join(base_dir, "stations.db"))
cur = con.cursor()
cur.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, firstName VARCHAR(100), secondName VARCHAR(30))')
con.commit()
cur.execute('INSERT INTO users (id, firstName, secondName) VALUES(NULL, "Guido", "van Rossum")')
con.commit()
print cur.lastrowid

cur.execute('SELECT * FROM users')
print cur.fetchall()
con.close()







