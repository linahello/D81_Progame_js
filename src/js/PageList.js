const PageList = (argument = '') => {
  const preparePage = () => {
    const cleanedArgument = argument.trim().replace(/\s+/g, '-');

    const showMore = () => {
      var hidden = document.querySelectorAll('.hidden')
      if (hidden.length > 9) {
        for (var i = 0; i< 9; i++) {
        hidden[i].classList.remove('hidden')
        }
      } else {
        for (var i = 0; i< hidden.length; i++) {
          hidden[i].classList.remove('hidden')
        }
        document.getElementById('show-more').classList.add('hidden')
      }
    }
    
    const mainPage = document.getElementById('main-page')
    mainPage.classList.remove('hidden')

  const form = document.getElementsByTagName('input')[0]
  form.addEventListener('keypress', (e) => {
    if(e.key == 'Enter') {
      let searchArgument = form.value;
      window.location = `#pagelist/${searchArgument}`
    }
  })

  const platform = document.getElementsByClassName('form-select')[0]
  platform.addEventListener('change',(e) => {
    let platformArgument = e.target.value;
    fetchList(`https://api.rawg.io/api/games?dates=2023-01-01,2023-12-31&stores=1,2,3,4,5,6&ordering=-rating&page_size=27&parent_platforms=${platformArgument}&key=${import.meta.env.VITE_RAWG_KEY}`)
  })
  
  const displayPlatforms = (platforms) => {
      let inner = ''
      platforms.forEach(platform => {
        switch (platform.platform.slug) {
          case 'pc':
            inner += `<img src=./assets/svg/windows.svg width="18px" height="20px" alt="logo windows" class="me-2">`
            break;
          case 'playstation':
            inner += `<img src=./assets/svg/ps4.svg width="18px" height="20px" alt="logo playstation" class="me-2">`
            break;
          case 'xbox':
            inner += `<img src=./assets/svg/xbox.svg width="18px" height="20px" alt="logo xbox" class="me-2">`
            break;
          case 'nintendo':
            inner += `<img src=./assets/svg/switch.svg width="18px" height="20px" alt="logo nintendo" class="me-2">`
            break;  
          case 'mac':
            inner += `<img src=./assets/svg/apple-512.png width="18px" height="20px" alt="logo mac" class="me-2">`
            break; 
          case 'linux':
            inner += `<img src=./assets/svg/linux.svg width="18px" height="20px" alt="logo linux" class="me-2">`
            break; 
          case 'android':
            inner += `<img src=./assets/svg/mobile.svg width="18px" height="20px" alt="logo android" class="me-2">`
            break;  
          case 'ios':
            inner += `<img src=./assets/svg/mobile.svg width="18px" height="20px" alt="logo ios" class="me-2">`
            break; 
          case 'web':
            inner += `<img src=./assets/svg/windows.svg width="18px" height="20px" alt="logo web" class="me-2">`
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
              a.classList.add('linked')
              a.setAttribute('id', `${responseData.publishers[i].id}`)
              a.addEventListener('click', (e) => {
                fetchList(`https://api.rawg.io/api/games?publishers=${e.target.id}&key=${import.meta.env.VITE_RAWG_KEY}`)
              })
              p.insertAdjacentElement('beforeend', a)
            }
            div.insertAdjacentElement('beforeend', p)
          })
      })
    };

    const displayResults = (articles) => {
      const resultsContent = articles.map((article) => (
        `<div class="col hidden">
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
  

      const resultsContainer = document.querySelector('.page-list .articles');
      resultsContainer.innerHTML = resultsContent.join("\n");
      resultsContainer.innerHTML += `<button type="button" id="show-more" class="mx-auto my-5 btn btn-danger btn-block">show more</button>`
      showMore()
      document.getElementById('show-more').addEventListener('click', showMore)

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
      const finalURL = argument ? `${url}&search=${argument}` : url;
      fetch(finalURL)
        .then((response) => response.json())
        .then((responseData) => {
          displayResults(responseData.results)
          getPublishers(responseData.results)
        }) 
    };
    fetchList(`https://api.rawg.io/api/games?dates=2023-01-01,2023-12-31&stores=1,2,3,4,5,6&ordering=-rating&page_size=27&key=${import.meta.env.VITE_RAWG_KEY}`, cleanedArgument);    
  };

  const render = () => {
    pageContent.innerHTML = `
      <section class="page-list container">
        <div class="articles row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">Loading...</div>
      </section>
    `;
    preparePage();
  };
  render();
};

export {PageList}