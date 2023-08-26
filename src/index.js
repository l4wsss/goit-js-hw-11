import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.gallery a');

let page = 1;
let searchQuery = '';

const fetchImages = async () => {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '39076009-1c08ad23164944ae582291e4b',
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: page,
      },
    });

    const { data } = response;
    const images = data.hits;

    if (images.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    if (page === 1) {
      gallery.innerHTML = '';
    }

    const markup = images
      .map(
        image => `
        <div class="photo-card">
          <a href="${image.largeImageURL}">
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
          </a>
          <div class="info">
            <p class="info-item"><b>Likes:</b> ${image.likes}</p>
            <p class="info-item"><b>Views:</b> ${image.views}</p>
            <p class="info-item"><b>Comments:</b> ${image.comments}</p>
            <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
          </div>
        </div>
      `
      )
      .join('');

    gallery.insertAdjacentHTML('beforeend', markup);

    if (page === 1) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }

    if (data.totalHits <= page * 40) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      loadMoreBtn.style.display = 'block';
    }

    lightbox.refresh();
    page += 1;

    const { height: cardHeight } =
      gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    Notiflix.Notify.failure(
      'Oops! Something went wrong. Please try again later.'
    );
    console.error(error);
  }
};

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  searchQuery = e.target.elements.searchQuery.value.trim();
  page = 1;
  fetchImages();
});

loadMoreBtn.addEventListener('click', fetchImages);
