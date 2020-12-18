(async function () {
    for (const [index, city] of cities.entries()) {
        if (city.name != " ") {
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${city.name}&key=${apiKey}`)
                .then(res => res.json())
                .then(res => position = res.results[0].geometry.location)
                .then(position => console.log({
                    name: city.name,
                    population: city.population,
                    lat: position.lat,
                    lng: position.lng
                }))
                .catch(() => console.log(`Erro com a cidade ${city.name}`))
        }
    }
})()