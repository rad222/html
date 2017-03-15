#!/bin/bash

# pywebcam path
PYWEBCAM_PATH=/home/radon/html/scripts/pywebcam

# parse webcam data 
for ccode in DGT metcli tiempovistazo
do
	CCODE=$ccode
	echo ${CCODE}
	python ${PYWEBCAM_PATH}/pywebcam.py ${CCODE}
done

# merge 'DGT metcli tiempovistazo' to 'webcams.csv'
sed 1d ${PYWEBCAM_PATH}/webcams_metcli.csv > ${PYWEBCAM_PATH}/webcams_metcli_.csv
sed 1d ${PYWEBCAM_PATH}/webcams_tiempovistazo.csv > ${PYWEBCAM_PATH}/webcams_tiempovistazo_.csv
cat ${PYWEBCAM_PATH}/webcams_DGT.csv ${PYWEBCAM_PATH}/webcams_metcli_.csv ${PYWEBCAM_PATH}/webcams_tiempovistazo_.csv > ${PYWEBCAM_PATH}/webcams.csv
rm ${PYWEBCAM_PATH}/webcams_metcli_.csv
rm ${PYWEBCAM_PATH}/webcams_tiempovistazo_.csv

# copy 'webcams.csv' to web app folder
cp -R ${PYWEBCAM_PATH}/webcams.csv /var/www/html