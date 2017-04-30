#!/bin/bash

# ~/html/scripts/pywebcam/run.sh

# project path
#PROJECT_PATH=/home/radon/html
PROJECT_PATH=/var/www/html/dev/html

# pywebcam path
PYWEBCAM_PATH=${PROJECT_PATH}/scripts/pywebcam

# parse webcam data 
for ccode in DGT metcli tiempovistazo munimadrid
do
	CCODE=$ccode
	echo ${CCODE}
	python ${PYWEBCAM_PATH}/pywebcam.py ${CCODE}
done

# merge 'DGT metcli tiempovistazo munimadrid' to 'webcams.csv' with webcam 'type'
sed 1d ${PYWEBCAM_PATH}/webcams_DGT.csv > ${PYWEBCAM_PATH}/webcams_DGT_.csv
sed 1d ${PYWEBCAM_PATH}/webcams_metcli.csv > ${PYWEBCAM_PATH}/webcams_metcli_.csv
sed 1d ${PYWEBCAM_PATH}/webcams_tiempovistazo.csv > ${PYWEBCAM_PATH}/webcams_tiempovistazo_.csv
sed 1d ${PYWEBCAM_PATH}/webcams_munimadrid.csv > ${PYWEBCAM_PATH}/webcams_munimadrid_.csv

sed 's/$/^DGT/' ${PYWEBCAM_PATH}/webcams_DGT_.csv > ${PYWEBCAM_PATH}/webcams_DGT.csv
sed 's/$/^metcli/' ${PYWEBCAM_PATH}/webcams_metcli_.csv > ${PYWEBCAM_PATH}/webcams_metcli.csv
sed 's/$/^tiempovistazo/' ${PYWEBCAM_PATH}/webcams_tiempovistazo_.csv > ${PYWEBCAM_PATH}/webcams_tiempovistazo.csv
sed 's/$/^munimadrid/' ${PYWEBCAM_PATH}/webcams_munimadrid_.csv > ${PYWEBCAM_PATH}/webcams_munimadrid.csv

rm ${PYWEBCAM_PATH}/webcams_DGT_.csv
rm ${PYWEBCAM_PATH}/webcams_metcli_.csv
rm ${PYWEBCAM_PATH}/webcams_tiempovistazo_.csv
rm ${PYWEBCAM_PATH}/webcams_munimadrid_.csv

cat ${PYWEBCAM_PATH}/webcams_DGT.csv ${PYWEBCAM_PATH}/webcams_metcli.csv ${PYWEBCAM_PATH}/webcams_tiempovistazo.csv ${PYWEBCAM_PATH}/webcams_munimadrid.csv > ${PYWEBCAM_PATH}/webcams.csv

sed -i 1i'id^lon^lat^img^type' ${PYWEBCAM_PATH}/webcams.csv

rm ${PYWEBCAM_PATH}/webcams_DGT.csv
rm ${PYWEBCAM_PATH}/webcams_metcli.csv
rm ${PYWEBCAM_PATH}/webcams_tiempovistazo.csv
rm ${PYWEBCAM_PATH}/webcams_munimadrid.csv

#chmod -R 777 ${PYWEBCAM_PATH}
#chown -R radon:radon ${PYWEBCAM_PATH}

# copy 'webcams.csv' to 'html/app/data' folder
cp -R ${PYWEBCAM_PATH}/webcams.csv ${PROJECT_PATH}/app/data

# push changes
git --git-dir=$PROJECT_PATH/.git --work-tree=$PROJECT_PATH git pull origin master
git --git-dir=$PROJECT_PATH/.git --work-tree=$PROJECT_PATH add .
git --git-dir=$PROJECT_PATH/.git --work-tree=$PROJECT_PATH commit -a -m "update webcams data (`date +%d/%m/%Y' '%H:%M`)"
git --git-dir=$PROJECT_PATH/.git --work-tree=$PROJECT_PATH push origin master
