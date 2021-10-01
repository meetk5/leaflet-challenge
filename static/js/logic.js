
// // Creating our initial map object:
// // We set the longitude, latitude, and starting zoom level.
// // This gets inserted into the div with an id of "map".
// // var myMap = L.map("map", {
// //     center: [0, 39],
// //     zoom: 4
// //   });
//   var myMap = L.map("map").setView([30, 40], 4.5);

// // // Adding a tile layer (the background map image) to our map:
// // // We use the addTo() method to add objects to our map.
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(myMap);

function markerSize(magnitude) {
    return magnitude * 3;
}

function generateColor(depth) {
    // if (depth > 200){
    //     return "#800000"
    // }
    if (depth > 100) {
        return "#960018"
    }
    else if (depth > 50) {
        return "#EA3C53"
    }
    else if (depth > 10)
        return "orange"
}


url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL/
d3.json(url).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
    console.log(data.features);

});

function createFeatures(earthquakeData) {

    function styleInfo(feature) {
        console.log("Cooridnates", feature.geometry.coordinates[2])
        return {
            // stroke: true,
            fillOpacity: 1,
            color: generateColor(feature.geometry.coordinates[2]),
            radius: markerSize(feature.properties.mag),
        }
    }

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function bindPopupToEarthquake(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the bindPopupTOEarthquake function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng)
        },
        onEachFeature: bindPopupToEarthquake,
        style: styleInfo
    });

    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a baseMaps object.
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // Create an overlay object to hold our overlay.
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
        center: [
            //0,0
            20.21510763799999, -10.14918188389737
        ],
        zoom: 2,
        layers: [street, earthquakes]
    });

    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Set up the legend.
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var grades = [10, 50, 100];
        var colors = ["orange","#EA3C53","#960018"]
        
        for (var i = 0; i < colors.length; i++) {
            div.innerHTML += "<i style = 'background: " + colors[i] + " '></i>"
                + grades[i] + (grades[i + 1] ? " &ndash; " + grades[i + 1] + "<br>" : "+");
        }

        return div;
    };

    // Adding the legend to the map
    legend.addTo(myMap);

}


//Alternate way of parsing the Json
// d3.json(url).then(function(data){
//     console.log("Data", data)
//     console.log("Features", data.features)
//     console.log(data.features[0])
//     console.log("Geometry", data.features[0].geometry)
//     console.log("Coordinates",data.features[0].geometry.coordinates)
//     latarray = []
//     lngarray = []

//     for (var i = 0; i < data.features.length; i++) {
//         lng = data.features[i].geometry.coordinates[0]
//         lat = data.features[i].geometry.coordinates[1]

//         console.log(lat,lng)
//         L.circle([lat,lng],{
//             fillOpacity: 0.75,
//             color: "red",
//             fillColor: "red",
//             // Setting our circle's radius to equal the output of our markerSize() function:
//             // This will make our marker's size proportionate to its population.
//             radius: 100 
//             // arkerSize(data.features[i].properties.mag)
//           })
//           .bindPopup(`<h1>${data.features[i].properties.place}</h1>`)
//           .addTo(myMap)}

//           console.log("Length",data.features.length)

// })

// for (var i = 0; i < cities.length; i++) {
//     L.circle(cities[i].location, {
//       fillOpacity: 0.75,
//       color: "white",
//       fillColor: "purple",
//       // Setting our circle's radius to equal the output of our markerSize() function:
//       // This will make our marker's size proportionate to its population.
//       radius: markerSize(cities[i].population)
//     }).bindPopup(`<h1>${cities[i].name}</h1> <hr> <h3>Population: ${cities[i].population.toLocaleString()}</h3>`).addTo(myMap);
//   }


