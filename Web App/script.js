		var resultsPerPage = 10;
		var baseURL = "https://api.github.com/search/repositories?q=";
		var pageNumber = 1;
		
		function searchButtonClicked(){
			var url = baseURL + document.getElementById("inputText").value 
			+ "&per_page="+ resultsPerPage;
			document.getElementById("myForm").reset();	//reset form to clear previous select values
			ajaxGetJSON(url, true);
			pageNumber = 1 ;
			
		}
		
		function ajaxGetJSON(url, populateSelect){
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
					if(Boolean(populateSelect)){
						var totalPages = Math.ceil(data.total_count/resultsPerPage);
						if((totalPages*resultsPerPage) > 1000)	//limit
							totalPages = 1000/resultsPerPage;
						populatePageSelect(totalPages);
					}
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
				results.innerHTML += "<article class='topContent'><header><h2>"+getItemNumber(i+1)+") <a href='" + 
				data.items[i]["html_url"]+"'>"+data.items[i]['full_name']+
				"</a></h2></header><hr><content><p class='post-info'>"+updatedNew+description+language+
				"</p></content></article>";
			}
		}
		
		function getItemNumber(i){
			return (((pageNumber-1)*10) +i);
		}
		
		function populatePageSelect(totalPages){	//only called after a new search
			var i;
			for(i=1; i<=totalPages; i++){
				optionList.innerHTML+="<option>"+i+"</option>";
			}
		}
		
		function handleSelect(selectForm){
			var selectIndex = selectForm.optionList.selectedIndex;	//find which index is selected
			pageNumber = selectForm.optionList.options[selectIndex].text;	//find what the text of selected index is
		
			var url = baseURL + document.getElementById("inputText").value 
			+"&per_page="+ resultsPerPage+ "&page=" + pageNumber;
			ajaxGetJSON(url, false);
		}
		
		
		