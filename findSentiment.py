import indicoio
import requests
import json
import settings
import ast
import os

def writeFacebookPageDataToJSON(page_id):
	access_token = settings.get('ACCESS_TOKEN')
	page_id = page_id.replace(" ", "")
	data = gettingFacebookPageData(page_id, access_token)
	dataDictionary = calculateSentiments(data)
	writeJSON(dataDictionary)


def gettingFacebookPageData(page_id, access_token):

	#construct the URL string
	base = "https://graph.facebook.com/v2.5"
	node = "/" + page_id + "/feed?fields=message,comments,created_time"
	parameters = "&access_token=%s" % access_token
	url = base + node + parameters

	# retrieve data
	try:
		request = requests.get(url)
	except request.exceptions.ConnectionError as e:
		handleIncorrectURL()

	r = json.loads(request.text)
	
	print json.dumps(r, indent=4, sort_keys=True)
	if ('error' in r):
		handleIncorrectURL()
	
	data = r['data']

	# get all data
	while ('paging' in r):
		url = r['paging']['next']
		request = requests.get(url)
		r = json.loads(request.text)
		if (r['data']):
			data.extend(r['data'])

	print "done getting Facebook Page Data"
	return data

def calculateSentiments(data):	
	indicoio.config.api_key = settings.get('INDICO_API_KEY')

	# calculate each sentiment and add to JSON
	toAnalyze = []
	for i in range(0, len(data)):
		post = data[i]
		#print post
		date = formatDate(data[i]['created_time'])
		data[i]['created_time'] = date
		if ('story' in post):
			key = 'story'
		elif ('message' in post):
			key = 'message'
		elif ('story' not in post and 'message' not in post):
			key = 'message'
			data[i]['message'] = ''
			post = data[i]
		toAnalyze.append(post[key])

	sentiments = indicoio.sentiment(toAnalyze)

	for i in range(0, len(sentiments)):
		sentiments[i] = (sentiments[i] - 0.5) / 0.5
		data[i]['sentiment'] = sentiments[i]

	dataJSONstring = json.dumps(data)
	dataDictionary = ast.literal_eval(dataJSONstring)
	return dataDictionary

def formatDate(string):
	string = string.strip("+0000")
	string = string.replace("T"," ")

	return string

def writeJSON(data):
	currentPath = os.getcwd()
	path = currentPath + '/static/js/fbPageData.json'
	# print json.dumps(data, indent=4, sort_keys=True)
	with open(path, 'w') as f:
 		json.dump(data, f)
 	print "done writing"

def handleIncorrectURL():
	print "page not found error"
	return -1

writeFacebookPageDataToJSON("testmyhappiness")
