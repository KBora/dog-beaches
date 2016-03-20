var dogBeachInitialData = 
    [{   title : 'Sirius Cove',
        position : {lat: -33.839502, lng: 151.237244},
        offLeash: true,
        offLeashTimes : 'All day Monday to Friday, and before 9am and after 4pm on Saturdays, Sundays and Public Holidays ',
        website : 'http://www.mosman.nsw.gov.au/residents/Pets/where-to-walk-your-dog/'
    },
    {   title : 'Clifton Gardens jetty',
        position : {lat: -33.838516, lng: 151.254275},
        offLeash : true,
        offLeashTimes: 'Before 9am and after 4pm weekdays during winter. Before 9am and after 6pm weekdays during daylight savings summer months (Oct – Mar)',
        website : 'http://www.mosman.nsw.gov.au/residents/Pets/where-to-walk-your-dog/'
    },
    {   title : 'Dumaresq Reserve',
        position : {lat: -33.866418, lng: 151.270572},
        offLeash : true,
        offLeashTimes: 'Between 4.30pm and 8.30am',
        website : 'http://www.woollahra.nsw.gov.au/services/animals_and_pets/walking_your_dog'
    },
    {   title : 'Rowland Reserve',
        position : {lat: -33.660741, lng: 151.305761},
        offLeash : true,
        offLeashTimes: 'All times',
        website : 'http://www.pittwater.nsw.gov.au/property/domestic_animals/dogs/exercise_areas'
    },
    {   title : 'Flora and Richie Roberts Reserve',
        position : {lat: -33.766673, lng: 151.298436},
        offLeash : true,
        offLeashTimes: 'All times',
        website : 'http://www.warringah.nsw.gov.au/play/flora-and-ritchie-roberts-reserve'
    }
    ];

var DogBeachMarker = function(data) {

    var marker = new google.maps.Marker({
            position: data.position,
            map: map,
            title: data.title
        });

    this.googleMarker = marker;
    this.matchesFilter = ko.observable(true);
    this.offLeash = data.offLeash;
    this.offLeashTimes =  data.offLeashTimes;
    this.website = data.website;


    this.displayMoreInfo = function() {
        // lookup flickr api based on title
        var flickURL =  'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=8af4729ecdb6a93ec86ab928ffed273c&tags=rowland+reserve&per_page=5&format=json&jsoncallback=?';
        $.ajax({
            url : flickURL,
            dataType : 'jsonp'
        }).done(function(data) {
            console.log('done' + data);
            debugger;
        }).fail(function() {
            console.log('fail flickr api');
            debugger;
        })

    };


};


var ViewModel = function() {

    var self = this;

    // Declare array that will hold all the markers
    this.dogBeaches = ko.observableArray([]);

    // Create markers from initial data and add to array
    dogBeachInitialData.forEach(function(data) {
        self.dogBeaches.push( new DogBeachMarker(data));
    });


    // Filter the markers by the value in the input field
    this.filterBeaches = function() {
        var filterString = document.getElementById('beach-filter-input').value;

        self.dogBeaches().forEach(function(dogBeachMarker) {
            // if title contains filterString value, then show it, else hide it
            if (dogBeachMarker.googleMarker.title.toLowerCase().indexOf(filterString) > -1 ) {
                // show the marker on the map
                dogBeachMarker.googleMarker.setMap(map);
                // show the marker in the list
                dogBeachMarker.matchesFilter(true);
            } else {
                // hide the marker from the map
                dogBeachMarker.googleMarker.setMap(null);
                // hide the marker from the list
                dogBeachMarker.matchesFilter(null);
            }
        });

    };



};
