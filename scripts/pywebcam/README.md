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
```sh
# crontab
$ sudo crontab -e
# m h dom mon dow command
# 00 12 * * * /home/radon/html/scripts/pywebcam/run.sh
```

http://134.249.136.27:805/webcams.csv

```sh
publish_path=/home/radon/html
git --git-dir=$publish_path/.git --work-tree=$publish_path commit -a -m "update data (`date +%d/%m/%Y' '%H:%M`)"
git --git-dir=$publish_path/.git --work-tree=$publish_path push origin gh-pages
```

