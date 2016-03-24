var dogBeachInitialData=[{title:"Sirius Cove",position:{lat:-33.839502,lng:151.237244},offLeash:!0,offLeashTimes:"All day Monday to Friday, and before 9am and after 4pm on Saturdays, Sundays and Public Holidays ",website:"http://www.mosman.nsw.gov.au/residents/Pets/where-to-walk-your-dog/"},{title:"Clifton Gardens",position:{lat:-33.838516,lng:151.254275},offLeash:!0,offLeashTimes:"Before 9am and after 4pm weekdays during winter. Before 9am and after 6pm weekdays during daylight savings summer months (Oct – Mar)",website:"http://www.mosman.nsw.gov.au/residents/Pets/where-to-walk-your-dog/"},{title:"Dumaresq Reserve",position:{lat:-33.866418,lng:151.270572},offLeash:!0,offLeashTimes:"Between 4.30pm and 8.30am",website:"http://www.woollahra.nsw.gov.au/services/animals_and_pets/walking_your_dog"},{title:"Rowland Reserve",position:{lat:-33.660741,lng:151.305761},offLeash:!0,offLeashTimes:"All times",website:"http://www.pittwater.nsw.gov.au/property/domestic_animals/dogs/exercise_areas"},{title:"Flora and Richie Roberts Reserve",position:{lat:-33.766673,lng:151.298436},offLeash:!0,offLeashTimes:"All times",website:"http://www.warringah.nsw.gov.au/play/flora-and-ritchie-roberts-reserve"}],DogBeachMarker=function(e){var a=this;a.googleMarker=new google.maps.Marker({position:e.position,map:map,title:e.title}),a.matchesFilter=ko.observable(!0),a.offLeash=e.offLeash,a.offLeashTimes=e.offLeashTimes,a.website=e.website},ViewModel=function(){function e(e){return function(){var s="https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=eebfb336fe500c5469321951f38d7853&tags="+e.googleMarker.title+"&per_page=1&format=json&jsoncallback=?";$.ajax({url:s,dataType:"jsonp"}).done(function(s){o.listVisible()&&o.toggleList(),i(e.googleMarker),t.setContent(a(s,e)),t.open(map,e.googleMarker)}).fail(function(){alert("fail flickr api")})}}function a(e,a){var i="<h3>"+a.googleMarker.title+"</h3>";i+='<div class="infoHeading">Off Leash Times</div>',i=i+'<div class="off-leash-description">'+a.offLeashTimes+"</div>",i+='<div class="infoHeading">Flickr Image</div>';for(var o=e.photos.photo,t=0;t<o.length;t++){var s="https://farm"+o[t].farm+".staticflickr.com/"+o[t].server+"/"+o[t].id+"_"+o[t].secret+"_m.jpg";i=i+'<img src="'+s+'" class="info-window-image">'}var r='<div class="infoHeading">Council website</div><a href="'+a.website+'">'+a.website+"</a>";return i+r}function i(e){e.setAnimation(google.maps.Animation.BOUNCE),window.setTimeout(function(){e.setAnimation(null)},3500)}var o=this;o.dogBeaches=ko.observableArray([]);var t=new google.maps.InfoWindow({content:"default info window text",maxWidth:350});dogBeachInitialData.forEach(function(a){var i=new DogBeachMarker(a);i.clickMarker=e(i),i.googleMarker.addListener("click",i.clickMarker),o.dogBeaches.push(i)}),o.query=ko.observable(""),o.dogBeachesFiltered=ko.computed(function(){var e=o.query().toLowerCase();return e?ko.utils.arrayFilter(this.dogBeaches(),function(a){return-1!==a.googleMarker.title.toLowerCase().indexOf(e)}):this.dogBeaches()},o),o.listVisible=ko.observable(!1),o.listToggleButtonText=ko.computed(function(){return o.listVisible()?"HIDE LIST":"SHOW LIST"},o),o.toggleList=function(){o.listVisible(!o.listVisible())}};