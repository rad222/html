# webcam data parser

### Installation on Ubuntu Server 14.04.5
```sh
$ cd ~/html/scripts/pywebcam
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
$ cd ~/html/scripts/pywebcam
$ python pywebcam.py DGT
$ python pywebcam.py metcli
$ python pywebcam.py tiempovistazo
```
```sh
# run all
$ cd ~/html/scripts/pywebcam
$ ./run.sh
```