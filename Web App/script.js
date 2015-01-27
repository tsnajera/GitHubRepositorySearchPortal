function buttonClicked(){
			var url = "https://api.github.com/search/repositories?q=" + 
							document.getElementById("inputText").value + "&per_page=50";
			ajaxGetJSON(url);
		}
		
		function ajaxGetJSON(url){
			// Create our XMLHttpRequest object
			var hr = new XMLHttpRequest();
			hr.open("GET", url, true);	
	
			// Set content type
			hr.setRequestHeader("Content-type", "application/json", true);
			// Access the onreadystatechange event for the XMLHttpRequest object
			hr.onreadystatechange = function() {
				if(hr.readyState == 4 && hr.status == 200) {
					var data = JSON.parse(hr.responseText);
					results.innerHTML = "<h2><a href='https://github.com/search'>Search Results</a></h2>";
					displayData(data);
				}
			}
			hr.send(null);	//not sending any variables
			results.innerHTML = "requesting...";
		}
		
		function displayData(data){
			var i;
			for(i=0; i<data.total_count; i++){
				//last updated
				var updated = data.items[i]['updated_at'];
				var updatedNew = "Last updated " + updated.substring(0, 10);
				
				//Description
				var description = data.items[i]['description'];
				if(description != "")
					description =  "<br>" + description;
					
				//programming language
				var language = data.items[i]['language'];
				if(language == null)
					language = "";
				else
					language = "<br>Written in " + language;
					
				//populate div
				results.innerHTML += "<article class='topContent'><header><h2>"+(i+1)+") <a href='" + 
				data.items[i]["html_url"]+"'>"+data.items[i]['full_name']+
				"</a></h2></header><hr><content><p class='post-info'>"+updatedNew+description+language+
				"</p></content></article>";
			}
}