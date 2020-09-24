// import 'regenerator-runtime/runtime';

const form = document.querySelector('#form');
const search = document.querySelector('#search');
const result = document.querySelector('#result');
const more = document.querySelector('#more');

const open = document.getElementById('open');
const close = document.querySelector('#close');
const modal = document.getElementById('modal_container');
// const modal_content = document.querySelector('.modal');

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

async function getList(title) {    
    const res = await fetch(`${apiURL_movieList}${title}`);
    const data = await res.json();
    
    result.innerHTML = `
    <p class="searchRes">Results for "${title}"</p>
    ${data.Search
        .filter(t => (t.Poster !== 'N/A' && t.Type === 'movie' || t.Poster !== 'N/A' && t.Type === 'series'))
        .map(movie => `
        <div class="movie">
            <img class="poster_img" src="${movie.Poster}" alt="${movie.Title}" data-movietitle="${movie.imdbID}"/>
            <div class="movie-info">
                <h3>${movie.Title}</h3>
            </div>
        </div>`)             
        .join('')}
    `;
}    
 
result.addEventListener('click', e => {
    const clickedEl = e.target;
    if (clickedEl.tagName === 'IMG') {
      const movieName = clickedEl.dataset.movietitle;
      //OR const movieName = clickedEl.getAttribute('data-movietitle');
      modal.classList.add('show');
      getMovie(movieName);
      
    }
});

async function getMovie(movie) {
    const res = await fetch(`${apiURL_movieSingle}${movie}`);
    const data = await res.json();
    
    modal.innerHTML = `
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

// Hide modal
modal.addEventListener('click', e => { 
    if (e.target.id == 'close') modal.classList.remove('show');
});

// modal.onBlur = function() {
//     if (modal.classList.contains('show')) {
//         // console.log(true);
//         modal.classList.remove('show');
//     }
// }

function getClassByRate(vote) {
    if (vote >= 8) return "green";
    else if (vote >= 5) return "orange";
    else return "red";
}

function time_convert(num) {
    if (parseInt(num) > 60) return `${Math.floor(parseInt(num) / 60)}h ${parseInt(num) % 60}min`;
    else return num;         
}