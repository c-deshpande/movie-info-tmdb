/* Init function, hiding the img element initially */
function initialize() {
   document.getElementById("moviePoster").style.visibility = "hidden";
}

jsonData = {};

/* Send request to the API */
function sendRequest() {

   var resultsView = document.getElementById("results");
   resultsView.innerHTML = "";

   var results = "";
   
   /* Creating an AJAX request */
   let xhr = new XMLHttpRequest();
   let query = encodeURI(document.getElementById("form-input").value);
   xhr.open("GET", "proxy.php?method=/3/search/movie&query=" + query);
   xhr.setRequestHeader("Accept", "application/json");
   xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
         /* When the response is receieved, creating list items with ID as the Movie ID */
         let json = JSON.parse(this.responseText);
         let list = document.getElementById('list');
         for (i = 0; i <= json.results.length - 1; i++) {

            let currentItem = json.results[i];

            results += '<br><p id="'+currentItem.id+'"'+ 'onclick="getMovieDetails(this.id)" style="font-weight: bold; cursor: pointer;">'+currentItem.title + " (" + currentItem.release_date.split("-")[0] + ")"+"<p><hr>";
         }

         resultsView.innerHTML = results;
      }
   };
   xhr.send(null);
}

/* Get movie details based on ID of the movie */
function getMovieDetails(id) {

   movieDetails = {}
   creditDetails = {}
   var genres = "";
   var cast = "";
   
   /* AJAX request for getting the Movie Details */
   let xhr = new XMLHttpRequest();
   xhr.open("GET", "proxy.php?method=/3/movie/" + id.toString());
   xhr.setRequestHeader("Accept", "application/json");
   xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
         movieDetails = JSON.parse(this.responseText);
         /* Assigning data to HTML elements i.e. the data from received JSON */
         document.getElementById("moviePoster").style.visibility = "visible";
         document.getElementById("moviePoster").src = "http://image.tmdb.org/t/p/w185" + movieDetails.poster_path;
         document.getElementById("movieTitle").innerHTML = movieDetails.title + " (" + movieDetails.release_date.split("-")[0] + ")";
         for(i = 0; i <= movieDetails.genres.length - 1; i++) {

            if(i < (movieDetails.genres.length - 1)){
               genres += movieDetails.genres[i].name + ", ";
            } else {
               genres += movieDetails.genres[i].name;
            }
         }
         document.getElementById("movieGenres").innerHTML = genres;
         document.getElementById("movieOverview").innerHTML = movieDetails.overview;
      }
   };
   xhr.send(null);

   /* AJAX request fot getting the cast and credits details */
   let xhr1 = new XMLHttpRequest();
   console.log("proxy.php?method=/3/movie/" + id.toString() + "/credits")
   xhr1.open("GET", "proxy.php?method=/3/movie/" + id.toString() + "/credits");
   xhr1.setRequestHeader("Accept", "application/json");
   xhr1.onreadystatechange = function () {
      if (this.readyState == 4) {
         creditDetails = JSON.parse(this.responseText);
         for(i = 0; i < 5; i++) {

            if(i < 4) {
               cast += creditDetails.cast[i].name + ", ";
            } else {
               cast += creditDetails.cast[i].name;
            }   
         }
         document.getElementById("top5cast").innerHTML = cast;
      }
   };
   xhr1.send(null);
}