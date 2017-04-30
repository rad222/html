# RaViewer stations data parser

### Installation on Ubuntu Server 14.04.5
```sh
$ sudo apt-get install git build-essential python-pip python-dev python-numpy
$ git clone https://github.com/rad222/html.git
$ cd ~/html/scripts/stations
$ sudo pip install -r requirements.txt
```
### Update from repository
```sh
$ cd ~/html
$ git pull origin master
```
### Update repository
```sh
$ cd ~/html
$ git status
$ git add .
$ git commit -a -m 'update data'
$ git push origin master
```
### Running
```sh
# run parsing for Spain:
$ cd ~/html/scripts/stations
$ python eurdep_single.py ES
```

```sh
# run parsing for all countries:
$ cd ~/html/scripts/stations
$ ./run.sh
or
$ ~/html/scripts/stations/run.sh
```
```sh
# crontab
$ crontab -e
# m h dom mon dow command
# 0 11 * * * /home/radon/html/scripts/stations/run.sh
# 0 20 * * * /home/radon/html/scripts/stations/run.sh
```