console.log("hello");

document.getElementById("button").addEventListener("click", function(){
    var city = document.getElementById("city-entry").value; 
    console.log(city);
}); 

let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
}
