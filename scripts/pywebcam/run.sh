#!/bin/bash

#/home/radon/html/scripts/pywebcam/run.sh

for ccode in DGT metcli tiempovistazo
do
	CCODE=$ccode
	echo ${CCODE}
	#python pywebcam.py ${CCODE}

done


cd ~/html/scripts/pywebcam/
sed 1d ~/html/scripts/pywebcam/webcams_metcli.csv > ~/html/scripts/pywebcam/webcams_metcli_.csv
sed 1d ~/html/scripts/pywebcam/webcams_tiempovistazo.csv > ~/html/scripts/pywebcam/webcams_tiempovistazo_.csv
cat ~/html/scripts/pywebcam/webcams_DGT.csv ~/html/scripts/pywebcam/webcams_metcli_.csv ~/html/scripts/pywebcam/webcams_tiempovistazo_.csv > ~/html/scripts/pywebcam/webcams.csv


echo "stop" + $(date) >> /home/radon/html/scripts/pywebcam/runlog.log

cd ~
