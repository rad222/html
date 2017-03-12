#!/bin/bash

for ccode in AT BE BG CH CY CZ DE DK EE ES FI FR GB GL GR HR HU IE IS IT LT LU LV MK MT NL NO PL PT RO RS RU SE SI SK TR UA 
do

	CCODE=$ccode
	echo ${CCODE}
	python test_eurdep_single.py ${CCODE}

done






