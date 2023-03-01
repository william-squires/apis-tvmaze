"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const searchShowsUrl = "http://api.tvmaze.com/search/shows";
//http://api.tvmaze.com/search/shows?q=[searchquery]
//http://api.tvmaze.com/shows/[showid]/episodes


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  console.log("getShowsByTerm", term);
  const params = {params: {q : term}}
  const showsResponse = await axios.get(searchShowsUrl, params);
  let showsData = showsResponse.data;
  return showsData.map( show => makeShowObject(show.show));
}

/** takes a show and returns an object with only its 
 * id, name, summary, and image. If there is no image,
 * that value is set to null.
 */
function makeShowObject(show) {
  const id = show.id;
  const name = show.name;
  const summary = show.summary;
  const image = (show.image) ? show.image.original : null;
  return {id, name, summary, image};
}


/** Given list of shows, create markup for each and to DOM */
function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}" 
              alt="${show.name}" 
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */
async function searchForShowAndDisplay() {
  console.log("searchForShowAndDisplay ran");
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  console.log("button was pressed");
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
