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

    const displayResults = (articles) => {
      const resultsContent = articles.map((article) => (
        `<div class="col hidden">
          <div class="card bg-dark text-white shadow-sm h-100">
            <img src="${article.background_image}" style="height:200px">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${article.name}</h5>
              <div class="d-flex flex-row">
              ${displayPlatforms(article.parent_platforms)}
              </div>
            </div>
          </div>
        </div>`
      ));
      const resultsContainer = document.querySelector('.page-list .articles');
      resultsContainer.innerHTML = resultsContent.join("\n");
      showMore()
      resultsContainer.innerHTML += `<button type="button" id="show-more" class="mx-auto my-5 btn btn-danger btn-block">show more</button>`
      document.getElementById('show-more').addEventListener('click', showMore)
    };

    const fetchList = (url, argument) => {
      const finalURL = argument ? `${url}&search=${argument}` : url;
      fetch(finalURL)
        .then((response) => response.json())
        .then((responseData) => {
          displayResults(responseData.results)
        });
    };

    fetchList(`https://api.rawg.io/api/games?key=${import.meta.env.VITE_RAWG_KEY}`, cleanedArgument);
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