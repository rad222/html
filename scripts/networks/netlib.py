#!/usr/bin/python2.7
import pandas as pd
import urllib
import urllib2
import json
import sys
import os
import logging
import pandas as pd
from datetime import datetime, timedelta
from logging.handlers import RotatingFileHandler
from bs4 import BeautifulSoup
import time
import re
from datetime import datetime


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
        #df_data_new.sort_values(by='date', inplace=True)        
        df_data_new['date'] = pd.to_datetime(df_data_new['date'], format="%Y-%m-%d %H:%M:%S")
        df_data_new.set_index(['id_station', 'date'], inplace=True)        
        if os.path.isfile(path_data) is True:
            self.logger.info('Updating data from network')
            df_data_old = pd.read_csv(path_data, sep=';')
            df_data_old.set_index(['id_station', 'date'], inplace=True)
            df_data_new = pd.concat([df_data_new, df_data_old])
            df_data_new = df_data_new.reset_index().drop_duplicates(subset=['id_station', 'date']).set_index(['id_station', 'date'])
        else:
            self.logger.info('Making new data file from network')
        #to remove older data (those values measured > 24 hours)
        df_data_new = df_data_new.iloc[df_data_new.index.get_level_values('date') > datetime.now()-timedelta(hours=24)]
        #to remove false data    
        df_data_new.to_csv(path_data, sep=';', encoding='utf-8', date_format='%y/%m/%d %H:%M:%S')

        return

    def check_meta(self, metas, cols_metas, path_meta):
        '''
        A method to read/update meta
        :return:
        '''
        df_data_new = pd.DataFrame(metas, columns=cols_metas)
        #df_data_new.sort_values(by='id_station', inplace=True)
        
        if os.path.isfile(path_meta) is True:            
            df_data_old = pd.read_csv(path_meta, sep=';')
            set1 = set(df_data_old['id_station'].tolist())
            set2 = set(df_data_new['id_station'].tolist())

            unmatched = list(set2.symmetric_difference(set1)) 
            print unmatched, len(unmatched)           
            df_data_old.set_index('id_station', inplace=True)
            df_data_new.set_index('id_station', inplace=True) 
            df_data_new = pd.concat([df_data_new, df_data_old])
            df_data_new = df_data_new.reset_index().drop_duplicates(subset='id_station').set_index('id_station')
            if len(unmatched) != 0: #if no changes, not updated meta
                self.logger.info('Updating meta from network')
                df_data_new.to_csv(path_meta, sep=';', encoding='utf-8')
                self.get_alt_area(path_meta) #to fill altitude and area administrative
        else:
            self.logger.info('Making new meta file from network')
            df_data_new.set_index('id_station', inplace=True) 
            df_data_new.to_csv(path_meta, sep=';', encoding='utf-8')
            self.get_alt_area(path_meta)
       
        
        return

    def get_alt_file(self, file):
        '''
        A method to add area to meta from longitude and latitude
        :param meta_in: csv
        :param meta_out: csv
        :param url_json: json
        :return:
        '''
        elevation = None
        status = None
        with open(file, "rb") as infile:
            ans = json.load(infile)
            status = ans['status']          
          
            for meta in ans['results']:
                elevation = float(meta['elevation'])
                a = float(meta['location']['lat'])
                b = float(meta['location']['lng'])

        if (status == 'OVER_QUERY_LIMIT') is True:
            myfile = os.path.join(self.home, file)
            os.remove(myfile)
        return elevation
    
    def get_area_file(self, file):
        '''
        A method to add area to meta from longitude and latitude
        :param meta_in: csv
        :param meta_out: csv
        :param url_json: json
        :return:
        '''
        elevation = None
        area1 = None
        area2 = None
        area3 = None
        area0 = None
        country = None
        with open(file, "rb") as infile:
            for meta in json.load(infile)['results']:                       
                description = meta['address_components'][0]
                if str(description['types'][0]) == 'locality':                  
                    area3 = description['long_name'].encode('utf-8')
                if str(description['types'][0]) == 'administrative_area_level_2':                  
                    area2 = description['long_name'].encode('utf-8')           
                if str(description['types'][0]) == 'administrative_area_level_1':                  
                    area1 = description['long_name'].encode('utf-8')             
                if str(description['types'][0]) == 'country':                  
                    area0 = description['long_name'].encode('utf-8')  
        return area1, area2, area3, area0
    
       
    def get_alt_area(self, f):
  
        df = pd.read_csv(f,sep=';')
   
        df['index'] = df.latitude.astype(str).str.cat(df.longitude.astype(str), sep=',')
        list = df['index'].tolist()
        for i in list: 
            latlng = str(i)            
            #altitude                    
            url = 'https://maps.googleapis.com/maps/api/elevation/json?locations=' + latlng     
            url_out = latlng + '.alt'          
            file_folder = os.path.join('data_json/alt/', url_out)            
            if os.path.exists('data_json/alt/'+url_out) is False:
                time.sleep(0)
                urllib.urlretrieve(url, file_folder)

            #elevation
            url2 = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng #+ '&language=es'  
            url_out2 = latlng + '.area'          
            file_folder2 = os.path.join('data_json/area/', url_out2)      
            if os.path.exists('data_json/area/'+url_out2) is False:
                time.sleep(1)
                urllib.urlretrieve(url2, file_folder2)  
 
            #get elevation 
            ans = self.get_area_file(file_folder2)
            df.loc[df['index'] == str(latlng), 'altitude'] = self.get_alt_file(file_folder)
            df.loc[df['index'] == str(latlng), 'area_adm_1'] = ans[0]
            df.loc[df['index'] == str(latlng), 'area_adm_2'] = ans[1]
            df.loc[df['index'] == str(latlng), 'area_adm_3'] = ans[2]
            df.loc[df['index'] == str(latlng), 'country'] = ans[3]
        df = df.set_index(['index']) #not appear in the csv file
        df.altitude = df.altitude.round(1)
        df.to_csv(f, sep=';',  index=False, encoding='utf-8')

        return
    
