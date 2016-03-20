var dogBeachInitialData = 
    [{   title : 'Sirius Cove',
        position : {lat: -33.839502, lng: 151.237244},
        offLeash: true,
        offLeashTimes : 'All day Monday to Friday, and before 9am and after 4pm on Saturdays, Sundays and Public Holidays ',
        website : 'http://www.mosman.nsw.gov.au/residents/Pets/where-to-walk-your-dog/'
    },
    {   title : 'Clifton Gardens',
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

var DogBeachMarker = function(data, infoWindow) {

    var self = this;
    var marker = new google.maps.Marker({
            position: data.position,
            map: map,
            title: data.title,        
        });

 
    this.googleMarker = marker;
    this.matchesFilter = ko.observable(true);
    this.offLeash = data.offLeash;
    this.offLeashTimes =  data.offLeashTimes;
    this.website = data.website;


    this.clickMarker = function() {
        // lookup flickr api based on title
        // per_page=3 returns up to 3 images
      //  var flickURL =  'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=8af4729ecdb6a93ec86ab928ffed273c&tags=' 
        var flickURL =  'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=eebfb336fe500c5469321951f38d7853&tags=' 
        + self.googleMarker.title + '&per_page=1&format=json&jsoncallback=?';
        $.ajax({
            url : flickURL,
            dataType : 'jsonp'
        }).done(function(data) {
            // loop through response and generate URLs for them  an
            animateMarker();
            // loadFlickrImages(data);
            openInfoWindow(data);
        }).fail(function() {
            alert('fail flickr api');
        })

    };

    marker.addListener('click', this.clickMarker);


    var loadFlickrImages = function(data) {
        var photoList = data.photos.photo;
        $('#flickr-images').html('');
        for (var i = 0; i < photoList.length; i++) {
            // construct URL as per https://www.flickr.com/services/api/misc.urls.html 
            var imgURL = 'https://farm' + photoList[i].farm + '.staticflickr.com/'
            + photoList[i].server + '/' + photoList[i].id + '_' + photoList[i].secret + '_m.jpg';

            $('#flickr-images').append('<img src="' + imgURL + '" />');
        }
    };

    function animateMarker() {
        // I am assuming referencing 'marker' in this function is a form of closure?
        marker.setAnimation(google.maps.Animation.BOUNCE);
        window.setTimeout(function() {
            marker.setAnimation(null);
        }, 3500);
    };

    function openInfoWindow(data) {
        infoWindow.setContent(generateInfoWindowHTML(data));
        infoWindow.open(map, marker);
    }

    // Generates HTML for InfoWindow
    // Not sure if there is a way to do this via HTML and knockout observables??
    function generateInfoWindowHTML(data) {
        var contentHTML = '<h3>' + marker.title + '</h3>';
        contentHTML = contentHTML + '<div>Off Leash Times</div>';
        contentHTML = contentHTML + '<div>' + self.offLeashTimes + '</div>';
        var photoList = data.photos.photo;
        for (var i = 0; i < photoList.length; i++) {
            // construct URL as per https://www.flickr.com/services/api/misc.urls.html 
            var imgURL = 'https://farm' + photoList[i].farm + '.staticflickr.com/'
            + photoList[i].server + '/' + photoList[i].id + '_' + photoList[i].secret + '_m.jpg';
            contentHTML = contentHTML + '<img src="' + imgURL + '">';
        }
        return contentHTML;

    }
};


// var InfoWindow = function() {
//     var infoWindow = new google.maps.InfoWindow({
//         content : 'default info window text'
//     });
//     this.infoWindow = infoWindow;

// };

var ViewModel = function() {

    var self = this;

    // Declare array that will hold all the markers
    this.dogBeaches = ko.observableArray([]);


    // Create one infoWindow that will be passed to each DogBeachMarker
    // Not sure if this is the best pattern
    var infoWindow = new google.maps.InfoWindow({
        content : 'default info window text'
    });

    // Create markers from initial data and add to array
    dogBeachInitialData.forEach(function(data) {
        self.dogBeaches.push( new DogBeachMarker(data, infoWindow));
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
