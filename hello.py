import findSentiment
from flask import request, Flask, render_template
app = Flask(__name__)

@app.route("/")
def hello():
	return render_template("test.html")

@app.route("/post_find", methods=["POST"])
def eventually():
	fbPageName = request.form.get("page_name")
	if (getFacebookPageData(page_id) == 'page not found'):
		# do something
	else:
		return fbPageName


if __name__ == "__main__":
    app.run()