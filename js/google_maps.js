"use strict";
let map, infoWindow;
var pos;

function initMap() {
  map = new google.maps.Map(document.getElementById("googleMap"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
    mapId: '3defd8bebdb47e41'
  });

  // return map;
}

function getLocation() {
  infoWindow = new google.maps.InfoWindow();
  const geocoder = new google.maps.Geocoder();

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
       pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      geocoder.geocode({location: pos})
      .then((response)=>{
          var address = response.results[0].formatted_address;
          var splitAddress = address.split(",");
          var stateZip = splitAddress[2];
          // note that stateZip var has a space at the beginning of the string
          // so when you split there are three elements in the created array
          // the first being whitespace
          var zip = stateZip.split(" ")[2];
          document.getElementById("zip").innerHTML =zip;
          infoWindow.setPosition(pos);
          infoWindow.setContent(address);
          infoWindow.open(map);
          map.setCenter(pos);
          map.setZoom(15)

      });


    },
    () => {
      handleLocationError(true, infoWindow, map.getCenter());
    }
  );

} else {
  // Browser doesn't support Geolocation
  handleLocationError(false, infoWindow, map.getCenter());
}
}
 // locationButton.textContent = "Pan to Current Location";
 // locationButton.classList.add("custom-map-control-button");

   // Try HTML5 geolocation.
//TRYING TO GET PLACES TO WORK
function findStores(){
  //UTILIZING GOOGLE PLACES
    const service = new google.maps.places.PlacesService(map);
   let getNextPage;
   const moreButton = document.getElementById("errand");
   if(pos == null){
     return;
   }
   moreButton.onclick = function () {
     // moreButton.disabled = true;
     if (getNextPage) {
       getNextPage();
     }
   };
   service.nearbySearch(
     { location:pos, radius: 5000, type: "department_store" },
     (results, status, pagination) => {
       if (status !== "OK" || !results) return;
       addPlaces(results, map);
       moreButton.disabled = !pagination || !pagination.hasNextPage;

       if (pagination && pagination.hasNextPage) {
         getNextPage = () => {
           // Note: nextPage will call the same handler function as the initial call
           pagination.nextPage();
         };
       }
     }
   );
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
 infoWindow.setPosition(pos);
 infoWindow.setContent(
   browserHasGeolocation
     ? "Error: The Geolocation service failed."
     : "Error: Your browser doesn't support geolocation."
 );
 infoWindow.open(map);
}
function addPlaces(places, map) {
  const placesList = document.getElementById("places");

  for (const place of places) {
    if (place.geometry && place.geometry.location) {
      const image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };
      new google.maps.Marker({
        map,
        icon: image,
        title: place.name,
        position: place.geometry.location,
      });
      const li = document.createElement("li");
      li.setAttribute("id","place");
      li.textContent = place.name;
      placesList.appendChild(li);
      li.addEventListener("click", () => {
        map.setCenter(place.geometry.location);
        map.setZoom(15);
      });
    }
  }
}
