#!/usr/bin/python2.7
import pandas as pd
import json
import csv
import os
import os.path
import time
import urllib
# encoding=utf8
import sys

reload(sys)
sys.setdefaultencoding('utf8')

import numpy as np
import glob

#no resetear csv s
#si updated existe entonces no escribir (no ir a la url)
class Eurdep(object):

    def get_fill(self, meta, f):

        df_meta = pd.read_csv(meta,sep=';')
        df = pd.read_csv(f,sep=';')
    
        df['index'] = df.id_station.astype(str)
        df_meta['index'] = df_meta.id_station.astype(str)   

        df = df.set_index(['index'])
        df_meta = df_meta.set_index(['index'])

        mylist = list(set(df_meta['id_station'].tolist()) & set(df['id_station'].tolist()))
        
        for i in mylist:
            df.loc[df['id_station'] == i, 'altitude'] = df_meta.loc[df_meta['id_station']== i,"altitude"]
            df.loc[df['id_station'] == i, 'area_adm_1'] = df_meta.loc[df_meta['id_station']== i,"area_adm_1"]
            df.loc[df['id_station'] == i, 'area_adm_2'] = df_meta.loc[df_meta['id_station']== i,"area_adm_2"]
            df.loc[df['id_station'] == i, 'area_adm_3'] = df_meta.loc[df_meta['id_station']== i,"area_adm_3"]

     #   df = df.set_index(['index']) #not appear in the csv file
        df.altitude = df.altitude.round(1)
        df.value = df.value.round(1)
        df.value_max = df.value_max.round(1)
         
        df.to_csv(f, sep=';',  index=False, encoding='utf-8')
    
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

    def read_meta(self, infile_new):
        '''
        #https://rewidget.jrc.ec.europa.eu/v3/objects/markers?cnt=
        #https://redata.jrc.ec.europa.eu/oss/stations/atom?callback=jQuery21307530084920821936_1483011579095&q=gamma&count=1&uid=id%3ALU0066%3B&_=1483011579121
        #https://rewidget.jrc.ec.europa.eu/v3/objects/point?id=FR1011
        ''' 
        ans = pd.read_json('https://rewidget.jrc.ec.europa.eu/v3/objects/markers?cnt=' )
        id_country = ans['code']
        name_country = ans['name']
        dict_countries = {}
        myfile = os.path.join('inputs',infile_new + '.csv')
        
        cols = ['date','id_station','id_network','type','latitude','longitude','altitude','country','area_adm_1','area_adm_2','area_adm_3','name','value','value_max']

        for j,i in enumerate(id_country):
            dict_countries[i] = name_country[j]
            
        with open(myfile, 'wb') as f:
            writer = csv.writer(f, delimiter=';')
            writer.writerow(cols)
            
        for index,item_country in enumerate(id_country.tolist()):
            #each index is a country
            print index, item_country

            if  item_country == infile_new:       
                for dict_fieldStations in ans['stations'].loc[index]:
                    with open(myfile, 'ab') as f:              
                        url = 'https://rewidget.jrc.ec.europa.eu/v3/objects/point?id=' + str(dict_fieldStations['code'])
                        ans = pd.read_json(url)
                        values = ans["avg"]["val"]/10, ans["max"]["val"]/10
                        sublist = (str(dict_fieldStations['updated']),str(dict_fieldStations['code']),'Eurdep', 'air', dict_fieldStations['lat'],dict_fieldStations['lng'],0, str(dict_countries[item_country]),0,0,0,str(dict_fieldStations['name']),values[0],values[1])
                        if (sublist[9] != 'GB Mobile Monitoring') or (sublist[9] != 'UK Mobile Monitoring') or (dict_fieldStations['active'] is True): #to remove mobile stations
                            writer = csv.writer(f, delimiter=';')
                            writer.writerow(sublist)
       # self.read_csv(myfile)
    
        infile_meta = "meta.csv"    
        self.get_fill(infile_meta, myfile) #dataframe from json file
                         
        return 
    
    def read_csv(self, myfile):
        '''
        Remove duplicates
        '''
        mypd = pd.read_csv(myfile)        
        mypd.drop_duplicates()
        print mypd
        mypd.to_csv(myfile, sep=';',  index=False, encoding='utf-8')
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
    
    #list = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'GL', 'H', 'IS', 'IE', 'IT', 'LV', 'LT', 'L', 'MK', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'R', 'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'TR', 'UA', 'GB']

    # print command line arguments
    for i, arg in enumerate(sys.argv[1:]):
        infile_new = None
        reset = None
        if i == 0:
            infile_new = str(arg)


    eurdep = Eurdep()
    ans = eurdep.read_meta(infile_new) #dataframe from json file
    

    return

def test():
    infile_meta = "meta.csv"
    infile_new = "output.csv"
    eurdep = Eurdep()
    ans = eurdep.get_fill(infile_meta, infile_new) #dataframe from json file
    return


if __name__ == "__main__":

    main()