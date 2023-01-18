// Store our API endpoing as queryURL.
let queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create earthquake layerGroup.
let earthquakes = L.layerGroup();

// Create the base layers.
let street = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Create our map, giving it the streetmap and earthquakes layers to display on load.
let myMap = L.map("mapid", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

 // Use D3 to pull data from GeoJSON and create markers/maps.
  d3.json(queryURL, function(earthquakeData) {

   
  // Create layer, a popup and style markers.
  L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, 

        {
          radius: markerSize(feature.properties.mag),
          fillColor: chooseColor(feature.geometry.coordinates[2]),
          fillOpacity: 0.7,
          color: "black",
          stroke: true,
          weight: 0.5
        }
      );
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3>Location: " + feature.properties.place + "</h3><hr><p>Date: "
      + new Date(feature.properties.time) + "</p><hr><p>mag: " + feature.properties.mag + "</p>");
    }
  }).addTo(earthquakes);
  
// createMap function.
  earthquakes.addTo(myMap);

 // Determine the marker size by mag.
 function markerSize(mag) {
  return mag * 4;
};

// Determine the marker color by  depth. 
function chooseColor( depth ) {
  switch(true) {
    case  depth  > 90:
      return "red";
    case  depth  > 70:
      return "orange";
    case  depth  > 50:
      return "coral";
    case  depth  > 30:
      return "gold";
    case  depth  > 10:
      return "chartreuse";
    default:
      return "lime";
  }
}
// Create map legend.
 let legend = L.control({position: "bottomright"});
 legend.onAdd = function() {
   let div = L.DomUtil.create("div", "info legend"),
    depth  = [-10, 10, 30, 50, 70, 90];
   
   div.innerHTML += "<h3 style='text-align: center'> depth </h3>"

   for (let i =0; i <  depth .length; i++) {
     div.innerHTML += 
     '<i style="background:' + chooseColor( depth [i] + 1) + '"></i> ' +
          depth [i] + ( depth [i + 1] ? '&ndash;' +  depth [i + 1] + '<br>' : '+');
     }
     return div;
   };
   legend.addTo(myMap);
});







  





