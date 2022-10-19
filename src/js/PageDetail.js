import { PageList } from "./PageList";

const PageDetail = (argument) => {
  const preparePage = () => {
    const cleanedArgument = argument.trim().replace(/\s+/g, "-");
    const form = document.getElementsByTagName('input')[0]
    form.addEventListener('keypress', (e) => {
      if(e.key == 'Enter') {
        let searchArgument = form.value;
        window.location = `#pagelist/${searchArgument}`
      }
    })

    const mainPage = document.getElementById('main-page')
    mainPage.classList.add('hidden')


    const displayGame = (gameData) => {
      const { name, released, description, background_image, website, rating, 
        ratings_count, developers, platforms, publishers, genres, tags } = gameData;
      const articleDOM = document.querySelector(".page-detail .article");
      articleDOM.querySelector("h1.title").innerHTML = `${name},`;
      articleDOM.querySelector("p.release-date span").innerHTML = released;
      articleDOM.querySelector("p.description").innerHTML = description;
      articleDOM.querySelector("div.jumbotron").style.backgroundImage = `url('${background_image}')`;
      articleDOM.querySelector("a.website").href = website
      articleDOM.querySelector("h4.rating").innerHTML = `${rating} /5 - ${ratings_count} votes`;
      articleDOM.querySelector("p.developers span").innerHTML = developers.map((developer) => developer.name).join(' ');
      articleDOM.querySelector("p.platforms span").innerHTML = platforms.map((platform) => platform.platform.name).join(', ');
      articleDOM.querySelector("p.publishers span").innerHTML = publishers.map((publisher) => publisher.name).join(', ');
      articleDOM.querySelector("p.genres span").innerHTML = genres.map((genre) => genre.name).join(', ');
      articleDOM.querySelector("p.tags span").innerHTML = tags.map((tag) => tag.name).join(', ');
    };

    const fetchGame = (url, argument) => {
      fetch(`${url}/${argument}?key=${import.meta.env.VITE_RAWG_KEY}`)
        .then((response) => response.json())
        .then((responseData) => {
          displayGame(responseData);
        }
      );
    };
    fetchGame('https://api.rawg.io/api/games', cleanedArgument);
  };

  const render = () => {
    pageContent.innerHTML = `
      <section class="page-detail">
        <div class="article my-5">
          <div class="jumbotron">
            <a class="website mx-auto btn btn-danger btn-block py-2"><b>Check Website <span class="arrow"> ► </span></b></a>
          </div>
          <div class="px-5">
            <div class="w-100 mt-5 d-flex flex-row flex-wrap justify-content-between">
              <h1 class="title"></h1>
              <h4 class="rating text-danger"></h4>
            </div>
            <p class="description mt-5"></p>
            <div class="d-flex flex-wrap mt-4">
              <div class="d-flex flex-wrap w-50">
                <p class="release-date mr-5"><b>Release Date</b></br><span></span></p>
                <p class="developers mx-5"><b>Developers</b></br><span></span></p>
                <p class="genres mr-5"><b>Genres</b></br><span></span></p>
              </div>
              <div class="d-flex flex-wrap w-50">
                <p class="platforms mx-5"><b>Platforms</b></br><span></span></p>
                <p class="publishers mx-5"><b>Publishers</b></br><span></span></p>
                <p class="tags mx-5"><b>Tags</b></br><span></span></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    preparePage();
  };

  render();
}


export {PageDetail}
