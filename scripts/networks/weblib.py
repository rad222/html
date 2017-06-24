__author__ = 'sti'

import pandas as pd
import os
import logging
from logging.handlers import RotatingFileHandler
from datetime import datetime, timedelta
import sys
import re


home = os.path.realpath(os.path.dirname(__file__))
logger = logging.getLogger("Rotating Log")
format = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
logger.setLevel(logging.INFO)
logger.setLevel(logging.DEBUG)
ch = logging.StreamHandler(sys.stdout)
ch.setFormatter(format)
logger.addHandler(ch)
handler = RotatingFileHandler(os.path.join(os.path.join(home, 'log'), 'log.log'), maxBytes=1000000, backupCount=1)
handler.setFormatter(format)
logger.addHandler(handler)
header = ['id_station']

def cleaner(data_dir, delay_hours=24):
    '''
    Looks for files with format YYYYmmddHHMM.csv and deletes what is older than (now-delay_hours)
    '''
    format = '%Y%m%d%H%M'
    now = datetime.now()
    for root, dirs, files in os.walk(data_dir):
        for name in files:
            if re.compile("\d{12}.*csv").match(name):
                file_date = datetime.strptime(name.split('.')[0], format)
                if now - file_date > timedelta(hours=delay_hours):
                    logging.info('cleaning data: %s' % os.path.join(root, name))
                    try:
                        os.remove(os.path.join(root, name))
                    except Exception as e:
                        logging.error('Remove error, probably collision with other cleaner process %s' % e)

def check_dir(dir):
    '''
    Check if directory exists and creates it if not
    '''
    if not os.path.exists(dir):
        os.makedirs(dir)
        logger.info('creating %s' % dir)

def get_csv():

    # definitions
    format = '%Y%m%d%H%M'
    file_freq = 60  # in minutes
    # base dir
    base_dir = os.path.realpath(os.path.dirname(__file__))
    csv_dir = os.path.join(base_dir, "outputs")
    header = ['date', 'id_station','id_network','type','latitude','longitude','altitude', 'country', 'area_adm_1', 'area_adm_2', 'area_adm_3', 'name','value','value_max']
    #data
    csv_list = []
    for root, dirs, files in os.walk(".", topdown=False):
        for name in files:
            ans = os.path.join(root, name)
            if 'day.csv' in ans:
                csv_list.append(ans)

    combined_data = pd.concat([pd.read_csv(f, sep=";") for f in csv_list])
    print combined_data['date']
    combined_data['date'] = pd.to_datetime(combined_data['date'], format="%Y-%m-%d %H:%M:%S")
    #cut old data
    df_data = combined_data.loc[combined_data['date'] > datetime.now()-timedelta(hours=10)].set_index('id_station')
    #cut future data (by errors)
    df_data = combined_data.loc[combined_data['date'] < datetime.now()+timedelta(hours=10)].set_index('id_station')

    #meta
    csv_list2 = []
    for root, dirs, files in os.walk(".", topdown=False):
        for name in files:
            ans = os.path.join(root, name)
            if 'meta.csv' in ans:
                csv_list2.append(ans)
    df_meta = pd.concat([pd.read_csv(f, sep=";") for f in csv_list2]).set_index('id_station')

    # merge data and meta
    df_data = pd.merge(df_data, df_meta, left_index=True, right_index=True)
    # save in 60min files
    df_data.reset_index(inplace=True)
    #df_data.sort_values(by='date', inplace=True)
    df_data.set_index(['date'], inplace=True)
    
    groups = df_data.groupby(pd.TimeGrouper(freq=str(file_freq)+'Min'))

    # save
    file_names = []
    for timegr, dfgr in groups:
        if dfgr.empty: logger.info('Skipping empty group for %s' % (timegr)); continue
        name = timegr.strftime(format)+'.csv'
        check_dir(csv_dir)
        file_name = os.path.join(csv_dir, name)
        logger.info('saving web file: %s' % name)
        dfgr.reset_index(inplace=True)
        dfgr.set_index(['id_station'], inplace=True)
        #dfgr = dfgr[cols_web[1:]]  # skip 'id' column as it's already the index
        logger.info('  new: ' + str(dfgr.shape))

        # read previos web file and combine
        if os.path.isfile(file_name):
            logger.info('  Combining with previous web file')
            try:
                dfgr.reset_index(inplace=True)
                dfgr.set_index(['id_station','date'], inplace=True)
                dfold = pd.read_csv(file_name, sep=";", parse_dates=['date']) 
                dfold.set_index(['id_station','date'], inplace=True)
                logger.info('  old: ' + str(dfold.shape))
                dfgr = dfgr.combine_first(dfold) 
            except Exception as e:
                logger.info('  Problem combining...' + str(e))
                pass
            
        dfgr.reset_index(inplace=True) 
        #dfgr.drop_duplicates(subset='id_station').set_index(['id_station'], inplace=True)           
        dfgr.drop_duplicates()

        #dfgr = dfgr[cols_web[1:]]
        logger.info('  com: ' + str(dfgr.shape))
        #order of columns
        dfgr = dfgr[header]
        dfgr.to_csv(file_name, index = False, sep=';', encoding='utf-8', date_format="%d/%m/%y %H:%M")
        file_names.append(file_name)
    cleaner(csv_dir)

get_csv()
