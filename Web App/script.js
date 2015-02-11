		//Global Variables
		var resultsPerPage = 10;
		var baseURL = "https://api.github.com/search/repositories?q=";
		var pageNumber = 1;
		var itemLimit = 1000; //maximum number of items GitHub API allows
		
		function searchButtonClicked(){
			pageNumber = 1 ;	//reset page number
			var url = baseURL +  getSearchTerm()	//create url
			+ "&per_page="+ resultsPerPage;
			ajaxGetJSON(url, true);		//get data
		}
		
		function ajaxGetJSON(url, newSearch){
			// Create our XMLHttpRequest object
			var hr = new XMLHttpRequest();
			hr.open("GET", url, true);	
	
			// Set content type
			hr.setRequestHeader("Content-type", "application/json", true);
			
			// Access the onreadystatechange event for the XMLHttpRequest object
			hr.onreadystatechange = function() {
				if(hr.readyState == 4 && hr.status == 200) {
					var data = JSON.parse(hr.responseText);
					if(Boolean(newSearch))	//if we have a new search we must re-populate the select
						populatePageSelect(data.total_count);
					displayResults(data);
				}
			}
			hr.send(null);	//not sending any variables
			results.innerHTML = "requesting...";
		}
		
		function displayResults(data){
			//create search results header
			results.innerHTML = "<h2><a href='https://github.com/search?q="+
						getSearchTerm()+"'>Search Results</a></h2>";
			
			var i;
			for(i=0; i<resultsPerPage; i++){
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
				results.innerHTML += "<article class='topContent'><header><h2>"+ getItemNumber(i+1)+ ") <a href='" + 
				data.items[i]["html_url"]+"'>"+ data.items[i]['full_name'] +
				"</a></h2></header><hr><content><p class='post-info'>" + updatedNew + description + language +
				"</p></content></article>";
			}
		}
		
		function pageNumberChanged(selectForm){
			var selectIndex = selectForm.optionList.selectedIndex;	//find which index is selected
			pageNumber = selectForm.optionList.options[selectIndex].text;	//find what the text of selected index is
		
			var url = baseURL + getSearchTerm() 
			+"&per_page="+ resultsPerPage+ "&page=" + pageNumber;
			ajaxGetJSON(url, false);
		}
		
		function populatePageSelect(totalCount){	//only called after a new search
			var totalPages = Math.ceil(totalCount/resultsPerPage);		//find out total number of pages needed
			if((totalPages*resultsPerPage) > itemLimit)	//if item limit reached
				totalPages = itemLimit/resultsPerPage;	//readjust total pages
							
			optionList.innerHTML ="";	//clear previous page count
			var i;
			for(i=1; i<=totalPages; i++){
				optionList.innerHTML+="<option>"+i+"</option>";
			}
		}
		
		function getSearchTerm(){
			return document.getElementById("inputText").value;
		}
		
		function getItemNumber(i){
			return (((pageNumber-1)*resultsPerPage) +i);
		}
		