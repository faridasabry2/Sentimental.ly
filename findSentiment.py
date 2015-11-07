import indicoio
import requests
import json
import settings
import ast

def getFacebookPageData(page_id):
	access_token = settings.get('ACCESS_TOKEN')
	gettingFacebookPageData(page_id, access_token)

def gettingFacebookPageData(page_id, access_token):

	#construct the URL string
	base = "https://graph.facebook.com/v2.5"
	node = "/" + page_id + "/feed"
	parameters = "/?access_token=%s" % access_token
	url = base + node + parameters

	# retrieve data
	request = requests.get(url)
	r = json.loads(request.text)
	#print "---------------------"
	print json.dumps(r, indent=4, sort_keys=True)
	data = r['data']

	# get all data
	while ('paging' in r):
		url = r['paging']['next']
		request = requests.get(url)
		r = json.loads(request.text)
		if (r['data']):
			data.append(r['data'])

	calculateSentiments(data)

def calculateSentiments(data):	
	indicoio.config.api_key = settings.get('INDICO_API_KEY')

	# calculate each sentiment and add to JSON
	for i in range(0, len(data)):
		post = data[i]

		date = formatDate(data[i]['created_time'])
		data[i]['created_time'] = date

		sentiment = indicoio.sentiment_hq(post['message'])
		sentiment = (sentiment - 0.5) / 0.5
		data[i]['sentiment'] = sentiment

	dataJSONstring = json.dumps(data, indent=4, sort_keys=True)
	dataDictionary = ast.literal_eval(dataJSONstring)
	writeJSON(dataDictionary)

def formatDate(string):
	string = string.strip("+0000")
	string = string.replace("T"," ")

	return string	

def writeJSON(data):
	with open('/static/js/fbPageData.json', 'w') as f:
 		json.dump(data, f)
