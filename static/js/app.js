var main = function() {

	generateDataForLineChart();

	//Load data and call bar chart function 
	// d3.json("/static/js/fbPageData.json", function(error, data){
			
	// 		if(error){
	// 			alert(error);
	// 		}
	// 		else{
	// 			data.forEach(function(d) {
	// 				d.postSentiment = d.sentiment;
	// 			});

	// 			barChart(data);
	// 		}
	// 	});

	// Load facebook post data
	var postID = 0;
	$.getJSON("/static/js/fbPageData.json", function(json){
			var postContainer = $('.posts-display');
			json.forEach(function(data) {
				var post = $("<div>");
				post.addClass("media");
				var postIdValue = "postID-"+postID;
				post.attr('id', postIdValue);
				postID++;
				post.text(data.message);

				var postInfo = $("<p>");
				postInfo.addClass("post-info");

				// get from data
				var nComments = 101;
				var nLikes = 1034;
				var nShares = 45;

				postInfo.text(nComments+" Comments • "+nLikes+" Likes • "+nShares+" Shares");
				post.append(postInfo);

				// post.hover(function() {
				// 	$(this).css("background-color", "yellow");
				// 	}, function() {
				// 	$(this).css("background-color", "white");
				// });

				post.click(function() {
					$(".media").removeClass("active");

					var scrollToPost = $(this);
					postContainer.animate({
						scrollTop: scrollToPost.offset().top - postContainer.offset().top + postContainer.scrollTop()
					}, 1000);

					scrollToPost.addClass("active");
				});

				postContainer.append(post);

			});
	});

};

$(document).ready(main);