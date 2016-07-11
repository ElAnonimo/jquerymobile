$(document).on('pageinit', function() {
	// display runs
	showRuns();
	
	// add handler
	$('#submitAdd').on('tap', addRun);
	
	// edit handler
	$('#submitEdit').on('tap', editRun);
	
	// set current handler
	$('#stats').on('tap', '#editLink', setCurrent);
	
	// delete handler
	$('#stats').on('tap', '#deleteLink', deleteRun);
	
	// clear total mileage handler
	$('#clearRuns').on('tap', clearRuns);
	
	/*
	 * show all runs on home page
	 */
	function showRuns() {
		// get runs object
		var runs = getRunsObject();
		
		// check if empty
		if (runs != '' && runs != null) {			// runs comes from localStorage as a string
			for (var i = 0; i < runs.length; i++) {
				$('#stats').append(
					'<li class="ui-body-inherit ui-li-static">' +
						'<strong>Date: </strong>' + runs[i]["date"] +
						'<br>' +
						'<strong>Miles: </strong>' + runs[i]["miles"] + ' m<div class="controls"><a href="#edit" id="editLink" data-miles="' + runs[i]['miles'] + '" data-date="' + runs[i]['date'] + '">Edit</a> | <a href="#" id="deleteLink" data-miles="' + runs[i]['miles'] + '" data-date="' + runs[i]['date'] + '" onclick="return confirm(\'Are you sure?\')">Delete</a></div>' + 
					'</li>');
			}
			$('#home').bind('pageinit', function() {
				$('#stats').listview('refresh');
			});
		} else {
			$('#stats').html('<p>You have no logged runs</p>');
		}
	}
	
	/*
	 * Add a run
	 */
	function addRun() {
		// get form values
		var miles = $('#addMiles').val();
		var date = $('#addDate').val();
		
		// create 'run' object
		var run = {
			date: date,
			miles: parseFloat(miles)
		};
		
		var runs = getRunsObject();
		
		// add a run to runs array
		runs.push(run);
		alert('Run added');
		
		// set stringified object to localStorage
		localStorage.setItem('runs', JSON.stringify(runs));
		
		// redirect
		window.location.href = 'index.html';
		
		return false;		// so the form won't actually submit
	}
	
	/*
	* edit run
	*/
	function editRun() {
		// get current data
		currentMiles = localStorage.getItem('currentMiles');
		currentDate = localStorage.getItem('currentDate');
		
		var runs = getRunsObject();
		
		// loop through current runs
		for (var i = 0; i < runs.length; i++) {
			if (runs[i].miles == currentMiles && runs[i].date == currentDate) {		
				runs.splice(i, 1);	// delete current miles and date cause on edit we set new values instead. Just below in update_run
				break;
			}
		}
		localStorage.setItem('runs', JSON.stringify(runs));

		// get form values
		var miles = $('#editMiles').val();
		var date = $('#editDate').val();
		
		// create 'run' object
		var update_run = {
			date: date,
			miles: parseFloat(miles)
		};
		
		// add a run to runs array
		runs.push(update_run);
		alert('Run updated');
		
		// set stringified object to localStorage
		localStorage.setItem('runs', JSON.stringify(runs));
		
		// redirect
		window.location.href = 'index.html';
		
		return false;		// so the form won't actually submit
	}
	
	/*
	* delete run
	*/
	function deleteRun() {
		// set localStorage items
		localStorage.setItem('currentMiles', $(this).data('miles'));		// $(this) is the clicked delete link (#deleteLink)
		localStorage.setItem('currentDate', $(this).data('date'));
		
		// get current data
		currentMiles = localStorage.getItem('currentMiles');
		currentDate = localStorage.getItem('currentDate');
		
		var runs = getRunsObject();
		
		// loop through current runs
		for (var i = 0; i < runs.length; i++) {
			if (runs[i].miles == currentMiles && runs[i].date == currentDate) {		
				runs.splice(i, 1);	// delete current miles and date
				break;
			}
		}
		localStorage.setItem('runs', JSON.stringify(runs));
		
		alert('Run deleted');
		
		// redirect
		window.location.href = 'index.html';
		
		return false;		// so the form won't actually submit
	}
	
	function clearRuns() {
		localStorage.removeItem('runs');
		$('#stats').html('<p>You have no logged runs</p>');
	}
	
	/*
	* get the runs object
	*/
	function getRunsObject() {
		// set runs array
		var runs = new Array();
		// get current runs from localStorage. Comes from localStorage as a string. localStorage is an HTML5 thing, it stores only strings
		var currentRuns = localStorage.getItem('runs');
		
		// check localStorage if currentRuns is empty
		if (currentRuns != null) {
			// set it to runs
			var runs = JSON.parse(currentRuns);
		}
		
		// return runs
		return runs.sort(function(a, b) {
			return new Date(b.date) - new Date(a.date);			// sorting runs: newish runs appears first
		});
	}
	
	// set the current clicked miles and date
	function setCurrent() {
		// set localStorage items
		localStorage.setItem('currentMiles', $(this).data('miles'));		// $(this) is the clicked edit link (#editLink) on line 28
		localStorage.setItem('currentDate', $(this).data('date'));
		
		// insert localStorage items to form fields
		$('#editMiles').val(localStorage.getItem('currentMiles'));
		$('#editDate').val(localStorage.getItem('currentDate'));
	}
});