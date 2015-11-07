#import findSentiment
from flask import request, Flask, render_template
app = Flask(__name__)

@app.route("/")
def hello():
	return render_template("test.html")

@app.route("/post_find", methods=["POST"])
def eventually():
<<<<<<< Updated upstream
	fbPageName = request.form.get("page_name")
	if (getFacebookPageData(page_id) == 'page not found'):
<<<<<<< HEAD
		# do something
	else:
		return fbPageName
=======
		
	return fbPageName
=======
	#fbPageName = request.form.get("page_name")
	#getFacebookPageData(page_id)
	#return fbPageName
	return request.form.get("page_name")
>>>>>>> Stashed changes
>>>>>>> c84a2a0d943c32683a6ff3a15ad0684ff1ca69af


if __name__ == "__main__":
    app.run()