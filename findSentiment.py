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
	#node = "/" + page_id + "/feed?fields=message,created_time,story,comments{message,created_time}"
	node = "/" + page_id + "/feed?fields=message,likes,created_time,story,comments{message,created_time}"
	#node = "/" + page_id + "/feed?fields=message,story,created_time,comments{message,created_time},likes.limit(1).summary(true)"
	parameters = "&access_token=%s" % access_token
	url = base + node + parameters

	# g = facebook.GraphAPI('1918180781739655|5a76107345f3aac0ba8083549cae9955')
	# print "ms"
	# print g.getconnections(page_id,'links',limit=25,after='WTI5dGJXVnVkRjlqZFhKemIzSTZNVEF4T0RreE1UZzJNVFE0TXpVM05qb3hORFV3TURNeE1UZzE=')

	# retrieve data
	try:
		request = requests.get(url)
	except request.exceptions.ConnectionError as e:
		handleIncorrectURL()

	r = json.loads(request.text)
	
	print "json dump stuff - bye bye"
	#print json.dumps(r, indent=4, sort_keys=True)
	if ('error' in r):
		handleIncorrectURL()
	
	print json.dumps(r, indent=4, sort_keys=True)
	data = r['data']
	print "initial data"
	#print data

	# get all data
	# while ('paging' in r):
	# 	url = r['paging']['next']
	# 	request = requests.get(url)
	# 	r = json.loads(request.text)
	# 	if (r['data']):
	# 		data.extend(r['data'])

	print "done getting Facebook Page Data"
	print "now all data"
	#print data
	return data

def calculateSentiments(data):	
	indicoio.config.api_key = settings.get('INDICO_API_KEY')

	# calculate each sentiment and add to JSON
	toAnalyze = []
	emptyMessagesIndexes = []
	for i in range(0, len(data)):
		post = data[i]
		print "now we get the POST"
		#print post
		dateOfPost = formatDate(data[i]['created_time'])
		data[i]['created_time'] = dateOfPost
		postURL = "www.facebook.com/"+post['id']
		data[i]['postURL'] = postURL
		# Get and add the number of likes of a certain post
		if ('likes' in post):
			numLikes = len(post['likes']['data'])
			print "numLikes"
			print numLikes
			data[i]['numLikes'] = numLikes
		else:
			print "no LIKES"
			data[i]['numLikes'] = 0
		# I choose 0 to be the default for posts that do not have comments
		data[i]['commentsAvgSentiments'] = 0
		# Getting the comments
		if ('comments' in post):
			print "looks like we have some comments"
			allCommentsPerPost = post['comments']['data']
			#print allCommentsPerPost
			# Note: All comments do show
			#print len(allCommentsPerPost)

			#Show all possible comments - also coming from next pages
			#TO DO

			avgScoreOfComments = 0
			for j in range(0, len(allCommentsPerPost)):
				comment = allCommentsPerPost[j]
				print "individual comment"
				print comment
				dateOfComment = formatDate(comment['created_time'])
				data[i]['comments']['data'][j]['created_time'] = dateOfComment
				if comment['message'] != '':
					scoreOfComment = indicoio.sentiment(comment['message'])
					scoreOfComment = (scoreOfComment - 0.5) * 2
				else:
					scoreOfComment = 0
				data[i]['comments']['data'][j]['individualCommentSentiment'] = scoreOfComment
				data[i]['comments']['data'][j]['postURL'] = postURL
				avgScoreOfComments = avgScoreOfComments + scoreOfComment

			avgScoreOfComments = avgScoreOfComments / len(allCommentsPerPost)

			#Add the avg score for comments of a certain post to the dictionary
			data[i]['commentsAvgSentiments'] = avgScoreOfComments

		if ('story' in post):
			if post['story'] != '':
				key = 'story'
			else:
				emptyMessagesIndexes.append(i)
		elif ('message' in post):
			if post['message'] != '':
				key = 'message'
			else:
				emptyMessagesIndexes.append(i)
		# !!!! it might be best to take the last elif out. Since there is no use to dealing with a post that has no message. This might also explain why other pages are problematic, some have photos etc...so not "test" per se
		# elif ('story' not in post and 'message' not in post):
		# 	key = 'message'
		# 	data[i]['message'] = ''
		# 	post = data[i]
		toAnalyze.append(post[key])
		if len(emptyMessagesIndexes) != 0:
			for k in range(0, len(emptyMessagesIndexes)):
				del toAnalyze[k]

	sentiments = indicoio.sentiment(toAnalyze)

	for i in range(0, len(sentiments)):
		sentiments[i] = (sentiments[i] - 0.5) / 0.5
		data[i]['sentiment'] = sentiments[i]

	dataJSONstring = json.dumps(data)
	dataDictionary = ast.literal_eval(dataJSONstring)
	print json.dumps(data, indent=4, sort_keys=True)
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

#writeFacebookPageDataToJSON("testmyhappiness")
