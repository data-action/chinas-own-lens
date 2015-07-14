// Mapbox Access Token
L.mapbox.accessToken = "pk.eyJ1IjoibWpmb3N0ZXI4MyIsImEiOiJ5ekh3M2VzIn0.OT046Cq9nPMRMLuqibZY3A";


// Creation of Main Map Object
var map = L.map("map", {attributionControl: false, minZoom: 5, maxZoom: 14});
map.setView([33.024947, 114.890781], 6);

// Global Variables
var basemapLayer = L.mapbox.tileLayer("mjfoster83.loekpjp8");
var bounds = map.getBounds();
var panelStatus = "open";
var dataInBounds = new L.FeatureGroup();
var dataNotInBounds = new L.FeatureGroup();
var imageArray = [];
var imageJSON = "";

function getData(){
  $.getJSON("data/pollution/pollution.geojson", function(data){
    L.geoJson(data, {
      onEachFeature: function(feature,layer){
        var a = layer.getLatLng();
        if( bbox._southWest.lng <= a.lng && a.lng <= bbox._northEast.lng && bbox._southWest.lat <= a.lat && a.lat <= bbox._northEast.lat ) {
          console.log("Point is in bounding box");
          dataInBounds.addLayer(layer);
          var image = {
            "image_location": "data/pollution/pictures/1.jpg"
          };
          imageArray.push(image);
          console.log(image);
          imageJSON = JSON.stringify({image: imageArray});
          

          $("#owl-demo").owlCarousel({
            jsonPath : imageJSON,
            jsonSuccess : customDataSuccess
          });

          console.log(imageJSON);

        } else {
          console.log("Point is not in bounding box");
          dataNotInBounds.addLayer(layer);
        }
      }
    });
  });
};

$( document ).ready(function() {
  getData();
});

function customDataSuccess(data){
  var content = "";
  console.log("This ran!");
  for(var i in data["image"]){
     var img = data["image"][i].image_location;
     content += "<img src=\"" +img+ "\">"
     console.log(content);
  }
  $("#owl-demo").html(content);
}

// Add layers to map
dataInBounds.addTo(map);
basemapLayer.addTo(map);

// Photo Panel/Carousel Creation
$('#photoPanelOpen').click(function () {
  $('#photoPanel #photoDashboard').slideToggle("fast");
  $(this).toggleClass('photosPanelClose');
});

// Get map bounding box values
var bbox = map.getBounds();
var boundingArray = [bbox._northEast.lat, bbox._northEast.lng, bbox._southWest.lat, bbox._southWest.lng];

map.on('moveend', function(e){
  if (map.hasLayer(dataInBounds)){
    map.removeLayer(dataInBounds);
  };
  dataInBounds = new L.FeatureGroup();
  imageArray = [];
  imageJSON = "";
  bbox = map.getBounds();
  getData();
  dataInBounds.addTo(map);
});
