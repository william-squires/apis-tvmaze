"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const TVMAZE_API_URL = "http://api.tvmaze.com";
const MISSING_IMAGE_PLACEHOLDER = "https://tinyurl.com/tv-missing";
//http://api.tvmaze.com/search/shows?q=[searchquery]
//http://api.tvmaze.com/shows/[showid]/episodes


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */
async function getShowsByTerm(term) {
  const config = {
    baseURL: TVMAZE_API_URL,
    url: "/search/shows",
    params: { q: term }
  }
  const response = await axios(config);
  const showsData = response.data;
  return showsData.map(show => getShowObject(show.show));
}

/** takes a show and returns an object with only its 
 * id, name, summary, and image. If there is no image,
 * instead set a placeholder image 
 */
function getShowObject(show) {
  let { id, name, summary, image } = show;
  // according to the API, if there is no image, image = null
  image = (image) ? image.original : MISSING_IMAGE_PLACEHOLDER;
  return { id, name, summary, image };
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

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */
async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});
$('#showsList').on('click', '.Show-getEpisodes', handleGetShowEpisodes);


async function handleGetShowEpisodes(evt) {
  evt.preventDefault();
  let showId = $(event.target).closest(".Show").data("show-id");
  await console.log(getEpisodesOfShow(showId));
  

}
/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const config = {
    baseURL: TVMAZE_API_URL,
    url: `/shows/${id}/episodes`
  }
  const response = await axios(config);
  let episodes = response.data.map(episode => getEpisodeObject(episode));
  return episodes;
}

/** takes an episode and returns an object with only its 
 * id, name, season, and number.
 */
function getEpisodeObject(episode) {
  const {id, name, season, number} = episode;
  return {id, name, season, number};
}
/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
