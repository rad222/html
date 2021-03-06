#!/bin/bash

# ~/html/scripts/stations/run.sh

# project path
PROJECT_PATH=/home/radon/html

# pywebcam path
STATIONS_PATH=$PROJECT_PATH/scripts/stations

# run python scarping script
cd ${STATIONS_PATH}
for scode in AT BE BG CH CY CZ DE DK EE ES FI FR GB GL GR HR HU IE IS IT LT LU LV MK MT NL NO PL PT RO RS RU SE SI SK TR UA 
do
	SCODE=$scode
	echo ${SCODE}
	python ${STATIONS_PATH}/eurdep_single.py ${SCODE}
done
cd ~


# merge csv files in one
STATIONS_DATE=$(date +"%Y%m%d%H%M")
OUTPUT_STATIONS="${STATIONS_PATH}/outputs/$STATIONS_DATE.csv"
i=0
for filename in ${STATIONS_PATH}/inputs/*.csv; do 
 if [ "$filename"  != "$OUTPUT_STATIONS" ] ;
 then 
   if [[ $i -eq 0 ]] ; then 
      head -1  $filename >   $OUTPUT_STATIONS
   fi
   tail -n +2  $filename >>  $OUTPUT_STATIONS
   i=$(( $i + 1 ))
 fi
done

# import csv data to 'stations.db' database
python ${STATIONS_PATH}/csv_to_sqlite.py -i ${STATIONS_DATE}

# copy 'stations.db' to 'html/app/data' folder
cp -R ${STATIONS_PATH}/outputs/stations.db $PROJECT_PATH/app/data

# push changes
git --git-dir=$PROJECT_PATH/.git --work-tree=$PROJECT_PATH git pull origin master
git --git-dir=$PROJECT_PATH/.git --work-tree=$PROJECT_PATH add .
git --git-dir=$PROJECT_PATH/.git --work-tree=$PROJECT_PATH commit -a -m "update stations data (`date +%d/%m/%Y' '%H:%M`)"
git --git-dir=$PROJECT_PATH/.git --work-tree=$PROJECT_PATH push origin master
