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
if (searchBtn){
    searchBtn.addEventListener('click', searchMovie)
}


async function searchMovie() {
    // loader.style.display = "block"

    let searchText = document.getElementById('dd').value;
    console.log(searchText);

    let response = await sendRequest("https://www.omdbapi.com/", "GET", {
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

        movieInfo.innerHTML = infoContent;  
    //   loader.style.display = "none"
      searchSimilarMovies(searchText)
    }

    async function searchSimilarMovies(title){
        let similarMovies = await sendRequest("https://www.omdbapi.com/", "GET", {
            "apikey": "194d0e4c",
            "s": title
        })
        

        // if (similarMovies.Response == "False"){
        //     document.querySelector(".similarMovieTitle h2").style.display = "none"
        //     document.querySelector(".similarMovies").style.display = "none"
        // } else {
        //     document.querySelector(
        //         ".similarMovieTitle h2"
        //     ).innerHTML = `Похожих фильмов: ${similarMovies.totalResults}`;
        //     showSimilarMovies(similarMovies.Search);
        //     console.log(similarMovies)
        // }
        let similarMovieTitle = document.querySelector(".similarMovieTitle h2")
        similarMovieTitle.innerHTML = `Похожих фильмов: ${similarMovies.totalResults}`
        similarMovieTitle.style.display="block"
        console.log(similarMovies)
        showSimilarMovies(similarMovies.Search)
    }

    function showSimilarMovies(movies){
        let similarMoviesContainer = document.querySelector(".similarMovies")
        let similarMoviesTitle = document.querySelector(".similarMovieTitle h2")
        similarMoviesContainer.innerHTML = ""

        movies.forEach((movie) => {
            const index = favs.findIndex(obj => obj.imdbID === movie.imdbID);
            let favCheck
            if (index < 0){
                favCheck = ""
            } else {
                favCheck = "active"
            }

            similarMoviesContainer.innerHTML +=`<div class="similarMoviesCard" style="background-image:url(${movie.Poster})">
            <div class="favStar ${favCheck}" data-title="${movie.Title}" data-poster="${movie.Poster}" data-imdbID="${movie.imdbID}"></div>
            <div class="similarMoviesText">${movie.Title}</div>
            </div>`
        });
        activateFavBtns();
    }

       function  activateFavBtns(){
            document.querySelectorAll(".favStar").forEach(elem =>{
                elem.addEventListener("click", addToFav);
            })
        }

        function addToFav(){
            let favBtn = event.target
            let title = favBtn.getAttribute("data-title");
            let poster = favBtn.getAttribute("data-poster");
            let imdbID = favBtn.getAttribute("data-imdbID");

            const index = favs.findIndex(obj => obj.imdbID === imdbID);


            if (index < 0){
            let fav = {title, poster, imdbID}
            // добавить новый фильм в LS
            favs.push(fav)
            localStorage.setItem("favs", JSON.stringify(favs));
            favBtn.classList.add('active')
            } else {
                //Удалить фильм из LS 
                favs.splice(index, 1)
                localStorage.setItem("favs", JSON.stringify(favs));
                favBtn.classList.remove('active')
            }
        }

        let favs = localStorage.getItem("favs")
        if(!favs){
            favs = [];
            localStorage.setItem("favs", JSON.stringify(favs));
        } else {
            favs = JSON.parse(favs);

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

function showFavs() {
    // favs - Массив из объектов с избранными файлами 
    let similarMoviesContainer = document.querySelector(".similarMovies");
        let similarMoviesTitle = document.querySelector(".similarMovieTitle h2");
        similarMoviesContainer.innerHTML = "";
        similarMoviesTitle.innerHTML = `Фильмы в избранном: ${favs.length}`

        favs.forEach((movie) => {
            let favCheck = "active"
          similarMoviesContainer.innerHTML +=`<div class="similarMoviesCard" style="background-image:url(${movie.poster})">
            <div class="favStar ${favCheck}" data-title="${movie.title}" data-poster="${movie.poster}" data-imdbID="${movie.imdbID}"></div>
            <div class="similarMoviesText">${movie.title}</div>
            </div>`
            });
        similarMoviesContainer.style.display = "grid";
        similarMoviesTitle.style.display = "block";
            activateFavBtns();
            
}
