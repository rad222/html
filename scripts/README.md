# RaViewer data parser

### Installation on Ubuntu Server 14.04.5
```sh
$ sudo apt-get install git build-essential python-pip python-dev python-numpy
$ https://github.com/rad222/html.git
$ cd ~/html/scripts
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
$ cd ~/html/scripts
# run parsing for Spain:
$ python test_eurdep_single.py ES
```
### Work Log
 - test.py rename to test_eurdep_single.py
 - add inputs, test_eurdep_v1.py from https://github.com/rad222/html/issues/20#issuecomment-279559126