import findSentiment
from flask import request, Flask, render_template
app = Flask(__name__)

@app.route("/")
def hello():
	return render_template("test.html")

@app.route("/post_find", methods=["POST"])
def eventually():
	fbPageName = request.form.get("page_name")
	findSentiment.writeFacebookPageDataToJSON(fbPageName)
	return render_template("test.html")
	

if __name__ == "__main__":
	app.debug = True
	app.run()