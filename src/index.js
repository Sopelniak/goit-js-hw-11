import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { SearchQuery } from './js/searchQuery';
import { makeMarkup } from './js/markupItems';
import { messages } from './js/messages';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEL = document.querySelector('#search-form');
const galleryEl = document.querySelector('div.gallery');
const btnLoadMoreEl = document.querySelector('button.load-more');

const message = document.createElement('p');
message.textContent = messages.endOfSearch;
message.style.textAlign = 'center';

const searchQuery = new SearchQuery();
const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
  scrollZoom: false,
});

formEL.addEventListener('submit', onSubmitForm);
btnLoadMoreEl.addEventListener('click', onClickLoadMore);

function onClickLoadMore() {
  searchQuery.page += 1;
  fetchData();
}

function onSubmitForm(e) {
  e.preventDefault();
  const { value } = e.target.searchQuery;
  if (value !== searchQuery.query) {
    galleryEl.innerHTML = '';
    searchQuery.page = 1;
    searchQuery.query = value;
    fetchData();
  }
}

async function fetchData() {
  try {
    const response = await searchQuery.getResponse();
    const { hits: hitsForPage, totalHits } = response.data;
    const page = searchQuery.page;

    if (hitsForPage.length === 0) {
      Notify.info(messages.noImages);
    }

    if (hitsForPage.length > 0 && page === 1) {
      Notify.info(messages.hooray(totalHits));
    }

    if (totalHits > 40) {
      btnLoadMoreEl.style.display = 'block';
      message.remove();
    }

    if (hitsForPage.length < 40) {
      btnLoadMoreEl.style.display = 'none';
      galleryEl.after(message);
    }

    galleryEl.insertAdjacentHTML('beforeend', makeMarkup(hitsForPage));
    lightbox.refresh();

    if (page !== 1) {
      window.scrollBy({
        top: window.innerHeight - 70,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    console.log(error.message);
  }
}
