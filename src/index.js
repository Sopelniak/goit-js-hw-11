import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEL = document.querySelector('#search-form');
const galleryEl = document.querySelector('div.gallery');
const btnLoadMoreEl = document.querySelector('button.load-more');

const message = document.createElement('p');
message.textContent =
  "We're sorry, but you've reached the end of search results.";
message.style.textAlign = 'center';

const BASE_URL = 'https://pixabay.com/api/';
const config = {
  params: {
    key: '30807685-8e6cd00353cc1057d11bd8bf4',
    q: '',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: 1,
    per_page: 40,
  },
};

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
  scrollZoom: false,
});
formEL.addEventListener('submit', onSubmitForm);
btnLoadMoreEl.addEventListener('click', onClickLoadMore);

function onClickLoadMore() {
  config.params.page += 1;
  fetchData();
}

function onSubmitForm(e) {
  e.preventDefault();
  if (e.target.searchQuery.value !== config.params.q) {
    galleryEl.innerHTML = '';
  } else {
    return;
  }
  config.params.q = e.target.searchQuery.value;
  fetchData();
}

async function fetchData() {
  try {
    const response = await axios.get(BASE_URL, config);
    const galleryItems = response.data.hits;

    if (galleryItems.length === 0) {
      Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    if (galleryItems.length > 0 && config.params.page === 1) {
      Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
    }

    if (response.data.totalHits > 40) {
      btnLoadMoreEl.style.display = 'block';
      message.remove();
    }

    if (galleryItems.length < 40) {
      btnLoadMoreEl.style.display = 'none';
      galleryEl.after(message);
    }

    const markup = galleryItems
      .map(
        ({
          largeImageURL,
          webformatURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => `
        <a href=${largeImageURL}>
        <div class="photo-card">
            <img src=${webformatURL} alt=${tags} loading="lazy" />
            <div class="info">
              <p class="info-item">
                <b>Likes</b> ${likes}
              </p>
              <p class="info-item">
                <b>Views</b> ${views}
              </p>
              <p class="info-item">
                <b>Comments</b> ${comments}
              </p>
              <p class="info-item">
                <b>Downloads</b> ${downloads}
              </p>
            </div>
            </div>
            </a>`
      )
      .join('');
    galleryEl.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();

    if (config.params.page !== 1) {
      window.scrollBy({
        top: window.innerHeight - 70,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    console.log(error.message);
  }
}
