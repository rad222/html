__author__ = 'sti'

import urllib2
import csv
import os
import logging
import sys
import socket
from bs4 import BeautifulSoup
from logging.handlers import RotatingFileHandler
sys.setrecursionlimit(10000) #to avoid RuntimeError: maximum recursion depth exceeded

#===========================================================================================#
#                                                                                           #
#                                     PyWebcam                                              #
#                                                                                           #
#         A script written in Python 2.x to get data from DGT webcams                       #
#                                                                                           #
#===========================================================================================#

home = '/home/radon/html/scripts/pywebcam/'

logger = logging.getLogger("Rotating Log")
format = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
logger.setLevel(logging.INFO)
logger.setLevel(logging.DEBUG)
ch = logging.StreamHandler(sys.stdout)
ch.setFormatter(format)
logger.addHandler(ch)
handler = RotatingFileHandler(os.path.join(os.path.join(home, 'log'), 'log.log'), maxBytes=1000000, backupCount=1)
handler.setFormatter(format)
logger.addHandler(handler)


def find_between(s, first, last):
    '''
    A method to get string placed between two string
    '''
    try:
        start = s.index(first) + len(first)
        end = s.index(last, start)
        return s[start:end]
    except ValueError:
        None
def latlonSpain(lat0, lon0):
    '''
    A method to check if a point is placed within Spain Area (or near)
    :param lat:
    :param lon:
    :return:
    '''
    lat = float(lat0)
    lon = float(lon0)
    #Area Spain
    NE = [43.7383229, 7.4244581]
    NO = [43.7383229, -7.9764943]
    SO = [35.9215639, -7.9764943]
    SE = [35.9215639, 7.4244581]
    #Area Canary
    NEC = [31.251822, -14.4913868]
    NOC = [31.251822, -18.8859181]
    SOC = [30.3980253, -18.8859181]
    SEC = [30.3980253, -14.4913868]
    if (SE[0] < lat < NE[0]) and (SO[1] < lon < SE[1]):
        ans = True
    elif (SEC[0] < lat < NEC[0]) and (SOC[1] < lon < SEC[1]):
        ans = True
    else:
        ans = False
    return ans

def tiempovistazo(network):
    url = 'http://www.eltiempodeunvistazo.com/ubicaciones.xml'
    file_name = os.path.join(home, 'webcams_' + network + '.csv')
    try:
        infile = urllib2.urlopen(url)
        logger.info('#### START PYWEBCAM ####')
    except:
        logger.error('Not available %s' % url)
        return
    contents = infile.read()
    soup = BeautifulSoup(contents)
    with open(file_name, 'w') as fp:
        fp.write("%s;%s;%s;%s\n" % ('id', 'lon', 'lat', 'img'))
        # Stations manual #
        fp.write("%s;%s;%s;%s\n" % ('gencat_tavascan','1.256915', '42.644804','http://www.tavascan.net/wp-content/uploads/coses-webcam/webcam.jpg'))
        fp.write("%s;%s;%s;%s\n" % ('gencat_esterri_aneu','1.122711','42.626923','http://www.cannirus.net/rb/foto.jpg'))
        fp.write("%s;%s;%s;%s\n" % ('gencat_saint_joan_lerm','1.286978','42.417716','http://www.santjoandelerm.com/camara/SantJoan.jpg'))
        logger.info('Get data from webcam %s' % 'manual stations')
        # end
        for message in soup.find_all('marker'):
            if 'wunderground' in str(message) or 'Proximamente.jpg' in str(message) or 'metcli' in str(message) or 'infocar.dgt.es' in str(message) or 'Fueraservicio.jpg'in str(message):
                continue
            else:
                lat = find_between(str(message), 'lat="', 'lng=').replace('"', '').strip()
                lon = find_between(str(message), 'lng="', '">').replace('"', '').strip()
                if latlonSpain(lat, lon) is False:
                    logger.error('Station out of area %s' % id)
                    continue
                id = 'tiempovistazo_' + lat[:5].replace('.', '').replace('-', '') + lon[:5].replace('.', '').replace('-', '')
                my_img = find_between(str(message), 'src', 'onError')
                if my_img is not None:
                    img = my_img.replace('=', '').replace('"', '').strip()[1:-1]
                    #to solve a bug about gencat network (catalonya)
                    if '&amp;visualitzacioimatge' in img:
                        img = img.replace('&amp;visualitzacioimatge', '&visualitzacio=imatge').replace('?nom','?nom=')
                    # Analisis de las url para descartar los enlaces rotos (404)
                    try:
                        req = urllib2.Request(img)
                        handle = urllib2.urlopen(req, timeout=5)
                    except (socket.timeout, socket.gaierror) as error:
                        #error timeout
                        logger.error('%s Url %s' % (error, id))
                        continue
                    except urllib2.URLError, e:
                        #error timeout
                        logger.error('%s Url %s' % (e.reason, id))
                        continue
                    except urllib2.HTTPError, e:
                        #url of the image does not work
                        if e.code == 404:
                            logger.error('%s Url not found %s' % (e.code, id))
                        elif e.code == 403:
                            logger.error('%s Url not found (proxy Aemet) %s' % (e.code, id))
                        elif e.code == 408:
                            logger.error('%s Url (timed out) %s' % (e.code, id))
                        elif e.code == 504:
                            logger.error('%s Url (Gateway Timeout) %s' % (e.code, id))
                        else:
                            logger.error('%s Url not found %s' % (e.code, id))
                        continue

                    logger.info('Get data from webcam %s' % id)

                fp.write("%s;%s;%s;%s\n" % (id, lon, lat, img))


    return

