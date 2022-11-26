import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { renderGallery } from './render';
import { fetchPictures } from './fetch';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
let pageNumber;
let searchParam;
let lightbox = new SimpleLightbox('.gallery .gallery-div a');

form.addEventListener('submit', handleSubmit);


async function handleSubmit(event) {
    pageNumber = 1;

    event.preventDefault();
    let {
        elements: { searchQuery },
    } = event.currentTarget;
    searchParam = searchQuery.value.replaceAll(' ', '+');
    const data = await fetchPictures(searchParam, pageNumber);
    console.log(data);
    if (data.totalHits) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }
    const rendered = renderGallery(data.hits, pageNumber);
    gallery.innerHTML = rendered.join('');
    // scroll
    gallery.addEventListener('scroll', scrollEnd);
    lightbox.refresh();
}

async function loadMore() {
    pageNumber += 1;
    const data = await fetchPictures(searchParam, pageNumber);
    const rendered = renderGallery(data.hits, pageNumber);
    gallery.innerHTML += rendered.join('');
    lightbox.refresh();
}

export function scrollEnd() {
    if (gallery.scrollTop + gallery.clientHeight >= gallery.scrollHeight - 10) {
        loadMore();
    }
}