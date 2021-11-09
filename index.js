
// Reference to API key
const key = config.API_KEY
const BASE_URL = "https://developer.nps.gov/api/v1/"

let dataTest = []
const searchInput = document.getElementById("search-input")
const searchResults = document.getElementById("search-results")
const campFavorites = document.getElementById("favorite-campgrounds")
const parkFavorites = document.getElementById("favorite-parks")
const form = document.getElementById("form")

const parksRadio = document.getElementById("radio-parks")
const campgroundsRadio = document.getElementById("radio-campgrounds")
const radioForm = document.getElementById("radio-form")
radioForm.addEventListener("change", toggleSearch)

// parksRadio.addEventListener("change", toggleSearch)
// campgroundsRadio.addEventListener("change", toggleSearch)

let searchDescription = document.getElementById("search-description")
let searchButton = document.getElementById("search-button")

function toggleSearch(event) {


    searchDescription.innerText = `Search ${event.target.dataset.name}`
    searchButton.innerText = `Search ${event.target.dataset.name}`
    // dataset allows read access to the data-name attribute in the HTML file
    form.style.display = "block"
    // Element property value is rendered, changing css style from "none"
    if (event.target.dataset.name === "Parks") {
        form.removeEventListener("submit", fetchCampgrounds) // remove the campground callback
        form.addEventListener("submit", fetchParks) // add the parks callback
    } else {
        form.removeEventListener("submit", fetchParks) // remove the parks callback
        form.addEventListener("submit", fetchCampgrounds) // add the campground callback
    }
}


// FETCH all favs
function fetchFavs(urlPortion) {
    fetch(`http://localhost:3000/${urlPortion}`)
        .then(resp => resp.json())
        .then(data => data.forEach(fav => renderFav(urlPortion, fav)))
}


// Dependency injection, call the function for different endpoints on the db.json
fetchFavs("camps");
fetchFavs("parks");

// FETCH Parks 
function fetchParks(event) {
    event.preventDefault()
    let searchInputString = event.target[0].value
    console.log(searchInputString)


    fetch(`${BASE_URL}parks?q=${searchInputString}&api_key=${key}`)

        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            displayParks(data)
        })
}

//FETCH Campgrounds
function fetchCampgrounds(event) {
    event.preventDefault()
    let searchInputString = event.target[0].value
    console.log(searchInputString)

    fetch(`${BASE_URL}campgrounds?q=${searchInputString}&api_key=${key}`)

        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            displayCampgrounds(data)
        })
}

// Strip parks response one layer
function displayParks(data) {
    console.log("In display test")
    dataTest = data.data
    renderParks(dataTest)
}
// Strip campgrounds response one layer
function displayCampgrounds(data) {
    console.log("In display test")
    dataTest = data.data
    renderCampgrounds(dataTest)
}



// Renders Campground Data 
function renderCampgrounds(dataTest) {
    searchResults.innerText = ""
    form.reset();
    dataTest.forEach(element => {

        const campDiv = document.createElement("div")
        campDiv.id = element.id
        campDiv.className = "search-result"

        const infoDiv = document.createElement("div")
        infoDiv.className = "info-div"

        const h3 = document.createElement("h3")
        h3.innerText = element.name
        h3.className = "camp-name"

        const p = document.createElement("p")
        p.innerText = element.description
        p.className = "camp-description"

        const p2 = document.createElement("p")
        p2.innerText = `Potable water:   ${element.amenities.potableWater}`
        p2.className = "camp-water"

        const p3 = document.createElement("p")
        p3.innerText = `Showers:  ${element.amenities.showers}`
        p3.className = "camp-shower"

        const p4 = document.createElement("p")
        p4.innerText = `Toilets:  ${element.amenities.toilets}`
        p4.className = "camp-toilets"

        const p5 = document.createElement("p")
        p5.innerText = `Number of first-come first-serve sites: ${element.numberOfSitesFirstComeFirstServe}`
        p5.className = "camp-first-come"

        const p6 = document.createElement("p")
        p6.innerText = `Number of reservable sites: ${element.numberOfSitesReservable}`
        p6.className = "camp-reservable"

        const a = document.createElement("a")
        a.setAttribute('href', element.url)
        a.innerHTML = element.name

        const img = document.createElement("img")
        img.src = element.images[0].url
        img.className = "park-image"

        const likeButton = document.createElement("button");
        likeButton.className = "like-button"
        likeButton.innerText = "Save to favorites"
        likeButton.addEventListener("click", () => postFav("camps", element));

        infoDiv.append(h3, p, p2, p3, p4, p5, p6, likeButton, a) // subitems of infodiv
        campDiv.append(img, infoDiv) //infodiv and img items, parkdiv is container
        searchResults.appendChild(campDiv) //
    })
}

