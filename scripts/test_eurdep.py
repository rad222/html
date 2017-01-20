

import pandas as pd
import json
import csv
import os
import os.path
import time
import urllib
# encoding=utf8
import sys
from astropy.wcs.docstrings import alt
reload(sys)
sys.setdefaultencoding('utf8')

import numpy as np
import glob


class Eurdep(object):

    def get_fill(self, meta, f):
        df_meta = pd.read_csv(meta,sep=';')
        df = pd.read_csv(f,sep=';')
   
       # df['index'] = df.latitude.astype(str).str.cat(df.longitude.astype(str), sep=',')
 
        for i in df_meta['id_station'].tolist():

            df.loc[df['id_station'] == i, 'altitude'] = df_meta.loc[df_meta['id_station']== i,"altitude"]
            df.loc[df['id_station'] == i, 'area_adm_1'] = df_meta.loc[df_meta['id_station']== i,"area_adm_1"]
            df.loc[df['id_station'] == i, 'area_adm_2'] = df_meta.loc[df_meta['id_station']== i,"area_adm_2"]
            df.loc[df['id_station'] == i, 'area_adm_3'] = df_meta.loc[df_meta['id_station']== i,"area_adm_3"]

        filename = 'output2.csv'
     #   df = df.set_index(['index']) #not appear in the csv file
        df.altitude = df.altitude.round(1)
        df.to_csv(filename, sep=';',  index=False, encoding='utf-8')
    
        return
        
    def get_alt_area(self, f):
  
        df = pd.read_csv(f,sep=';')
   
        df['index'] = df.latitude.astype(str).str.cat(df.longitude.astype(str), sep=',')
             
        with open(f) as fname:
            content = fname.readlines()

            for i in content[::-1]:
                ans = i.split(';')
                latlng = str(ans[4])+',' + str(ans[5])  
                #altitude                    
                url = 'https://maps.googleapis.com/maps/api/elevation/json?locations=' + latlng     
                url_out = latlng + '.alt'          
                file_folder = os.path.join('data_json/alt/', url_out)      
                if os.path.exists('data_json/alt/'+url_out) is False:                    
                    urllib.urlretrieve(url, file_folder)
                    
                #elevation
                url2 = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng + '&language=es'  
                url_out2 = latlng + '.area'          
                file_folder2 = os.path.join('data_json/area/', url_out2)      
                if os.path.exists('data_json/area/'+url_out2) is False:                    
                    urllib.urlretrieve(url2, file_folder2)  
 
                #get elevation 
                ans = self.get_area_file(file_folder2)
                df.loc[df['index'] == str(latlng), 'altitude'] = self.get_alt_file(file_folder)
                df.loc[df['index'] == str(latlng), 'area_adm_1'] = ans[0]
                df.loc[df['index'] == str(latlng), 'area_adm_2'] = ans[1]
                df.loc[df['index'] == str(latlng), 'area_adm_3'] = ans[2]
        filename = 'output2.csv'
        df = df.set_index(['index']) #not appear in the csv file
        df.altitude = df.altitude.round(1)
        df.to_csv(filename, sep=';',  index=False, encoding='utf-8')

        return

    def read_meta(self, infile):
        '''
        #https://rewidget.jrc.ec.europa.eu/v3/objects/markers?cnt=
        #https://redata.jrc.ec.europa.eu/oss/stations/atom?callback=jQuery21307530084920821936_1483011579095&q=gamma&count=1&uid=id%3ALU0066%3B&_=1483011579121

        '''
        ans = pd.read_json(infile)
        id_country = ans['code']
        name_country = ans['name']
        dict_countries = {}
        for j,i in enumerate(id_country):
            dict_countries[i] = name_country[j]
            
        cols = ['date','id_station','id_network','type','latitude','longitude','altitude','country','area_adm_1','area_adm_2','area_adm_3','name','value','value_max']
        df = pd.DataFrame(columns = cols)


        list = []

        with open('output.csv', 'wb') as f:
            writer = csv.writer(f, delimiter=';')
            writer.writerow(cols)
            
        print id_country.tolist()
        for index,item_country in enumerate(id_country.tolist()):
            #each index is a country
            
            for dict_fieldStations in ans['stations'].loc[index]:
                 
                with open("output.csv", 'ab') as f:
                    values = self.read_data(dict_fieldStations['code'])
                    #values = (0, 0)                            
                    sublist = (str(dict_fieldStations['updated']),str(dict_fieldStations['code']),'Eurdep', 'air', dict_fieldStations['lat'],dict_fieldStations['lng'],0, str(dict_countries[item_country]),0,0,0,str(dict_fieldStations['name']),values[0],values[1])
                    if (sublist[9] == 'GB Mobile Monitoring') or (sublist[9] == 'UK Mobile Monitoring') or (dict_fieldStations['active'] is not True): #to remove mobile stations
                        continue
                    else:
                        writer = csv.writer(f, delimiter=';')
                        writer.writerow(sublist)

       
        self.get_alt_area("output.csv")
        



        return 

    def read_data(self,id):
        '''
        #https://rewidget.jrc.ec.europa.eu/v3/objects/point?id=FR1011
        '''
        url = 'https://rewidget.jrc.ec.europa.eu/v3/objects/point?id=' + str(id)
        ans = pd.read_json(url)
        
        return ans["avg"]["val"]/10, ans["max"]["val"]/10

    def get_alt_file(self, file):
        '''
        A method to add area to meta from longitude and latitude
        :param meta_in: csv
        :param meta_out: csv
        :param url_json: json
        :return:
        '''
        elevation = None

        with open(file, "rb") as infile:
            for meta in json.load(infile)['results']:
                elevation = float(meta['elevation'])
                a = float(meta['location']['lat'])
                b = float(meta['location']['lng'])
           
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
        with open(file, "rb") as infile:

            for meta in json.load(infile)['results']:                       
                description = meta['address_components'][0]
                if str(description['types'][0]) == 'locality':                  
                    area3 = description['long_name'].encode('utf-8')
                if str(description['types'][0]) == 'administrative_area_level_2':                  
                    area2 = description['long_name'].encode('utf-8')           
                if str(description['types'][0]) == 'administrative_area_level_1':                  
                    area1 = description['long_name'].encode('utf-8')             

        return area1, area2, area3
  
def main():
   # urllib.urlretrieve('https://rewidget.jrc.ec.europa.eu/v3/objects/markers?cnt=', 'eurdep.json')
    infile = "eurdep2.json"
    eurdep = Eurdep()
    ans = eurdep.read_meta(infile) #dataframe from json file
    infile_meta = "meta.csv"
    infile_new = "output.csv"
    ans = eurdep.get_fill(infile_meta, infile_new) #dataframe from json file
    return

def test():
    infile_meta = "meta.csv"
    infile_new = "output.csv"
    eurdep = Eurdep()
    ans = eurdep.get_fill(infile_meta, infile_new) #dataframe from json file
    return


if __name__ == "__main__":

    main()