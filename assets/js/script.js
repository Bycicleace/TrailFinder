$(document).foundation()
// Use Imput to call first API
var firstAPICall =function(stateSearch){
// fetch(https://developer.nps.gov/api/v1/parks?api_key=CV0ig8nWQLFF65A4f4FNghhUov7ovwklkr4ybJ6E)
  initMap(lon,lat)
}



let map;


function initMap(lon,lat) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: lat, lng: lon },
    zoom: 8,
  });
}


/* NPS API
 We want the following from the response
   data.id
   data.url
   data.fullName
   data.description
   data.latitude
   data.longitude
   data.contacts.phoneNumbers []
   data.contacts.emailAddresses []
*/

var baseURL = "https://developer.nps.gov/api/v1/"
var parksURL = baseURL + "parks?"
var npsAPIKey = "api_key=CV0ig8nWQLFF65A4f4FNghhUov7ovwklkr4ybJ6E"

function getParksByState(state) {
  parksArray = [];
  fetch(parksURL + "stateCode=" + state + "&" + npsAPIKey)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    for (var i = 0; i < data.data.length; i++) {
      // Empty arrays for phone and emails.
      newPhoneNumbers = [];
      newEmailAddresses = [];

      // Gather phone Numbers (Voice only)
      for (var j = 0; j < data.data[i].contacts.phoneNumbers.length; j++) {
        if (data.data[i].contacts.phoneNumbers[j].type === "Voice") {
          newPhoneNumbers.push(data.data[i].contacts.phoneNumbers[j].phoneNumber);
        }
      }

      // Gather email addresses
      for (var j = 0; j < data.data[i].contacts.emailAddresses.length; j++) {
        newEmailAddresses.push(data.data[i].contacts.emailAddresses[j].emailAddress);
      }

      // Build simplified object.
      var currentPark = {
        id: data.data[i].id,                    // Park ID
        url: data.data[i].url,                  // Park URL Landing Page
        fullName: data.data[i].fullName,        // Park Name
        description: data.data[i].description,  // Park Description
        latitude: data.data[i].latitude,        // Park Latitude Coordinate
        longitude: data.data[i].longitude,      // Park Longitude Coordinate
        phoneNumbers: newPhoneNumbers,          // Park Phone Number array
        emailAddresses: newEmailAddresses       // Park Email Address array
      };

      // Push to parks array.
      parksArray.push(currentPark);
    }
  })
  .catch(function(error) {
    console.log("There was an error: " + error);
  })

  return parksArray;
}

var stateSelectionEl = document.querySelector(".search-box-container")
var resultsEl = document.querySelector(".info-container")

var displayParks = function() {
  resultsEl.innerHTML = ""
  parksArray.forEach(function(park) {
    var parkCard = document.createElement("div");
    var parkCardHeader = document.createElement("div");
    var parkCardContent = document.createElement("div")
    parkCard.className = "card";
    parkCardHeader.className = "card-divider";
    parkCardContent.className = "card-section";
    parkCardHeader.textContent = park.fullName;
    parkCardContent.textContent = park.description + " Phone Number: " + park.phoneNumbers + " Email Address: " + park.emailAddresses;
    parkCard.appendChild(parkCardHeader);
    parkCard.appendChild(parkCardContent);
    resultsEl.appendChild(parkCard);
  });
};

stateSelectionEl.addEventListener("click", function(event){
  targetEl = event.target;
  if (targetEl.matches(".state")){
    getParksByState(targetEl.textContent);
    i=0
    var apiCallLoad = setInterval (function(){
      if (i>20){
        alert("The request timed out")
        clearInterval(apiCallLoad);
      }else if (parksArray.length === 0) {
        i = i+1
      }else{
        displayParks();
        clearInterval(apiCallLoad);
      }
    },500);
  };
});