#!/usr/bin/python2.7
import pandas as pd
import urllib2
import sys
import os
import logging
import pandas as pd
from datetime import datetime, timedelta
from logging.handlers import RotatingFileHandler
from bs4 import BeautifulSoup

# encoding=utf8
reload(sys)
sys.setdefaultencoding('utf8')

class myClass(object):


    def __init__(self):
        self.home = os.path.realpath(os.path.dirname(__file__))
        self.logger = logging.getLogger("Rotating Log")
        format = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
        self.logger.setLevel(logging.INFO)
        self.logger.setLevel(logging.DEBUG)
        ch = logging.StreamHandler(sys.stdout)
        ch.setFormatter(format)
        self.logger.addHandler(ch)
        handler = RotatingFileHandler(os.path.join(os.path.join(self.home, 'log'), 'log.log'), maxBytes=1000000, backupCount=1)
        handler.setFormatter(format)
        self.logger.addHandler(handler)

    def get_url(self, url, timeout=10):
        """
        Get's the URL with a default timeout of 10s.

        param url: string
        :return:
        """
        try:
            return urllib2.urlopen(url, timeout=timeout).read()
        except Exception as e:
            self.logger.error(str(e)+" "+str(url))
        return None

    def get_url2(self, url, timeout=10):
        """
        Get's the URL with a default timeout of 10s.

        param url: string
        :return:
        """
        try:
            return urllib2.urlopen(url, timeout=timeout).readlines()
        except Exception as e:
            self.logger.error(str(e)+" "+str(url))
        return None


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

    def check_data(self, datas, cols_data, path_data):
        '''
        A method to read/update data
        :return:
        '''
        df_data_new = pd.DataFrame(datas, columns=cols_data)
        df_data_new.sort_values(by='date', inplace=True)
        df_data_new['date'] = pd.to_datetime(df_data_new['date'], format="%Y-%m-%d %H:%M:%S")
        df_data_new.set_index(['id_station', 'date'], inplace=True)
        network = path_data.split('/')[-3]
        if os.path.isfile(path_data) is True:
            self.logger.info('Updating data from network %s' % network)
            df_data_old = pd.read_csv(path_data, sep=';')
            df_data_old.set_index(['id_station', 'date'], inplace=True)
            df_data_new = pd.concat([df_data_new, df_data_old])
            df_data_new = df_data_new.reset_index().drop_duplicates(subset=['id_station', 'date'], keep='last').set_index(['id_station', 'date'])
        else:
            self.logger.info('Making new data file from network %s' % network)

        #to remove older data (those values measured > 24 hours)
        df_data_new = df_data_new.iloc[df_data_new.index.get_level_values('date') > datetime.now()-timedelta(hours=24)]
        #to remove false data
        df_data_new.to_csv(path_data, sep=';', encoding='utf-8', date_format='%y/%m/%d %H:%M')


        return

    def check_meta(self, metas, cols_metas, path_meta):
        '''
        A method to read/update meta
        :return:
        '''
        df_data_new = pd.DataFrame(metas, columns=cols_metas)
        df_data_new.sort_values(by='id_station', inplace=True)
        df_data_new.set_index('id_station', inplace=True)
        network = path_meta.split('/')[-3]
        if os.path.isfile(path_meta) is True:
            self.logger.info('Updating meta from network %s' % network)
            df_data_old = pd.read_csv(path_meta, sep=';')
            df_data_old.set_index('id_station', inplace=True)
            df_data_new = pd.concat([df_data_new, df_data_old])
            df_data_new = df_data_new.reset_index().drop_duplicates(subset='id_station', keep='last').set_index('id_station')
        else:
            self.logger.info('Making new meta file from network %s' % network)
        df_data_new.to_csv(path_meta, sep=';', encoding='utf-8')

        return

class RaHome(myClass):


    def get_data(self):
        cols_data = ['date', 'id_station', 'value', 'value_max']
        cols_metas = ['id_station', 'id_network', 'latitude', 'longitude', 'name', 'type']
        datas, metas = self.get_data_files()

        if not datas:
            logging.error('No data at all!')
            return

        path_data = os.path.join('rahome/data', 'day.csv')
        path_meta = os.path.join('rahome/meta', 'meta.csv')
        self.check_meta(metas, cols_metas, path_meta)
        self.check_data(datas, cols_data, path_data)


    def get_data_files(self):

        network = 'RaHome'
        type = 'air'
        datas = []
        metas = []
        response = self.get_url2('http://radioactiveathome.org/map/', timeout=30)
        for line in response:
            if str(line).startswith('map.addOverlay(createMarker(new GLatLng('):
                data = line.split('GLatLng')
                for datum in data:
                    values = datum.split(',')
                    if len(values) > 1:
                        if 'Last contact' in values[3]:
                             #to skip data from nuclear power stations
                            lat = values[0].replace('(', '').strip()
                            lon = values[1].replace(')', '').strip()
                            id = network + '_' + values[2].strip()
                            self.logger.info('Get data from station %s' % id)
                            date = self.find_between(values[3], 'Last contact:', '<br/>')
                            name = 'Team' + values[3].split('Team:')[1].replace('<br />Nick:', ' Nick:')[0:-1]
                            if ('Team  Nick' in name) or ('Team hidden Nick' in name):
                                #user without Team
                                name = name.replace('Team  ', '').replace('hidden ', '')
                            value = float(str(self.find_between(values[3], 'Last sample:', 'uSv')).strip())*100
                            value_max = float(str(self.find_between(values[3], 'average:', 'uSv')).strip())*100 #average value last 24 hours
                            cols = [date, id, value, value_max]
                            datas.append(cols)
                            metas.append([id, network, lat, lon, name, type])  # Not country, area_adm_1, area_adm_2, area_adm_3

        return datas, metas

def main():
    rahome = RaHome()
    ans = rahome.get_data()
    return

if __name__ == "__main__":
    main()
