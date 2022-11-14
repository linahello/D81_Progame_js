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

  const listSimilars = (genre) => {
    const displayPlatforms = (platforms) => {
        let inner = ''
        platforms.forEach(platform => {
          switch (platform.platform.slug) {
            case 'pc':
              inner += `<img src=windows.svg width="18px" height="20px" alt="logo windows" class="me-2">`
              break;
            case 'playstation':
              inner += `<img src=ps4.svg width="18px" height="20px" alt="logo playstation" class="me-2">`
              break;
            case 'xbox':
              inner += `<img src=xbox.svg width="18px" height="20px" alt="logo xbox" class="me-2">`
              break;
            case 'nintendo':
              inner += `<img src=switch.svg width="18px" height="20px" alt="logo nintendo" class="me-2">`
              break;  
            case 'mac':
              inner += `<img src=apple-512.png width="18px" height="20px" alt="logo mac" class="me-2">`
              break; 
            case 'linux':
              inner += `<img src=linux.svg width="18px" height="20px" alt="logo linux" class="me-2">`
              break; 
            case 'android':
              inner += `<img src=mobile.svg width="18px" height="20px" alt="logo android" class="me-2">`
              break;  
            case 'ios':
              inner += `<img src=mobile.svg width="18px" height="20px" alt="logo ios" class="me-2">`
              break; 
            case 'web':
              inner += `<img src=windows.svg width="18px" height="20px" alt="logo web" class="me-2">`
              break; 
            default:
              break;
          }
        });
        return inner
      }
  
      const getPublishers = (articles) => {
        articles.forEach((article) => {
          fetch(`https://api.rawg.io/api/games/${article.id}?key=${import.meta.env.VITE_RAWG_KEY}`)
            .then((response) => response.json())
            .then((responseData) => {
              var div = document.getElementById(`info${article.id}`)
              var p = document.createElement('p')
              for (var i = 0; i< responseData.publishers.length; i++) {
                var a = document.createElement('span')
                a.innerHTML = `${responseData.publishers[i].name} `
                a.setAttribute('id', `${responseData.publishers[i].id}`)
                // a.addEventListener('click', (e) => {
                //   fetchList(`https://api.rawg.io/api/games?publishers=${e.target.id}&key=${import.meta.env.VITE_RAWG_KEY}`)
                // })
                p.insertAdjacentElement('beforeend', a)
              }
              div.insertAdjacentElement('beforeend', p)
            })
        })
      };
  
      const displayResults = (articles) => {
        const resultsContent = articles.map((article) => (
          `<div class="col col-md-4 mb-4">
            <div class="isgame card bg-dark text-white shadow-sm h-100" id="${article.id}">
              <img src="${article.background_image}" style="height:200px">
              <div class="info hidden2 card-body d-flex flex-column" id="info${article.id}">
                <p>${article.released}</br></p>
                <p>${article.rating}/5 - ${article.ratings_count} votes</br></p>
                <p>${article.genres.map((genre) => genre.name).join(", ")}</br>
              </div>
              <div class="card-body d-flex flex-column">
                <a href="#pagedetail/${article.slug}"class="card-title"><h5>${article.name}</h5></a>
                <div class="d-flex flex-row">
                  ${displayPlatforms(article.parent_platforms)}
                </div>
              </div>
            </div>
          </div>`
        ));
    
  
        const resultsContainer = document.querySelector('.similar');
        resultsContainer.innerHTML = resultsContent.join("\n");
  
        const displayInfo = (e) => {
          let findId = e.target.id
          let div = document.getElementById(`info${findId}`)
          div.classList.remove('hidden2')
        }
  
        const hideInfo = (e) => {
          let findId = e.target.id
          let div = document.getElementById(`info${findId}`)
          div.classList.add('hidden2')
        }
        
        const cards = document.querySelectorAll('.isgame')
        for (let card of cards) {
          card.addEventListener('mouseenter', displayInfo)
          card.addEventListener('mouseleave', hideInfo)
        }
        
      };
  
      const fetchList = (url, argument) => {
        const finalURL = `${url}&genres=${argument}&key=${import.meta.env.VITE_RAWG_KEY}`;
        fetch(finalURL)
          .then((response) => response.json())
          .then((responseData) => {
            displayResults(responseData.results)
            getPublishers(responseData.results)
          }) 
      };
    fetchList(`https://api.rawg.io/api/games?dates=2020-01-01,2023-12-31&stores=1,2,3,4,5,ordering=-metacritic&page_size=6`, genre);    
  };

    const mainPage = document.getElementById('main-page')
    mainPage.classList.add('hidden')

    const getScreenshots = (id) => {
      const containerScreenshots = document.querySelector("div.screenshots")
      fetch(`https://api.rawg.io/api/games/${id}/screenshots?key=${import.meta.env.VITE_RAWG_KEY}`)
        .then((response) => response.json())
        .then((responseData) => {
          let div = document.createElement('div')
          div.classList.add('row')
          for (var i = 0; i< responseData.count; i++) {
            let imgLink = responseData.results[i].image
            div.innerHTML += `
              <div class="col-12 col-md-6 my-3 p-0 pe-4">
                <img src="${imgLink}" class="w-100">
              </div>
            `
          }
          containerScreenshots.insertAdjacentElement('beforeend', div)
        });
    }

    const displayGame = (gameData) => {
      const { name, released, description, background_image, website, rating, 
        ratings_count, developers, platforms, publishers, genres, tags, stores, id } = gameData;
      const articleDOM = document.querySelector(".page-detail .article");
      articleDOM.querySelector("h1.title").innerHTML = `${name},`;
      released !== null ? articleDOM.querySelector("p.release-date").innerHTML = `<b>Release Date</b></br><span>${released}</span>` : '';
      articleDOM.querySelector("p.description").innerHTML = description;
      articleDOM.querySelector("div.jumbotron").style.backgroundImage = `url('${background_image}')`;
      articleDOM.querySelector("a.website").href = website
      articleDOM.querySelector("h4.rating").innerHTML = `${rating} /5 - ${ratings_count} votes`;
      developers.length !== 0 ? articleDOM.querySelector("p.developers").innerHTML = `<b>Developers</b></br>${developers.map((developer) => `<a href=#pagelist/&developers=${developer.id}><span>${developer.name}</span></a>`).join(' ')}`: "";
      articleDOM.querySelector("p.platforms span").innerHTML = platforms.map((platform) => `<a href="#pagelist/&platforms=${platform.platform.id}">${platform.platform.name}</a>`).join(', ');
      publishers.length !== 0 ? articleDOM.querySelector("p.publishers").innerHTML = `<b>Publishers</b></br>${publishers.map((publisher) => `<a href=#pagelist/&publishers=${publisher.slug}>${publisher.name}</a>`).join(', ')}` : "";
      articleDOM.querySelector("p.genres span").innerHTML = genres.map((genre) => `<a href="#pagelist/&genres=${genre.slug}">${genre.name}</a>`).join(', ');
      tags.length !== 0 ? articleDOM.querySelector("p.tags").innerHTML = `<b>Tags</b></br>${tags.map((tag) => `<a href=#pagelist/&tags=${tag.slug}>${tag.name}</a>`).join(', ')}` : "";
      articleDOM.querySelector("div.stores").innerHTML = stores.map((store) => `<p><a class="store-link" href="https://${store.store.domain}">${store.store.name}</a></p>`).join(' ');
      getScreenshots(id)
      listSimilars(genres[0].slug)
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
          
            <div class="container">
              <div class="w-100 mt-5 d-flex flex-row flex-wrap justify-content-between">
                <h1 class="title"></h1>
                <h4 class="rating text-danger"></h4>
              </div>
              <p class="description mt-5"></p>
              <div class="d-flex flex-wrap mt-4">
                <div class="d-flex flex-wrap w-50">
                  <p class="release-date mr-5"></p>
                  <p class="developers mx-5"></p>
                  <p class="genres mr-5"><b>Genres</b></br><span></span></p>
                </div>
                <div class="d-flex flex-wrap w-50">
                  <p class="platforms mx-5"><b>Platforms</b></br><span></span></p>
                  <p class="publishers mx-5"></p>
                  <p class="tags mx-5"></p>
                </div>
              </div>
              <h2 class="text-danger mt-4"><b>BUY</b></h2>
              <div class="stores"></div>
              <h2 class="text-danger mt-5 mb-4"><b>TRAILER</b></h2>
              <h2 class="text-danger mt-4"><b>SCREENSHOTS</b></h2>
              <div class="container-fluid screenshots"></div>
              <h2 class="text-danger mt-4"><b>YOUTUBE (nope)</b></h2>
              <h2 class="text-danger mt-4 mb-5"><b>SIMILAR GAMES</b></h2>
              <div class="row similar"></div>
            </div>
        </div>
      </section>
    `;

    preparePage();
  };

  render();
}


export {PageDetail}

{/* <div class="embed-responsive embed-responsive-16by9">
      <iframe src="https://www.youtube.com/embed/6wmW1Xps5e4"</iframe>
    </div> */}
