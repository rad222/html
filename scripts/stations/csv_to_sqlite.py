#!/usr/bin/env python

# python ~/html/scripts/stations/csv_to_sqlite.py

import os
import logging
from pyspatialite import dbapi2 as db


# base dir
base_dir = os.path.realpath(os.path.dirname(__file__))

# logger
logger = logging.getLogger('myapp')
hdlr = logging.FileHandler(os.path.join(base_dir, "log.log"))
formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
hdlr.setFormatter(formatter)
logger.addHandler(hdlr) 
logger.setLevel(logging.INFO)









