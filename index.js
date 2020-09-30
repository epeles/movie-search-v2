// import 'regenerator-runtime/runtime';

const form = document.querySelector('#form');
const search = document.querySelector('#search');
const result = document.querySelector('#result');
const modal = document.getElementById('modal_container');
const modal_content = document.querySelector('.modal-content');

const apiURL_movieList = 'https://www.omdbapi.com/?apikey=ac72a227&s='
const apiURL_movieSingle = 'https://www.omdbapi.com/?apikey=ac72a227&i='

form.addEventListener('submit', e => {
    e.preventDefault();
    const searchMovie = search.value.trim();
    if(!searchMovie) alert('Please type in a search movie');
    else {
        form.reset();
        getList(searchMovie);
    }
})

//Fetch results from user input 
async function getList(title) {    
    const res = await fetch(`${apiURL_movieList}${title}`);
    const data = await res.json();
    
    result.innerHTML = `
    <p class="searchRes">Results for "${title}"</p>
    ${data.Search
        .filter(t => (t.Poster !== 'N/A' && t.Type === 'movie' || t.Poster !== 'N/A' && t.Type === 'series'))
        .map(movie => `
        <div class="movie">
            <img class="poster_img" src="${movie.Poster}" alt="${movie.Title}" data-movieid="${movie.imdbID}"/>
            <div class="movie-info">
                <h3>${movie.Title}</h3>
            </div>
        </div>`)             
        .join('')}
    `;
}    
 
//When clicked on poster, pass the movie_id argument to getMovie function to show the movie  
result.addEventListener('click', e => {
    const clickedEl = e.target;
    if (clickedEl.tagName === 'IMG') {
      const movie_id = clickedEl.dataset.movieid;
      //OR const movie_id = clickedEl.getAttribute('data-movieid');
      modal.classList.add('show');
      getMovie(movie_id);
    }
});

//Fetch the movie by ID when called from click Event Listener
async function getMovie(movie_id) {
    const res = await fetch(`${apiURL_movieSingle}${movie_id}`);
    const data = await res.json();
    
    modal_content.innerHTML = `
        <button class="close-btn" id="close">&times;</button>
        <div class="box box0">
            <h1 class="title">${data.Title} 
            ${data.Type === 'series' ? `<p class="runtime">(TV Series - ${time_convert(data.Runtime)})</p>` : `<p class="runtime">(${time_convert(data.Runtime)})</p>` }
            </h1>
        </div>    
        <div class="box box1">
            <img class="poster" src=${data.Poster} alt="${data.Poster}">
        </div>
        <div class="box box1">
            <ul class="movies">
                <li><b>${data.Plot}</b></li>
                ${data.Director === 'N/A' ? '' : `<li>Director: ${data.Director}</li>`}
                <li>Cast: ${data.Actors}</li>
                <li>Year: ${data.Year} (Released on ${data.Released})</li>
                <li>Genre: ${data.Genre}</li>
                <li>Country: ${data.Country}</li>
                ${data.totalSeasons ? `<li>Seasons: ${data.totalSeasons}</li>` : ''}
                <li class="rating">Rating: <span class="${getClassByRate(data.imdbRating)} rating">${data.imdbRating}</span></li>
                <li><a href="https://imdb.com/title/${data.imdbID}" target="_blank"><img class="imdb" src="https://www.iconninja.com/files/627/873/110/imdb-icon.png" data-toggle="tooltip" data-html="true" title="More info about ${data.Title} on IMDb"></a></li>
            </ul>
        </div>    
    `;   
}

// Hide modal when click on close button
modal.addEventListener('click', e => { 
    if (e.target.id === 'close') modal.classList.remove('show');
});
//Hide modal when clicking outside the modal 
window.addEventListener('click', e => {
    if (e.target === modal) modal.classList.remove('show');
});

//Coloring the rates depending of the number 
function getClassByRate(vote) {
    if (vote >= 8) return "green";
    else if (vote >= 5) return "orange";
    else return "red";
}

//take the number in minutes and convert to a friendly view (ie: instead of 140min, convert to 2h 20min )
function time_convert(num) {
    if (parseInt(num) > 60) return `${Math.floor(parseInt(num) / 60)}h ${parseInt(num) % 60}min`;
    else return num;         
}