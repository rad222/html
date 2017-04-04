#===========================================================================================#
#                                                                                           #
#                                     Save_day_data                                         #
#                                                                                           #
#         A script written in Python 2.x to read csv from $OUTPUT_STATIONS and              #
#                     to split in many csv by date column                                   #
#===========================================================================================#

import pandas as pd
import os
from datetime import datetime, timedelta

date_today = 'YYYYMMDD.csv' #current day (UTC)
self.day_data = os.path.join(date_today)  # file with last 24h of data

#STEPS:
# Read the data of csv $OUTPUT_STATIONS as a dataframe
# Split the previous dataframe by day (remove repeated rows in each day file (repeated row is those with the same id and date)
# Save each day csv (YYYYMMDD.csv) in the folder app/data/web/

def _read_data(self, file_name, columns=None):
    if os.path.isfile(file_name):
        return pd.read_csv(file_name, index_col=['id_station', 'date'], parse_dates=['date'], dtype={'id': object})
    else:
        return None
def _save(self, file_name, df):
    if df.empty:
        self.logger.warn('_save(): empty df, abort saving')
        return
    df.to_csv(file_name, sep=',', encoding='utf-8')

def combine_old_and_new_data(self, df_new):
    """
    Reads existing day.csv file and combines new data with existing one.
    Adds new columns to dataframe in case leechlib_config has changed
     """
    # read existing file
    df_day = self._read_data(self.day_data)
    if df_day is None:
        df_day = pd.DataFrame(columns=list(set(self.cols + self.cols_extra + self.cols_acu)))
        df_day.set_index(['id_station', 'date'], inplace=True)
    old = df_day.shape
    new_cols = list(set(self.cols + self.cols_extra + self.cols_acu).difference(set(df_day.columns)))
    new_cols.remove('date')
    new_cols.remove('id_station')
    if new_cols:
        df_day = pd.concat([df_day, pd.DataFrame(columns=new_cols)])

    # combine old and new data
    df_day = df_day.combine_first(df_new)
    df_day = df_day.reset_index().drop_duplicates(subset=['id_station', 'date'], keep='last').set_index(['id', 'date'])
    return df_day, old

def save_day_data(self, df):
    """
    Adds the last data extracted to the day_data file. Deletes the rows exceeding 24h delay
    :param df:
    :return:
    """
    # check and set df
    if df.empty:
        self.logger.warn("'df' is empty.")
        return
    df.reset_index(inplace=True)
    df.set_index(['id_station', 'date'], inplace=True)
    # read and combine old and new data
    df_day, old = self.combine_old_and_new_data(df)
    new = df.shape
    comb = df_day.shape
    df_day.reset_index(inplace=True)

    # delete old info
    df_day.set_index(['id_station', 'date'], inplace=True)
    df_day = df_day.iloc[df_day.index.get_level_values('date') > datetime.now()-timedelta(hours=24)]
    clean = df_day.shape

    # save
    self._save(self.day_data, df_day)
