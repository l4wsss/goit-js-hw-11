import axios from 'axios';
import Notiflix from 'notiflix';

const fetchImages = async (searchQuery, page) => {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '38182366-be3024add4069e03dd1880ded',
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

    return {
      images,
      totalHits: data.totalHits,
    };
  } catch (error) {
    Notiflix.Notify.failure(
      'Oops! Something went wrong. Please try again later.'
    );
    console.error(error);
    return {
      images: [],
      totalHits: 0,
    };
  }
};

export default fetchImages;