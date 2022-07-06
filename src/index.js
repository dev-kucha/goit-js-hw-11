const axios = require('axios');
import Notiflix from 'notiflix';

// Notiflix.Notify.success('Sol lucet omnibus'); //Delete
// Notiflix.Notify.failure('Qui timide rogat docet negare'); //Delete
// Notiflix.Notify.warning('Memento te hominem esse'); //Delete
// Notiflix.Notify.info('Cogito ergo sum'); //Delete

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
let searchText = null;
let page = 1;
const perPage = 40;

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onClickLoadMore);

async function onSubmit(event) {
  event.preventDefault();
  refs.loadMoreBtn.classList.remove('is-visible');
  saveSearchText(refs.input.value);
  const response = await getPhotos(searchText);
  if (response.data.hits.length == 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  const markup = markupItems(response.data.hits);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  // console.log(Math.ceil(response.data.totalHits / perPage));
  if (Math.ceil(response.data.totalHits / perPage) > page) {
    refs.loadMoreBtn.classList.add('is-visible');
  }
  page += 1;
}

async function onClickLoadMore() {
  refs.loadMoreBtn.classList.remove('is-visible');
  const response = await getPhotos(searchText);
  const markup = markupItems(response.data.hits);
  refs.gallery.insertAdjacentHTML('beforeend', markup);

  // console.log(response.data.totalHits);

  if (Math.ceil(response.data.totalHits / perPage) > page) {
    Notiflix.Notify.success(
      `Hooray! We found ${response.data.totalHits} images`
    );
    refs.loadMoreBtn.classList.add('is-visible');
  } else {
    Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  page += 1;
}

function saveSearchText(text) {
  if (searchText !== text) {
    clearInterface();
    page = 1;
  }
  searchText = text;
}

function clearInterface() {
  refs.gallery.innerHTML = '';
}

/*  */
function getPhotos(searchText) {
  const searchParams = new URLSearchParams({
    key: '28388902-8d9f79c473b0c7ec620d22f12',
    q: `${searchText}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: `${page}`,
    per_page: `${perPage}`,
  });

  try {
    const response = axios.get(`https://pixabay.com/api/?${searchParams}`);
    // console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

function markupItems(items) {
  return items.map(item => markupOneItem(item)).join(' ');
}

function markupOneItem(item) {
  return `
  <div class="photo-card gallery__item">
    <img class="gallery__image" src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
    <div class="info">
      <div class="info-item">
        <p>Likes</p>
        <p><b>${item.likes}</b></p>
      </div>
      <div class="info-item">
        <p>Views</p>
        <p><b>${item.views}</b></p>
      </div>
      <div class="info-item">
        <p>Comments</p>
        <p><b>${item.comments}</b></p>
      </div>
      <div class="info-item">
        <p>Downloads</p>
        <p><b>${item.downloads}</b></p>
      </div>
    </div>
  </div>
  `;
}