def metcli(network):
    meta_url = '/home/radon/html/scripts/pywebcam/meta'
    meta_csv = os.path.join(meta_url, 'meta.csv')

    webcam_url = 'http://www.meteoclimatic.net/webcams'
    file_name = os.path.join(home, 'webcams_' + network + '.csv')

    with open(meta_csv, 'rb') as csvfile:
        table = csv.reader(csvfile)
        with open(file_name, 'w') as fp:
            fp.write("%s;%s;%s;%s\n" % ('id', 'lon', 'lat', 'img'))
            for enum, row in enumerate(table):
                if enum > 0:
                    img = os.path.join(webcam_url, 'g_' + row[0])
                    try:
                        if isinstance(urllib2.urlopen(img).read(), basestring) is True:
                            logger.info('Get data from webcam %s' % row[0])
                            fp.write("%s;%s;%s;%s\n" % (row[0], row[2], row[1], img))

                    except urllib2.HTTPError, e:
                        #url of the image does not work
                        if e.code == 404:
                            logger.error('%s Url not found %s' % (e.code, row[0]))
                        else:
                            logger.error('%s Url not found %s' % (e.code, row[0]))
                            continue
    #send_trueno(file_name)
    return

def DGT(network):

    file_name = os.path.join(home, 'webcams_' + network + '.csv')
    url = 'http://infocar.dgt.es/datex2/dgt/CCTVSiteTablePublication/all/content.xml'

    try:
        infile = urllib2.urlopen(url)
        logger.info('#### START PYWEBCAM ####')
    except:
        logger.error('Not available %s' % url)
        return
    contents = infile.read().replace('_0:','')
    soup = BeautifulSoup(contents)

    with open (file_name, 'w') as fp:
        fp.write("%s;%s;%s;%s\n" % ('id', 'lon', 'lat', 'img'))
        net = 'DGT'
        for message in soup.find_all('cctvcamerametadatarecord'):
            #each message is a block of data from one webcam
            id = find_between(str(message), '<cctvcamerametadatarecord', 'version=').replace('id="','').replace('"','').strip()
            if id is None:
                logger.error('Not found %s' % id)
            for i in message.find_all('urllinkaddress'):
                img = i.text
            # Analisis de las url para descartar los enlaces rotos (404)
            try:
                req = urllib2.Request(img)
                handle = urllib2.urlopen(req, timeout=1)
            except (socket.timeout, socket.gaierror) as error:
                #error timeout
                logger.error('%s Url %s' % (error, id))
                continue
            except urllib2.URLError, e:
                #error timeout
                logger.error('%s Url %s' % (e.reason, id))
                continue
            except urllib2.HTTPError, e:
                #url of the image does not work
                if e.code == 404:
                    logger.error('%s Url not found %s' % (e.code, id))
                elif e.code == 403:
                    logger.error('%s Url not found (proxy Aemet) %s' % (e.code, id))
                elif e.code == 408:
                    logger.error('%s Url (timed out) %s' % (e.code, id))
                elif e.code == 504:
                    logger.error('%s Url (Gateway Timeout) %s' % (e.code, id))
                else:
                    logger.error('%s Url not found %s' % (e.code, id))
                continue

            name = find_between(str(message), '<cctvcameraidentification>', '</cctvcameraidentification>').strip()
            for i in message.find_all('latitude'):
                lat = i.text
            for i in message.find_all('longitude'):
                lon = i.text
            fp.write("%s;%s;%s;%s\n" % (id, float(lon), float(lat), str(img)))

    #send_trueno(file_name)
    return


def send_trueno(file_name):
    os.system('scp {0} wwj@trueno:/www0/wwj/stapwww/datos/webcams/' .format(file_name))

def test():
    network = sys.argv[1]
    if network in ['metcli', 'DGT', 'tiempovistazo']:
        if network == 'metcli':
            metcli(network)
        elif network == 'DGT':
            DGT(network)
        elif network == 'tiempovistazo':
            tiempovistazo(network)
        else:
            None
        return
    else:
        logger.error('Network does not exist!')

if __name__ == "__main__":
    #main()
    test()
