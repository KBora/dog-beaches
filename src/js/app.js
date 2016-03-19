var markerData = 
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

// var Marker = function(data) {
//     this.title = ko.observable(data.title);
//     this.position = ko.observable(data.position);
//     this.offLeash = ko.observable(data.offLeash);
//     this.offLeashTimes = ko.observable(data.offLeashTimes);
//     this.website = ko.observable(data.website);
// };

var ViewModel = function() {

    var self = this;

    this.beachList = ko.observableArray([]);

    markerArray.forEach(function(googleMarker) {
        googleMarker.matchesFilter = ko.observable(true);
        self.beachList.push(googleMarker);
    });


    this.filterBeaches = function() {
        console.log('filter Beaches');
        var filterBy = document.getElementById('beach-filter-input').value;
        self.beachList().forEach(function(googleMarker) {
            // if title contains filterBy value, then show it, else hide it
            console.log(googleMarker.title.toLowerCase());
            if (googleMarker.title.toLowerCase().indexOf(filterBy) > -1 ) {
                googleMarker.setMap(map);
                googleMarker.matchesFilter(true);
            } else {
                googleMarker.setMap(null);
                googleMarker.matchesFilter(null);
            }

            //googleMarker.visible = (googleMarker.title.toLowerCase().indexOf(filterBy) === -1 );
        });
    };

    this.matchesFilter = function() {
        console.log('hi');
    }
    // markerData.forEach(function(markerItem) {
    //     self.markerList.push( new Marker(markerItem));
    // });

};
