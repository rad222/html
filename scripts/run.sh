#!/bin/bash

for ccode in AT BE BG HR CY CZ DK EE FI FR DE GR GL HU IS IE IT LV LT LU MK MT NL NO PL PT RO RU RS SK SI ES SE CH TR UA GB 
do

	CCODE=$ccode
	echo ${CCODE}
	python test_eurdep_single.py ${CCODE}

done






