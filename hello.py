#import findSentiment
from flask import request, Flask, render_template
app = Flask(__name__)

@app.route("/")
def hello():
	return render_template("test.html")

@app.route("/post_find", methods=["POST"])
def eventually():
	fbPageName = request.form.get("page_name")
	if (getFacebookPageData(fbPageName) == 'page not found'):
		print 'page not found'
	else:
		return fbPageName



if __name__ == "__main__":
    app.run()