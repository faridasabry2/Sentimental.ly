var main = function() {

	//------------ post information ----------------------------
	d3.json("/static/js/fbPageData.json", function(error, data){
			
			if(error){
				alert("effor with json "+error);
			}
			else{
				data.forEach(function(d) {
					d.postSentiment = d.sentiment;
				});

				barChart(data);
			}
	});
	generateDataForLineChart();

	// Load facebook post data
	var postID = 0;
	$.getJSON("/static/js/fbPageData.json", function(json){
			var postContainer = $('.media-display');
			json.forEach(function(data) {
				var post = $("<div>");
				post.addClass("media");
				var postIdValue = "postID-"+postID;
				post.attr('id', postIdValue);
				postID++;
				post.text(data.message);

				// post info
				var postInfoDiv = $("<div>");
				postInfoDiv.addClass("post-info");
				
				var postInfo = $("<p>");
				// get from data
				var nComments = 101;
				var nLikes = 1034;
				var nShares = 45;

				postInfo.text(nComments+" Comments • "+nLikes+" Likes • "+nShares+" Shares");
				postInfoDiv.append(postInfo);
				post.append(postInfoDiv);

				// post options
				var postOptionsDiv = $("<div>");
				postOptionsDiv.addClass("post-options");
				var commentAnalysisLink = $("<a>");
				commentAnalysisLink.text("See detailed comment analysis");
				postOptionsDiv.append(commentAnalysisLink);
				postOptionsDiv.click(function() {

					//loadCommentAnalysis($(this).children("message-data").text());

					var body = $("body");
					body.animate({
						scrollTop: $(".full-page").first().next().offset().top
						}, 1000);
				})
				postOptionsDiv.hide();
				post.append(postOptionsDiv);

				// post interactivity
				post.click(function() {
					$(".media").removeClass("active");
					$('.post-options').hide();
					var scrollToPost = $(this);
					postContainer.animate({
						scrollTop: scrollToPost.offset().top - postContainer.offset().top + postContainer.scrollTop()
					}, 1000);

					scrollToPost.addClass("active");
					scrollToPost.children(".post-options").show();
				});

				postContainer.append(post);

			});

	});



};

//------------ comment information ----------------------------

function loadCommentAnalysis(messageData) {

	// change string into json
	var messageData = json.parse(messageData);

	var messageSentiment = messageData.sentiment;

	var commentData = messageData.comments.data;

	// change name of sentiment
	commentData.forEach(function(data) {
		d.commentSentiment = d.individualCommentSentiment;
	});

	// create bar chart
	barChart(commentData, messageSentiment);

	// create comment display

};


$(document).ready(main);