#!/bin/bash

# ~/html/scripts/pywebcam/run.sh

# project path
PROJECT_PATH=/home/radon/html

# pywebcam path
PYWEBCAM_PATH=/home/radon/html/scripts/pywebcam

# parse webcam data 
for ccode in DGT metcli tiempovistazo
do
	CCODE=$ccode
	echo ${CCODE}
	python ${PYWEBCAM_PATH}/pywebcam.py ${CCODE}
done

# merge 'DGT metcli tiempovistazo' to 'webcams.csv' with webcam 'type'
sed 1d ${PYWEBCAM_PATH}/webcams_DGT.csv > ${PYWEBCAM_PATH}/webcams_DGT_.csv
sed 1d ${PYWEBCAM_PATH}/webcams_metcli.csv > ${PYWEBCAM_PATH}/webcams_metcli_.csv
sed 1d ${PYWEBCAM_PATH}/webcams_tiempovistazo.csv > ${PYWEBCAM_PATH}/webcams_tiempovistazo_.csv

sed 's/$/|DGT/' ${PYWEBCAM_PATH}/webcams_DGT_.csv > ${PYWEBCAM_PATH}/webcams_DGT.csv
sed 's/$/|metcli/' ${PYWEBCAM_PATH}/webcams_metcli_.csv > ${PYWEBCAM_PATH}/webcams_metcli.csv
sed 's/$/|tiempovistazo/' ${PYWEBCAM_PATH}/webcams_tiempovistazo_.csv > ${PYWEBCAM_PATH}/webcams_tiempovistazo.csv

rm ${PYWEBCAM_PATH}/webcams_DGT_.csv
rm ${PYWEBCAM_PATH}/webcams_metcli_.csv
rm ${PYWEBCAM_PATH}/webcams_tiempovistazo_.csv

cat ${PYWEBCAM_PATH}/webcams_DGT.csv ${PYWEBCAM_PATH}/webcams_metcli.csv ${PYWEBCAM_PATH}/webcams_tiempovistazo.csv > ${PYWEBCAM_PATH}/webcams.csv

sed -i 1i'id|lon|lat|img|type' ${PYWEBCAM_PATH}/webcams.csv

rm ${PYWEBCAM_PATH}/webcams_DGT.csv
rm ${PYWEBCAM_PATH}/webcams_metcli.csv
rm ${PYWEBCAM_PATH}/webcams_tiempovistazo.csv

#chmod -R 777 ${PYWEBCAM_PATH}
#chown -R radon:radon ${PYWEBCAM_PATH}

# copy 'webcams.csv' to web app folder
#cp -R ${PYWEBCAM_PATH}/webcams.csv /var/www/html


# copy 'webcams.csv' to 'html/app/data' folder
cp -R ${PYWEBCAM_PATH}/webcams.csv /home/radon/html/app/data

# push changes
git --git-dir=$PROJECT_PATH/.git --work-tree=$PROJECT_PATH commit -a -m "update webcams data (`date +%d/%m/%Y' '%H:%M`)"
git --git-dir=$PROJECT_PATH/.git --work-tree=$PROJECT_PATH push origin master
