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
	var postContainer = $('.post-display');
	$.getJSON("/static/js/fbPageData.json", function(json){
			
			json.forEach(function(data) {
				
				var post = $("<div>");
				post.addClass("media");
				
				//----------post ID------------
				var postIdValue = "postID-"+postID;
				post.attr('id', postIdValue);
				postID++;
				post.text(data.message);

				//----------post info------------
				var postInfoDiv = $("<div>");
				postInfoDiv.addClass("post-info");
				
				var postInfo = $("<p>");
				// ******************CHANGE
				var nComments = 101;
				var nLikes = 1034;
				var nShares = 45;

				postInfo.text(nComments+" Comments • "+nLikes+" Likes • "+nShares+" Shares");
				postInfoDiv.append(postInfo);
				post.append(postInfoDiv);

				//----------post options------------
				var postOptionsDiv = $("<div>");
				postOptionsDiv.addClass("post-options");
				var commentAnalysisLink = $("<a>");
				commentAnalysisLink.text("See detailed comment analysis");
				postOptionsDiv.append(commentAnalysisLink);
				postOptionsDiv.click(function() {

					
					var commentDataString = $(this).parent().children(".post-data").text();
					loadCommentAnalysis(commentDataString);

					var body = $("body");
					body.animate({
						scrollTop: $(".full-page").first().next().offset().top
						}, 1000);
				})
				postOptionsDiv.hide();
				post.append(postOptionsDiv);

				//----------store post/message data as hidden------------
				var postData = $("<div>");
				postData.addClass("post-data");
				postData.text( JSON.stringify(data) );
				postData.hide();
				post.append(postData);

				//----------post interactivity------------
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

function loadCommentAnalysis(postDataString) {
	
	// change string into json
	var postData = JSON.parse(postDataString);

	if (postData.comments == undefined ) {
		alert("There are no comments to analyze!");
	} else {
		var postSentiment = postData.sentiment;

		var commentData = postData.comments.data;

		// change name of sentiment
		commentData.forEach(function(data) {
			data.commentSentiment = parseFloat(data.individualCommentSentiment);
		});

		// create bar chart
		barChart(commentData, postSentiment);

		// create comment display
		loadCommentDisplay(postData)
	}

};

function loadCommentDisplay(postData) {

};


$(document).ready(main);