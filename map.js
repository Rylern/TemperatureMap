mapboxgl.accessToken = 'pk.eyJ1IjoicnlsZXJuIiwiYSI6ImNrOG13MTBnNjBqOHUzZ28yaDVwa2EyNG8ifQ.7j5QBEl47sKJqyu1rcCbNA';

const startingLatitude = -80;
const startingLongitude = -180;
const endingLatitude = 80;
const endingLongitude = 180;

const n = 10;


(async() => {
    const points = [];
    for (let i=0; i < n; i++) {
        for (let j=0; j < n; j++) {
            points.push({
                lat: startingLatitude + i * (endingLatitude - startingLatitude)/n,
                lng: startingLongitude + j * (endingLongitude - startingLongitude)/n,
                val: 0
            })
        }
    }

    const baseUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&lat=";
    const apiKey = '385df3d81f3a89c1c99c115735540c6d';
    const urls = points.map(point => baseUrl + point.lat + "&lon=" + point.lng + "&appid=" + apiKey);

    const weathers = await Promise.all(urls.map(async url => {
        const response = await fetch(url);
        return response.text();
    }));

    points.forEach((point, index) => {
        point.val = JSON.parse(weathers[index]).main.temp;
    })


    const map = (window.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10'
    }));
    
    map.on('load', () => {
        const layer = interpolateHeatmapLayer.create({
            points: points,
            layerID: 'temperature'
        });
        map.addLayer(layer, 'road-label');
    });
})();
