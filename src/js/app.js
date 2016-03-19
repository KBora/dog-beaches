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




var ViewModel = function() {

    var self = this;

    this.dogBeaches = ko.observableArray([]);

    // Create markers and add to map
    // TO DO: Should marker be in function / object?

    dogBeachInitialData.forEach(function(beachItem) {

        var marker = new google.maps.Marker({
            position: beachItem.position,
            map: map,
            title: beachItem.title,
            offLeash: beachItem.offLeash,
            offLeashTimes: beachItem.offLeashTimes,
            website: beachItem.website
        });

        marker.matchesFilter = ko.observable(true);
        self.dogBeaches.push(marker);
    });

    // markerArray.forEach(function(googleMarker) {
    //     // add an observable 'matchesFilter' element to the googleMarker 
    //     // that is used by the filterBeaches function and beach-list id
    //     googleMarker.matchesFilter = ko.observable(true);
    //     self.dogBeaches.push(googleMarker);
    // });


    this.filterBeaches = function() {
        var filterString = document.getElementById('beach-filter-input').value;

        self.dogBeaches().forEach(function(googleMarker) {
            // if title contains filterString value, then show it, else hide it
            if (googleMarker.title.toLowerCase().indexOf(filterString) > -1 ) {
                // show the marker on the map
                googleMarker.setMap(map);
                googleMarker.matchesFilter(true);
            } else {
                // hide the marker from the map
                googleMarker.setMap(null);
                googleMarker.matchesFilter(null);
            }
        });

    };



};
