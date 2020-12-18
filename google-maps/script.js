const markers = []

function initMap() {
    loadMap({
        lat: -15.7745457,
        lng: -48.3575684
    })
    loadCities()
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

        const position = new google.maps.LatLng(city.lat, city.lng)

        const marker = new google.maps.Circle({
            center: position,
            fillColor: regionColor,
            fillOpacity: 0.3,
            strokeWeight: 0,
            radius: Math.sqrt(city.population) * 100,
            map: map
        })

        marker.region = city.region
        marker.color = regionColor

        markers.push(marker)
    })
}

function toggleView(region) {
    let visible

    markers.forEach(marker => {
        if (marker.region.toLowerCase() == region) {
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

    if (button.innerText == 'Marcar tudo') {
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

function loadMap(lat, lng) {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: new google.maps.LatLng(lat, lng),
        styles: [
            {
                elementType: 'geometry',
                stylers: [{ lightness: 50 }]
            },
            {
                elementType: 'labels.icon',
                stylers: [{ lightness: 50 }]
            },
            {
                stylers: [{ saturation: -100 }]
            }
        ]
    })
}