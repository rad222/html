# RaViewer data parser

### Installation on Ubuntu Server 14.04.5
```sh
$ sudo apt-get install git build-essential python-pip python-dev python-numpy
$ https://github.com/rad222/html.git
$ cd ~/html/scripts/stations
$ sudo pip install -r requirements.txt
```
### Update from repository
```sh
$ cd ~/html
$ git pull
```
### Update repository
```sh
$ cd ~/html
$ git status
$ git commit -a -m 'Update data'
$ git push
```
### Running
```sh
# run parsing for Spain:
$ cd ~/html/scripts/stations
$ python test_eurdep_single.py ES
```

```sh
# run parsing for all countries:
$ cd ~/html/scripts/stations
$ ./run.sh
```

### Work Log
 - test.py rename to test_eurdep_single.py
 - add inputs, test_eurdep_v1.py from https://github.com/rad222/html/issues/20#issuecomment-279559126

 
0 AT
1 BE
2 BG
3 HR
4 CY
5 CZ
6 DK
7 EE
8 FI
9 FR
10 DE
11 GR
12 GL
13 HU
14 IS
15 IE
16 IT
17 LV
18 LT
19 LU
20 MK
21 MT
22 NL
23 NO
24 PL
25 PT
26 RO
27 RU
28 RS
29 SK
30 SI
31 ES
32 SE
33 CH
34 TR
35 UA
36 GB