class RaHome(myClass):


    def get_data(self):
        cols_data = ['date', 'id_station', 'value', 'value_max']
        cols_metas = ['id_station', 'id_network', 'latitude', 'longitude', 'name', 'type', 'country', 'altitude', 'area_adm_1', 'area_adm_2', 'area_adm_3']
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
        response = self.get_url('http://radioactiveathome.org/map/', timeout=30)
           
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
                            date = self.find_between(values[3], 'Last contact:', '<br/>').strip()
                            name = 'Team' + values[3].split('Team:')[1].replace('<br />Nick:', ' Nick:')[0:-1]
                            if ('Team  Nick' in name) or ('Team hidden Nick' in name):
                                #user without Team
                                name = name.replace('Team  ', '').replace('hidden ', '')
                            value = float(str(self.find_between(values[3], 'Last sample:', 'uSv')).strip())*100
                            value_max = float(str(self.find_between(values[3], 'average:', 'uSv')).strip())*100 #average value last 24 hours
                            cols = [date, id, value, value_max]
                            datas.append(cols)
                            metas.append([id, network, lat, lon, name, type, 0, -9999.0, 0, 0,0])  #There are not: country, altitude, area_adm_1, area_adm_2, area_adm_3

        return datas, metas

class GMC(myClass):

    def get_data(self):
        cols_data = ['date', 'id_station', 'value', 'value_max']
        cols_metas = ['id_station', 'id_network', 'latitude', 'longitude', 'name', 'type', 'country', 'altitude', 'area_adm_1', 'area_adm_2', 'area_adm_3']
        datas, metas = self.get_data_files()

        if not datas:
            logging.error('No data at all!')
            return

        path_data = os.path.join('gmc/data', 'day.csv')
        path_meta = os.path.join('gmc/meta', 'meta.csv')
        self.check_meta(metas, cols_metas, path_meta)
        self.check_data(datas, cols_data, path_data)

    def get_data_files(self):
        #Greenwich Mean Time (GMT), UTC +0
        network = 'GMC'
        type = 'air'
        datas = []
        metas = []
        format = '%Y-%m-%d %H:%M:%S'        
        response = self.get_url('http://www.gmcmap.com/AJAX_load.asp?timeZone=0', timeout=30)
        for enum, line in enumerate(response):         
            date_str = self.find_between(line, 'Data uploaded on:', 'GMT').strip()
            try:
                date = datetime.strptime(date_str, format)
            except:
                pass
            if date < (datetime.now() - timedelta(hours=48)):
                #not old measurements
                continue
            else:
                value = self.find_between(line, '<BR>', '&nbsp;uSv/h').split('<BR>')
                if (len(value)>1) and not '-' in value[-1]:
                    if ' ' in value[-1]:
                        continue
                    try:             
                        value = float(value[-1].replace(',', '.'))*100
                    except:
                        pass
                    try:
                        id_str = self.find_between(line, 'href', ' target').split('ID=')[-1]                        
                    except:
                        pass
                    if 'www.' in id_str:
                        continue
                    id = 'GMC_' + id_str                   
                    lat, lon = line.split('Contact</a>')[-1].split(",")[1:3]
                    metas.append([id, network, lat, lon, id, type, 0, -9999.0, 0, 0,0])  #There are not: country, altitude, area_adm_1, area_adm_2, area_adm_3
                    cols = [date, id, value, -9999.0]
                    datas.append(cols)
                    
        return datas, metas
                    
                    
                    
                    

def main():
    print 'hola'
    rahome = RaHome()
    ans = rahome.get_data()
    return

def test():
    print 'hola'
    gmc = GMC()
    ans = gmc.get_data()
    return

if __name__ == "__main__":
    test()
