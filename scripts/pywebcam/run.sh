#!/bin/bash

for ccode in DGT metcli tiempovistazo
do
	CCODE=$ccode
	echo ${CCODE}
	python pywebcam.py ${CCODE}

done






