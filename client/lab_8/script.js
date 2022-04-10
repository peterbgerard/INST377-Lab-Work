function initMap() {
    // initialize the map to College Park area
    const map = L.map('map').setView([38.9897, -76.9378], 13);
  
    // load a map tile layer
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoicGV0ZXItZ2VyYXJkIiwiYSI6ImNsMXNmMnBzMTBhMTczYnFjeGN4aHd5b3IifQ.4asrqzJuBQE4uViSidcKog'
    }).addTo(map);
  
    return map;
  }
  
  function markerPlace(arr) {
    // remove all old markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.remove();
      }
    });
  
    // add a marker for each item in the array
    arr.forEach((element, index) => { 
      const lat = arr[index].geocoded_column_1.coordinates[1];
      const long = arr[index].geocoded_column_1.coordinates[0];
  
      if (index === 0) {  // pan the map to the first one
        map.setView([lat, long], 10);
      }
      const marker = L.marker([lat, long]).addTo(map);
      popupContent = arr[index].name;
      marker.bindPopup(popupContent).openPopup();
    });
  }
  
  function dataHandler(array) {
    // Shuffle array - Googled this
    const shuffled = array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  
    // Get sub-array of first 15 elements after shuffled
    const selected = shuffled.slice(0, 15);
  
    return selected;
  }
  
  function injectRestNames(restNames) {
    // load the list with the 15 restaurant names 
    document.getElementById('resto-list').innerHTML = restNames.map((item) => `<li id=rest_item>${item.name}</li><li id=rest_zip>${item.zip}</li>`).join('');
  }
  
  async function mainEvent() { // the async keyword means we can make API requests
    // setup
    const form = document.querySelector('#main_form');
    const submit = document.querySelector('#button');
    const restName = document.querySelector('#rest_name');
    const zip = document.querySelector('#zip');
    let restNames = [];
  
    // load the map
    map = initMap();
  
    // hide the submit button until the API returns
    submit.style.setProperty('display', 'none');
  
    // get the data via API
    const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json'); // This accesses some data from our API
    const arrayFromJson = await results.json(); // This changes it into data we can use - an object
  
    // don't show the button until the data is ready
    if (arrayFromJson.length > 0) {
      // show the submit button
      submit.style.setProperty('display', 'block');
  
      // act when people type in the restaurant name box
      restName.oninput = () => {
        // Only show restaurant names where the string in the zip code box matches
        const nameValue = document.getElementById('rest_name').value.toUpperCase();
        const filtered = restNames.filter((limited) => limited.name.includes(nameValue));
  
        // refresh the list
        injectRestNames(filtered);
  
        // update the map markers
        markerPlace(filtered);
      };
  
      // act when people type in the zip code box
      zip.oninput = () => {
        // Only show restaurant names where the string in the zip code box matches
        const zipValue = document.getElementById('zip').value;
        const filtered = restNames.filter((limited) => limited.zip.includes(zipValue));
  
        // refresh the list
        injectRestNames(filtered);
  
        // update the map markers
        markerPlace(filtered);
      };
    }
  
    form.addEventListener('submit', async (submitEvent) => { // async has to be declared all the way to get an await
      submitEvent.preventDefault(); // This prevents your page from refreshing!
  
      // get a fresh list of 15 random restaurant names from the data
      restNames = dataHandler(arrayFromJson);
  
      // load the info into the page
      injectRestNames(restNames);
    });
  }
  // this actually runs first! It's calling the function above
  document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests