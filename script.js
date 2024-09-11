let changeThemeBtn = document.querySelector(".themeChange");
let body = document.querySelector("body");

changeThemeBtn.addEventListener("click", changeTheme);

if(localStorage.getItem("theme") === "dark"){
    changeThemeBtn.classList.add('darkTheme');
    body.classList.add("dark");
}

function changeTheme() {
    if(localStorage.getItem("theme") === "dark"){
        changeThemeBtn.classList.remove('darkTheme');
        body.classList.remove("dark");
        localStorage.setItem("theme", "white");
    } else {
        changeThemeBtn.classList.add('darkTheme');
        body.classList.add("dark");
        localStorage.setItem("theme", "dark");
    }
}

let searchBtn = document.getElementById("bb");
searchBtn.addEventListener('click', searchMovie)

async function searchMovie() {
    // loader.style.display = "block"

    let searchText = document.getElementById('dd').value;
    console.log(searchText);

    let response = await sendRequest("http://www.omdbapi.com/", "GET", {
        "apikey": "194d0e4c",
        "t": searchText
    })
    
    if(response.Response == "False") {
        // loader.style.display = "none"
        alert(response.Error);  // Corrected to response.Error
    } else {
        let main = document.querySelector(".main")
        main.style.display = "block"

        let movieTitle = document.getElementById('title_2');
        movieTitle.innerHTML = response.Title;  // Corrected to response.Title
        let movieImg = document.querySelector(".movieImg")
        movieImg.style.backgroundImage = `url(${response.Poster})`;  // Corrected to response.Poster

        let detailList = ["Language", "Actors", "Country", "Genre", "Plot", "Released", "Runtime", "imdbRating"]
        let movieInfo = document.querySelector(".movieInfo")
        let infoContent = "";  // Initialize a string to build the HTML

        for(let i = 0; i < detailList.length; i++){
            let param = detailList[i];
            let desc = `<div class="desc darkBg">
                    <div class="title">${param}</div>
                    <div class="value">${response[param]}</div>
                </div>`;
            infoContent += desc;  // Append to the string
        }

        movieInfo.innerHTML = infoContent;  // Set the HTML in one go
        // loader.style.display = "none"
    }
}

async function sendRequest(url, method, data) {
    if(method == "POST") {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        response = await response.json();  // Parse the response as JSON
        return response;
    } else if(method == "GET") {
        url = url+"?"+ new URLSearchParams(data);
        let response = await fetch(url, {
            method: "GET"
        })

        response = await response.json();  // Parse the response as JSON
        return response;
    }
}
