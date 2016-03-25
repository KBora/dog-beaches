var dogBeachInitialData = [{
	title: 'Sirius Cove',
	position: {
		lat: -33.839502,
		lng: 151.237244
	},
	offLeash: true,
	offLeashTimes: 'All day Monday to Friday, and before 9am and after 4pm on Saturdays, Sundays and Public Holidays ',
	website: 'http://www.mosman.nsw.gov.au/residents/Pets/where-to-walk-your-dog/'
}, {
	title: 'Clifton Gardens',
	position: {
		lat: -33.838516,
		lng: 151.254275
	},
	offLeash: true,
	offLeashTimes: 'Before 9am and after 4pm weekdays during winter. Before 9am and after 6pm weekdays during daylight savings summer months (Oct – Mar)',
	website: 'http://www.mosman.nsw.gov.au/residents/Pets/where-to-walk-your-dog/'
}, {
	title: 'Dumaresq Reserve',
	position: {
		lat: -33.866418,
		lng: 151.270572
	},
	offLeash: true,
	offLeashTimes: 'Between 4.30pm and 8.30am',
	website: 'http://www.woollahra.nsw.gov.au/services/animals_and_pets/walking_your_dog'
}, {
	title: 'Rowland Reserve',
	position: {
		lat: -33.660741,
		lng: 151.305761
	},
	offLeash: true,
	offLeashTimes: 'All times',
	website: 'http://www.pittwater.nsw.gov.au/property/domestic_animals/dogs/exercise_areas'
}, {
	title: 'Flora and Richie Roberts Reserve',
	position: {
		lat: -33.766673,
		lng: 151.298436
	},
	offLeash: true,
	offLeashTimes: 'All times',
	website: 'http://www.warringah.nsw.gov.au/play/flora-and-ritchie-roberts-reserve'
}, {
	title: 'Bonna Point Reserve',
	position: {
		lat: -34.007235,
		lng: 151.190262
	},
	offLeash: true,
	offLeashTimes: 'All times',
	website: 'http://www.sutherlandshire.nsw.gov.au/Outdoors/Parks-and-Playgrounds/Parks/Bonna-Point-Reserve-Kurnell'
}, {
	title: 'Bondi to Bronte coastal walk',
	position: {
		lat: -33.895492,
		lng: 151.274602
	},
	offLeash: false,
	offLeashTimes: 'Dogs must be on a leash',
	website: 'http://www.waverley.nsw.gov.au/recreation/beaches_and_coast/bondi_to_bronte_coastal_walk'
}

];

/* One of these is created per dog beach */
var DogBeachMarker = function(data) {

	var self = this;

	self.googleMarker = new google.maps.Marker({
		position: data.position,
		map: map,
		title: data.title      
	});
	self.matchesFilter = ko.observable(true);
	self.offLeash = data.offLeash;
	self.offLeashTimes =  data.offLeashTimes;
	self.website = data.website;

};

/* This is used to bind the info window data to the selected marker
 * Only one of these objects is instantiated, in thew ViewModel
 * Binding infowindow is a way of avoiding DOM manipulation via jQuery 
 * https://jsfiddle.net/SittingFox/nr8tr5oo/
 */

var DogBeachInfoWindow = function() {

	var self = this;

	self.title = ko.observable('');
	self.flickrImgURL  = ko.observable('');
	self.apiErrorMessage  = ko.observable('');
	self.offLeashTimes = ko.observable('');
	self.website = ko.observable('');

	// The HTML for this is stored in a template in the index.html
	// The $data object (which is this current object) is passed as the data parameter
	// This syntax took me while to guess

	var infoWindowHTML = '<div id="info-window"' +
                'data-bind="template: { name: \'info-window-template\', data: $data}">' + 
                '</div>';

	self.infoWindow = new google.maps.InfoWindow({
		content : infoWindowHTML,
		maxWidth : 350
	});
	var isInfoWindowLoaded = false;

	
	// When the info window opens, bind it to Knockout.
	// Only do this once.
	google.maps.event.addListener(self.infoWindow, 'domready', function () {
		if (!isInfoWindowLoaded) {
			ko.applyBindings(self, $("#info-window")[0]);
			isInfoWindowLoaded = true;
		}
	});

};

