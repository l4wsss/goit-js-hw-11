import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import fetchImages from './fetchAPI';
import { generateImageCardMarkup } from './markup';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.gallery a');

let page = 1;
let searchQuery = '';

const appendImagesToGallery = (images, totalHits) => {
  if (images.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  if (page === 1) {
    gallery.innerHTML = '';
  }

  const markup = images.map(generateImageCardMarkup).join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  if (page === 1) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }

  if (totalHits <= page * 40) {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  } else {
    loadMoreBtn.style.display = 'block';
  }

  lightbox.refresh();
  page += 1;

  const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  searchQuery = e.target.elements.searchQuery.value.trim();
  page = 1;

  const { images, totalHits } = await fetchImages(searchQuery, page);
  appendImagesToGallery(images, totalHits);
});

loadMoreBtn.addEventListener('click', async () => {
  const { images, totalHits } = await fetchImages(searchQuery, page);
  appendImagesToGallery(images, totalHits);
});