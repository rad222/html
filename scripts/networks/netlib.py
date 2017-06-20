#!/usr/bin/python2.7
import pandas as pd
import json
import csv
import os
import os.path
import time
import urllib
import sys
from bs4 import BeautifulSoup
import numpy as np
import glob
# encoding=utf8
reload(sys)
sys.setdefaultencoding('utf8')

class RaHome(object):

    def find_between(self, s, first, last):
        '''
        A method to get string placed between two string
        '''
        try:
            start = s.index(first) + len(first)
            end = s.index(last, start)
            return s[start:end]
        except ValueError:
            None

    def get_data(self):
        #date;id_station;id_network;type;latitude;longitude;altitude;country;area_adm_1;area_adm_2;area_adm_3;name;value;value_max
        network = 'RaHome'
        type = 'air'
        myfile = 'data.csv'
        try:
            response = urllib.urlopen('http://radioactiveathome.org/map/')
        except:
            self.logger.error('No url available.')
        with open(myfile, 'wb') as f:
            writer = csv.writer(f, delimiter=';')
            for line in response.readlines():
                if str(line).startswith('map.addOverlay(createMarker(new GLatLng('):
                    data = line.split('GLatLng')
                    lon = None
                    lat = None
                    for datum in data:
                        values = datum.split(',')
                        if (len(values) > 1):
                            if 'Last contact' in values[3]:
                                #to skip data from nuclear power stations
                                lat = values[0].replace('(', '').strip()
                                lon = values[1].replace(')', '').strip()
                                id = network + values[2].strip()
                                date = self.find_between(values[3], 'Last contact:', '<br/>')
                                name = 'Team' + values[3].split('Team:')[1].replace('<br />Nick:', ' Nick:')
                                if ('Team  Nick' in name) or ('Team hidden Nick' in name):
                                    #user without Team
                                    name = name.replace('Team  ', '').replace('hidden ', '')
                                value = str(self.find_between(values[3], 'Last sample:', 'uSv')).strip()
                                value_max = str(self.find_between(values[3], 'average:', 'uSv')).strip() #average value last 24 hours
                                cols = [date, id, network, type, lat, lon, 0, 0, 0 , 0, 0, name, value,value_max]
                                writer.writerow(cols)
                                print date, id, network, type, lat, lon, value, value_max, name


def main():
    rahome = RaHome()
    ans = rahome.get_data()
    return

if __name__ == "__main__":
    main()

