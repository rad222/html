# RaViewer webcams data parser

### Installation on Ubuntu Server 14.04.5
```sh
$ cd ~/html/scripts/pywebcam
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
or
$ ~/html/scripts/pywebcam/run.sh
```
```sh
# crontab
$ crontab -e
# m h dom mon dow command
# 0 9 * * * /home/radon/html/scripts/pywebcam/run.sh
# 0 17 * * * /home/radon/html/scripts/pywebcam/run.sh
```


http://stackoverflow.com/questions/8588768/git-push-username-password-how-to-avoid