#!/bin/bash

# project path
PROJECT_PATH=/home/radon/html

# pywebcam path
STATIONS_PATH=/home/radon/html/scripts/stations

# run python scarping script
for scode in AT BE BG CH CY CZ DE DK EE ES FI FR GB GL GR HR HU IE IS IT LT LU LV MK MT NL NO PL PT RO RS RU SE SI SK TR UA 
do
	SCODE=$scode
	echo ${SCODE}
	#python ${STATIONS_PATH}/test_eurdep_single.py ${SCODE}
done



OutFileName="X.csv"                       # Fix the output name
i=0                                       # Reset a counter
for filename in ${STATIONS_PATH}/inputs/*.csv; do 
 if [ "$filename"  != "$OutFileName" ] ;      # Avoid recursion 
 then 
   if [[ $i -eq 0 ]] ; then 
      head -1  $filename >   $OutFileName # Copy header if it is the first file
   fi
   tail -n +2  $filename >>  $OutFileName # Append from the 2nd line each file
   i=$(( $i + 1 ))                        # Increase the counter
 fi
done


