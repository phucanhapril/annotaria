# -*- coding: utf-8 -*-

import json
from pprint import pprint
json_data=open('jsonTest.json')
data = json.load(json_data)
json_data.close()

print data["maps"][0]["id"]
data["masks"]["id"]
data["om_points"]
