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
};
// const inputField = document.querySelector('form input'),

// refs.form.addEventListener('input', onInput);
refs.form.addEventListener('submit', onSubmit);

// function onInput(event) {
//   console.log(event.target.value);
// }
let searchText = null;

async function onSubmit(event) {
  // console.log('submit форми');
  event.preventDefault();
  saveSearchText(refs.input.value);
  // console.log(event.currentTarget);
  // console.log('відправити запит на сервер');
  const response = await getPhotos(searchText);
  // console.log('отримати відповідь від сервера');
  // await responseDataContainsControl(response);
  console.log('response', response);
  console.log('response.data', response.data);
  console.log('response.data.hits', response.data.hits);
  console.log('response.data.hits.length', response.data.hits.length);
  if (response.data.hits.length == 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  console.log('сформувати розмітку');
  const markup = markupItems(response.data.hits);

  console.log('додати розмітку на сторінку');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function saveSearchText(text) {
  if (searchText !== text) {
    clearInterface();
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
    page: 1,
    per_page: 40,
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