function postFav(type, element) {
    let favObj = {
        name: element.name,
        image: element.images[0].url,
        url: element.url
    }

    fetch(`http://localhost:3000/${type}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(favObj)
    })
        .then(resp => resp.json())
        .then(favObj => {
            console.log(favObj)
            renderFav(type, favObj)

        })
}

// Renders all favorites to DOM, uses parameter to append to correct div, either camps or parks
// and using a string to render both camps and parks, using type as the parameter to pass through either camps or parks 
function renderFav(type, favObj) {
    const favDiv = document.createElement("div")
    favDiv.className = `fav-${type}-div`

    const favName = document.createElement("h4")
    favName.innerText = favObj.name
    favName.className = `fav-${type}-name`

    const favImage = document.createElement("img")
    favImage.src = favObj.image
    favImage.className = `fav-${type}-img`

    const a = document.createElement("a")
    a.setAttribute('href', favObj.url)
    a.innerHTML = 'See details'
    a.className = `fav-${type}-a`
    a.setAttribute('target', '_blank')

    const deleteButton = document.createElement("button")
    deleteButton.className = "delete-button"
    deleteButton.innerText = "x"
    deleteButton.id = favObj.id
    deleteButton.addEventListener("click", deleteFav(type))

    favDiv.append(deleteButton, favImage, favName, a)

    document.getElementById(`favorites-${type}`).appendChild(favDiv)

}

// Deletes a fav camp or park
function deleteFav(type) {
    return (event) => {
        event.preventDefault()
        console.log(event.target.id)

        fetch(`http://localhost:3000/${type}/${event.target.id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(resp => {
                if (resp.status === 200) {
                    // parentNode of event.target (delete button) is fav-{type}-div
                    event.target.parentNode.remove()
                }
                else {
                    alert("Error")
                }
            })

    }
}

// Renders parks Data
function renderParks(dataTest) {
    searchResults.innerText = ""
    form.reset();
    dataTest.forEach(element => {

        const parkDiv = document.createElement("div")
        parkDiv.id = element.id
        parkDiv.className = "search-result"

        const infoDiv = document.createElement("div")
        infoDiv.className = "info-div"

        const h3 = document.createElement("h3")
        h3.innerText = element.fullName
        h3.className = "park-name"

        const p = document.createElement("p")
        p.innerText = element.description
        p.className = "park-description"

        const p3 = document.createElement("p")
        p3.innerText = `Activities`
        p3.className = "activities"

        // const activities = element.activities.map(element => element.name).map(name => {
        //     let li = document.createElement("li")
        //     li.innerText = name
        //     return li
        // })
        // p3.append(activities)

        element.activities.forEach(element => {
            let li = document.createElement("li")
            li.innerText = element.name
            p3.appendChild(li)
        })

        const a = document.createElement("a")
        a.setAttribute('href', element.url)
        a.innerHTML = element.name

        const p2 = document.createElement("p")
        p2.innerText = `State: ${element.states}`
        p2.className = "park-state"

        const img = document.createElement("img")
        img.src = element.images[0].url
        img.className = "park-image"

        const likeButton = document.createElement("button");
        likeButton.className = "like-button"
        likeButton.innerText = "Save to favorites"
        likeButton.addEventListener("click", () => postFav("parks", element));

        infoDiv.append(h3, p, p2, p3, likeButton, a) // subitems of infodiv
        parkDiv.append(img, infoDiv) //infodiv and img items, parkdiv is container
        searchResults.appendChild(parkDiv) //
    })

}
