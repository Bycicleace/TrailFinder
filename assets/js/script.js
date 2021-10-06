$(document).foundation()

var stateAbb = {
  "AL": "Alabama",
  "AK": "Alaska",
  "AS": "American Samoa",
  "AZ": "Arizona",
  "AR": "Arkansas",
  "CA": "California",
  "CO": "Colorado",
  "CT": "Connecticut",
  "DE": "Delaware",
  "DC": "District Of Columbia",
  "FM": "Federated States Of Micronesia",
  "FL": "Florida",
  "GA": "Georgia",
  "GU": "Guam",
  "HI": "Hawaii",
  "ID": "Idaho",
  "IL": "Illinois",
  "IN": "Indiana",
  "IA": "Iowa",
  "KS": "Kansas",
  "KY": "Kentucky",
  "LA": "Louisiana",
  "ME": "Maine",
  "MH": "Marshall Islands",
  "MD": "Maryland",
  "MA": "Massachusetts",
  "MI": "Michigan",
  "MN": "Minnesota",
  "MS": "Mississippi",
  "MO": "Missouri",
  "MT": "Montana",
  "NE": "Nebraska",
  "NV": "Nevada",
  "NH": "New Hampshire",
  "NJ": "New Jersey",
  "NM": "New Mexico",
  "NY": "New York",
  "NC": "North Carolina",
  "ND": "North Dakota",
  "MP": "Northern Mariana Islands",
  "OH": "Ohio",
  "OK": "Oklahoma",
  "OR": "Oregon",
  "PW": "Palau",
  "PA": "Pennsylvania",
  "PR": "Puerto Rico",
  "RI": "Rhode Island",
  "SC": "South Carolina",
  "SD": "South Dakota",
  "TN": "Tennessee",
  "TX": "Texas",
  "UT": "Utah",
  "VT": "Vermont",
  "VI": "Virgin Islands",
  "VA": "Virginia",
  "WA": "Washington",
  "WV": "West Virginia",
  "WI": "Wisconsin",
  "WY": "Wyoming"
}

// Use Imput to call first API
var firstAPICall =function(stateSearch){
// fetch(https://developer.nps.gov/api/v1/parks?api_key=CV0ig8nWQLFF65A4f4FNghhUov7ovwklkr4ybJ6E)
  initMap()
}



let map;


function initMap(lat, lon) {
  var mapCords = { lat: lat, lng: lon };
  map = new google.maps.Map(document.getElementById("map"), {
    center: mapCords,
    zoom: 12,
  });

  new google.maps.Marker({
    position: mapCords,
    map,
    title: "Hello",
  })
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
  var currentStateEl = document.querySelector(".current-state");
  currentStateEl.textContent = stateAbb[state]
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

var formatPhoneNumber = function(phoneNumber){
  formattedPhoneNumber = String(phoneNumber).match(/\d{3}(?=\d{2,3})|\d+/g).join("-")
  return formattedPhoneNumber;
}

var displayParks = function() {
  resultsEl.innerHTML = ""
  parksArray.forEach(function(park) {
    var parkCardCell = document.createElement("div");
    var parkCard = document.createElement("div");
    var parkCardHeader = document.createElement("div");
    var parkCardContent = document.createElement("div");
    parkCardCell.className = "cell"
    parkCardCell.id = "state-cell"
    parkCard.className = "card";
    parkCardHeader.id = park.id;
    parkCardContent.id = park.id;
    parkCardHeader.className = "card-divider";
    parkCardContent.className = "card-section";
    parkCardHeader.textContent = park.fullName;
    parkCardContent.textContent = park.description;

    // Only if there is a phone number, print
    if (park.phoneNumbers.length > 0) {
      var parkPhoneContainer = document.createElement("div");
      var parkPhone = document.createElement("a");  
      parkPhoneContainer.textContent = "Phone Number: "
      parkPhone.setAttribute("href","tel:" + park.phoneNumbers[0]);
      parkPhone.textContent = formatPhoneNumber(park.phoneNumbers[0]);
      parkPhoneContainer.appendChild(parkPhone);
      parkCardContent.appendChild(parkPhoneContainer);
    }

    // Only if there is an email address, print
    if (park.emailAddresses.length > 0) {
      var parkEmail = document.createElement("a");
      var parkEmailContainer = document.createElement("div");
      parkEmailContainer.textContent = "Email Address: "
      parkEmail.setAttribute("href", "mailto:" + parkEmail)
      parkEmail.textContent = park.emailAddresses;
      parkEmailContainer.appendChild(parkEmail);
      parkCardContent.appendChild(parkEmailContainer);
    }

    parkCard.appendChild(parkCardHeader);
    parkCard.appendChild(parkCardContent);
    parkCardCell.appendChild(parkCard);
    resultsEl.appendChild(parkCardCell);
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


document.addEventListener('click',function(e){
  if(e.target.className== 'card-section' || e.target.className== 'card-divider'){
    for(var i = 0; i < parksArray.length; i++)
    {
      if(parksArray[i].id == e.target.id)
      {
        var parkLong = parseFloat(parksArray[i].longitude, 10);
        var parkLat = parseFloat(parksArray[i].latitude, 10);

        initMap(parkLat, parkLong);
        console.log(parkLat, parkLong);
      }
    }
  }
});