#!/usr/bin/python3
from __future__ import print_function

import json
import re
import requests
import sys
import time

session = requests.Session()

username = sys.argv[1]
password = sys.argv[2]

class Unbuffered(object):
   def __init__(self, stream):
       self.stream = stream
   def write(self, data):
       self.stream.write(data)
       self.stream.flush()
   def writelines(self, datas):
       self.stream.writelines(datas)
       self.stream.flush()
   def __getattr__(self, attr):
       return getattr(self.stream, attr)

sys.stdout = Unbuffered(sys.stdout)

print("Fetching request ID for account...")
res = session.get('https://login.comcast.net/login?r=comcast.net&s=oauth&continue=https%3A%2F%2Flogin.comcast.net%2Foauth%2Fauthorize%3Fclient_id%3Dmy-account-web%26redirect_uri%3Dhttps%253A%252F%252Fcustomer.xfinity.com%252Foauth%252Fcallback%26response_type%3Dcode%26state%3D%2523%252Fdevices%26response%3D1&client_id=my-account-web')
assert res.status_code == 200
m = re.search(r'<input type="hidden" name="reqId" value="(.*?)">', res.text)
req_id = m.group(1)

data = {
    'user': username,
    'passwd': password,
    'reqId': req_id,
    'deviceAuthn': 'false',
    's': 'oauth',
    'forceAuthn': '0',
    'r': 'comcast.net',
    'ipAddrAuthn': 'false',
    'continue': 'https://login.comcast.net/oauth/authorize?client_id=my-account-web&redirect_uri=https%3A%2F%2Fcustomer.xfinity.com%2Foauth%2Fcallback&response_type=code&state=%23%2Fdevices&response=1',
    'passive': 'false',
    'client_id': 'my-account-web',
    'lang': 'en',
}

print("Posting login credentials...")
res = session.post('https://login.comcast.net/login', data=data)
assert res.status_code == 200

print("Recieving preloader HTML...")
res = session.get('https://customer.xfinity.com/Secure/Preloading/?backTo=%2fMyServices%2fInternet%2fUsageMeter%2f')
assert res.status_code == 200

print("Recieving preloader AJAX...")
res = session.get('https://customer.xfinity.com/Secure/Preloader.aspx')
assert res.status_code == 200

print("Waiting 5 seconds for preload...")
time.sleep(5)

print("Pulling usage data...")
res = session.get('https://customer.xfinity.com/MyServices/Internet/UsageMeter/')
assert res.status_code == 200
html = res.text

# Example HTML:
#    <div class="cui-panel-body">
#        <!-- data-options:
#                unit (string) - fills in labels; example: GB, MB, miles;
#                max (number, optional) - the 100% number of the bar
#                increment (number, optional) - the number between grid lines
#                -->
#        <span class="cui-usage-label"><p>Home Internet Usage</p></span>
#        <div data-component="usage-meter"
#            data-options="hideMax:true;divisions:4;
#                          unit:GB;
#                          max:1024;
#                          increment:50
#                          ">
#            <div class="cui-usage-bar" data-plan="1024">
#                <span data-used="222" data-courtesy="false">
#                    <span class="accessibly-hidden">222GB of 1024GB</span>
#                </span>
#            </div>
#            <div class="cui-usage-label">
#                <span>
#                    222GB of 1024GB
#                </span>
#                <!--<p><a href="#">View details</a></p>-->
#                <span class="marker"></span>
#            </div>
#        </div>

used = None
m = re.search(r'<span data-used="(\d+)"', html)
if m:
    used = int(m.group(1))

total = None
m = re.search(r'<div class="cui-usage-bar" data-plan="(\d+)">', html)
if m:
    total = int(m.group(1))

unit = None
m = re.search(r'<div data-component="usage-meter"\s*data-options="([^"]*)"', html)
if m:
    opts = m.group(1)
    opts = re.sub(r'\s+', '', opts)  # remove whitespace
    m = re.search(r'unit:(\w+);', opts)
    if m:
        unit = m.group(1)

print(json.dumps({
    'used': used,
    'total': total,
    'unit': unit,
}))

sys.stdout.flush()
