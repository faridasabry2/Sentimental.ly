import findSentiment
from flask import request, Flask, render_template
app = Flask(__name__)

@app.route("/")
def hello():
	return render_template("postCommentsLineGraph.html")

# @app.route("/post_find", methods=["POST"])
# def eventually():
# 	fbPageName = request.form.get("fbpage_name")
# 	findSentiment.writeFacebookPageDataToJSON(fbPageName)
# 	return render_template("test.html")
	

# @app.route("/posts_and_comments", methods=["POST"])
# def showLineGraphs():
# 	fbPageName = request.form.get("fbpage_name")
# 	findSentiment.writeFacebookPageDataToJSON(fbPageName)
# 	return render_template("testComments.html")

@app.route("/test_newGraph", methods=["POST"])
def testLineGraphs():
	fbPageName = request.form.get("fbpage_name")
	findSentiment.writeFacebookPageDataToJSON(fbPageName)
	return render_template("postCommentsLineGraph.html")

if __name__ == "__main__":
	app.debug = True
	app.run()