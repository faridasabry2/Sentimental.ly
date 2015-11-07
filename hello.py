#import sentimentcalculation
from flask import request, Flask, render_template
app = Flask(__name__)

@app.route("/")
def hello():
	return render_template("test.html")

@app.route("/post_find", methods=["POST"])
def eventually():
	#hdata = request.form.get("page_name")
	#getFacebookPageData(hdata)
	return request.form.get("page_name")


if __name__ == "__main__":
    app.run()