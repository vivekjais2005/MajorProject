

	mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style : "mapbox://styles/mapbox/streets-v12",
        center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 8 // starting zoom
    });
     
   
    //Create a default Marker and add it to the map.
    const marker = new mapboxgl.Marker({color : "red"})
        .setLngLat(coordinates)//listing.geometry.coordinates
        .addTo(map);


    // const popup = new mapboxgl.Popup({offset: popupOffsets, className: 'my-class'})
    // .setLngLat(e.lngLat)
    // .setHTML("<h1>Hello World!</h1>")
    // .setMaxWidth("300px")
    // .addTo(map);