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


var ViewModel = function() {

	var self = this;

	// Declare array that will hold all the markers
	self.dogBeaches = ko.observableArray([]);


	// InfoWindow Observables
	self.selectedMarkerTitle = ko.observable('');


	// Create one infoWindow that will display content and images for each marker
	var infoWindowHTML = '<div id="info-window"' +
                'data-bind="template: { name: \'info-window-template\', data: selectedMarkerTitle }">' +
                '</div>';

	self.infoWindow = new google.maps.InfoWindow({
		content : infoWindowHTML,
		maxWidth : 350
	});
	var isInfoWindowLoaded = false;
	/*
	 * When the info window opens, bind it to Knockout.
	 * Only do this once.
	 */
	google.maps.event.addListener(self.infoWindow, 'domready', function () {
		if (!isInfoWindowLoaded) {
			ko.applyBindings(self, $("#info-window")[0]);
			isInfoWindowLoaded = true;
		}
	});

	// Create markers from initial data and add to array
	dogBeachInitialData.forEach(function(data) {

		var dogBeachMarker = new DogBeachMarker(data);

		// Using the IIFE pattern here (I think)
		dogBeachMarker.clickMarker = returnClickMarkerFunction(dogBeachMarker);

		// Assign event listeners to marker
		dogBeachMarker.googleMarker.addListener('click', dogBeachMarker.clickMarker);

		// Add DogBeachMarker object to the array
		self.dogBeaches.push( dogBeachMarker );
		
	});

	// Returns a function that will animate the marker and load the infoWindow
	// dogBeachMarker is in the closure (Reviewer: please check if this is a correct statement)
	function returnClickMarkerFunction(dogBeachMarker) {

		return function() {

			// Hide the nav list if visible, so that map and infowindow can be seen
			// Only valid for smaller viewports since listVisible cannot be toggled on desktops due to hidden toggle button
			if (self.listVisible()) {
				self.toggleList();
			}

			// Animate marker by bouncing it
			animateMarker(dogBeachMarker.googleMarker);
			
			// Open infoWindow  with HTML formatted data from flickr and the dogbeachmaker
			//infoWindow.setContent(generateInfoWindowHTML(dogBeachMarker));
			self.infoWindow.open(map, dogBeachMarker.googleMarker);


			// Get and apply name
			setSelectedMarkerTitle(dogBeachMarker.googleMarker.title);

			// Update infowindow with flickr images
			//loadFlickrImages(dogBeachMarker);

		};

	}

	// Generate HTML that is displayed in the infoWindow
	// Consists of title, off leash info and picture
	function generateInfoWindowHTML(dogBeachMarker) {

		var contentHTML = '<h3>' + dogBeachMarker.googleMarker.title + '</h3>';
		contentHTML = contentHTML + '<div class="infoHeading">Off Leash Times</div>';
		contentHTML = contentHTML + '<div class="off-leash-description">' + dogBeachMarker.offLeashTimes + '</div>';
		contentHTML = contentHTML + '<div class="infoHeading">Flickr Image</div><div class="flickr-images"><img src="img/running-dog-grey.gif"><br>Loading ...</div>';
		
		var url = '<div class="infoHeading">Council website</div><a href="' + dogBeachMarker.website + '">' + dogBeachMarker.website + '</a>';

		return contentHTML + url;

	}

	function loadFlickrImages( dogBeachMarker) {
		// Search flickr and grab an image
		// Doing this after loading the InfoWindow so that user gets a response straigh away
		// and only waits for the Flickr image to load up

			var flickURL =  'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=eebfb336fe500c5469321951f38d7853&tags=' 
		+ dogBeachMarker.googleMarker.title + '&per_page=1&format=json&jsoncallback=?';

			var flickrHTML = '';

			$.ajax({
				url : flickURL,
				dataType : 'jsonp'
			}).done(function(data) {

				var photoList = data.photos.photo;
				for (var i = 0; i < photoList.length; i++) {
					// construct URL as per https://www.flickr.com/services/api/misc.urls.html 
					var imgURL = 'https://farm' + photoList[i].farm + '.staticflickr.com/'
					+ photoList[i].server + '/' + photoList[i].id + '_' + photoList[i].secret + '_m.jpg';
					flickrHTML = '<img src="' + imgURL + '" class="info-window-image">';
						$('.flickr-images').html(flickrHTML);
				}

			}).error(function() {

				flickrHTML = 'Cannot load Flickr images at this time.';

			}).complete(function() {

				// Loading the flick images into the info window div
				// Perhaps this can be bound someway in knockout?
				$('.flickr-images').html(flickrHTML);

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

	// Filtered dog beaches array - uses a computed observable that looks the 'query' value
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

	// Declare observable to hold status of list view
	self.listVisible = ko.observable(false);


	self.listToggleButtonText = ko.computed( function() {
		return self.listVisible() ? 'HIDE LIST' : 'SHOW LIST';
	}, self);

	self.toggleList = function() {
		self.listVisible(!self.listVisible());
	};

	 function setSelectedMarkerTitle(name) {
        self.selectedMarkerTitle(name);
    }

};
