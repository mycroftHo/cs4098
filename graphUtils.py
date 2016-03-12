import json

with open('graph.json') as data_file:
	data = json.load(data_file)

#print json.dumps(data, indent = 4, sort_keys = False, separators = (',', ':'))

cells = data["cells"]