var ViewModel = function() {

	var self = this;

	// Declare array that will hold all the markers
	self.dogBeaches = ko.observableArray([]);

	// Create DogBeachInfoWindow object
	self.dogBeachInfoWindow = new DogBeachInfoWindow();

	// Create markers from initial data and add to array
	dogBeachInitialData.forEach(function(data) {

		var dogBeachMarker = new DogBeachMarker(data);

		dogBeachMarker.clickMarker = returnClickMarkerFunction(dogBeachMarker, self.dogBeachInfoWindow);

		// Assign event listeners to marker
		dogBeachMarker.googleMarker.addListener('click', dogBeachMarker.clickMarker);

		// Add DogBeachMarker object to the array
		self.dogBeaches.push( dogBeachMarker );
		
	});


	// Returns a function that will animate the marker and open/populate the infoWindow
	function returnClickMarkerFunction(dogBeachMarker, dogBeachInfoWindow) {

		return function() {

			// Hide the nav list if visible, so that map and infowindow can be seen
			// Only valid for smaller viewports since listVisible cannot be toggled on desktops due to hidden toggle button
			if (self.listVisible()) {
				self.toggleList();
			}

			// Animate marker by bouncing it
			animateMarker(dogBeachMarker.googleMarker);
			
			// Open InfoWindow
			self.dogBeachInfoWindow.infoWindow.open(map, dogBeachMarker.googleMarker);

			// Set the observables in the info window
			// Title
			self.dogBeachInfoWindow.title(dogBeachMarker.googleMarker.title);
			// Off Leash Times
			self.dogBeachInfoWindow.offLeashTimes(dogBeachMarker.offLeashTimes);
			// Website
			self.dogBeachInfoWindow.website(dogBeachMarker.website);
			// Image
			loadFlickrImages(dogBeachMarker, dogBeachInfoWindow);

		};

	}

	// Looks up the Flickr API to retrieve an image based on the title of the marker
	// Saves the result in the dogBeachInfoWindow model
	function loadFlickrImages( dogBeachMarker, dogBeachInfoWindow) {
		// Search flickr for one image
		var flickURL =  'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=eebfb336fe500c5469321951f38d7853&tags=' 
		+ dogBeachMarker.googleMarker.title + '&per_page=1&format=json&jsoncallback=?';

		var imgURL = '';

		// Set a loading image in the infoWindow 
		self.dogBeachInfoWindow.flickrImgURL('img/running-dog-grey.gif');

		$.ajax({
			url : flickURL,
			dataType : 'jsonp'
		}).done(function(data) {

			var photoList = data.photos.photo;
			
			for (var i = 0; i < photoList.length; i++) {
				// construct URL as per https://www.flickr.com/services/api/misc.urls.html 
				imgURL = 'https://farm' + photoList[i].farm + '.staticflickr.com/'
				+ photoList[i].server + '/' + photoList[i].id + '_' + photoList[i].secret + '_m.jpg';
			}

		}).fail(function() {

			dogBeachInfoWindow.apiErrorMessage('Cannot load Flickr images at this time.');

		}).complete(function() {

			dogBeachInfoWindow.flickrImgURL(imgURL);

		});
	}


	// Animate marker
	function animateMarker(googleMarker) {

		googleMarker.setAnimation(google.maps.Animation.BOUNCE);
		window.setTimeout(function() {
			googleMarker.setAnimation(null);
		}, 3500);

	}

	// Declare query variable to hold contents of search bar 
	self.query = ko.observable('');


	// Filters the dog beaches array
	// Implemented using a computed observable that looks the 'query' value
	self.dogBeachesFiltered = ko.computed(function() {
		// grab the query value
		var filter = self.query().toLowerCase();

		//filter the dogBeaches using the arrayFilter utility function
		return ko.utils.arrayFilter(this.dogBeaches(), function(item) {
			// if filter string is in the dogBeach title, then add to filtered array
			// if filter string is blank (default state) then this should return all the items
			var filterMatch = item.googleMarker.title.toLowerCase().indexOf(filter) !== -1;
			item.googleMarker.setVisible(filterMatch);
			return filterMatch;
		});

		// }
	}, self);


	// Visibility of the navigation list section
	self.listVisible = ko.observable(false);


	// Determine button text
	self.listToggleButtonText = ko.computed( function() {
		return self.listVisible() ? 'HIDE LIST' : 'SHOW LIST';
	}, self);

	// Toggle visiblity of the navigation list section
	self.toggleList = function() {
		self.listVisible(!self.listVisible());
	};


};
