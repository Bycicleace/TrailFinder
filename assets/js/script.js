$(document).foundation();
//Get input from search box
document.getElementById("button").addEventListener("click", function(){
    var state = document.getElementById("state-entry").value; 
    console.log(state);
    firstAPICall(state);
});


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
