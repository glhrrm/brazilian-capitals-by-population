const markers = []
let map

initMap()

function initMap() {
    loadMap({
        lat: -30,
        lng: -53
    })
    loadCities()
}

function loadMap(coordinates) {
    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([coordinates.lng, coordinates.lat]),
            zoom: 7
        })
    })
}

function loadCities() {
    const regions = new Set()

    citiesWithCoordinates.forEach(city => {
        switch (city.region) {
            case 'Norte':
                regionColor = '#32CD32'
                break
            case 'Nordeste':
                regionColor = '#8A2BE2'
                break
            case 'Centro-Oeste':
                regionColor = '#FF8C00'
                break
            case 'Sudeste':
                regionColor = '#1E90FF'
                break
            case 'Sul':
                regionColor = '#FF1493'
                break
        }

        if (!regions.has(city.region)) {
            regions.add(city.region)
            document.getElementById('regions').innerHTML += `<li
                class="region ${city.region.toLowerCase()}"
                onclick="toggleView('${city.region.toLowerCase()}')"
                style="background-color: ${regionColor}50;"
                >${city.region}</li>`
        }

        const marker = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [
                    new ol.Feature({
                        geometry: new ol.geom.Circle(
                            ol.proj.fromLonLat([city.lng, city.lat]),
                            Math.sqrt(city.population) * 100
                        )
                    })
                ]
            }),
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: `${regionColor}4D`,
                })
            })
        })

        marker.region = city.region
        marker.color = regionColor

        console.log(marker)

        markers.push(marker)
    })

    markers.forEach(marker => map.addLayer(marker))
}

function toggleView(region) {
    let visible

    markers.forEach(marker => {
        if (marker.region.toLowerCase() === region) {
            if (marker.getVisible()) {
                marker.setVisible(false)
                document.querySelectorAll(`.${region}`)[0].style.backgroundColor = 'transparent'
                visible = false
            } else {
                marker.setVisible(true)
                document.querySelectorAll(`.${region}`)[0].style.backgroundColor = `${marker.color}50`
                visible = true
            }
        }
    })

    return visible
}

function checkOrUncheckAll() {
    let button = document.getElementById('check-button')

    if (button.innerText === 'Marcar tudo') {
        Array.from(document.getElementsByClassName('region')).forEach(region => {
            if (!toggleView(region.classList[1])) toggleView(region.classList[1])
        })
        button.innerText = 'Desmarcar tudo'
    } else {
        Array.from(document.getElementsByClassName('region')).forEach(region => {
            if (toggleView(region.classList[1])) toggleView(region.classList[1])
        })
        button.innerText = 'Marcar tudo'
    }
}