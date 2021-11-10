import './sass/main.scss';
import cardMarkup from './template/cards.hbs';


const refs = {
	form: document.querySelector('.search-form'),
   formBtn: document.querySelector('.js-form-btn'),
   loadMoreBtn: document.querySelector('.js-load-btn'),
   list: document.querySelector('.gallery'),
   goTopBtn: document.querySelector('.back_to_top'),
};

refs.form.addEventListener('submit', formSubmit);
refs.loadMoreBtn.addEventListener('click', loadBtn);
refs.list.addEventListener('click', pictureClick);
window.addEventListener('scroll', trackScroll);
refs.goTopBtn.addEventListener('click', backToTop);

let page = 1;

function formSubmit(e) {
  e.preventDefault();
  const value = e.currentTarget.elements.query.value;
  if (!value) {
    refs.loadMoreBtn.classList.add('is-hidden');
    return refs.list.innerHTML='';
  }
  const BASE_URL = 'https://pixabay.com/api/';
  const options = new URLSearchParams({
    key: '24236272-ddca1f1b5e29ebc5030ad9a1b',
    image_type: 'photo',
    q: value,
    orientation: 'horizontal',
    // page: 1,
    per_page: 12,
  });

  fetch(`${BASE_URL}?${options}&page=${page}`)
    .then(res => res.json())
    .then(data => {
      renderCard(data);
      refs.loadMoreBtn.classList.remove('is-hidden');
    });

  function renderCard({ hits }) {
    refs.list.innerHTML = cardMarkup(hits);
  }
}

function incrementPage () {
  page += 1;
};

function loadBtn() {
  incrementPage();
  const BASE_URL = 'https://pixabay.com/api/';
  const options = new URLSearchParams({
    key: '24236272-ddca1f1b5e29ebc5030ad9a1b',
    image_type: 'photo',
    q: refs.form.elements.query.value,
    orientation: 'horizontal',
    page: 1,
    per_page: 12,
  });

  fetch(`${BASE_URL}?${options}&page=${page}`)
    .then(res => res.json())
    .then(data => {
      renderCard(data);
      refs.loadMoreBtn.classList.remove('is-hidden');
      handleButtonClick();
    });

  function renderCard({ hits }) {
    const markup = cardMarkup(hits);
    refs.list.insertAdjacentHTML('beforeend', markup);
      
  }
}

const hiddenElement = refs.loadMoreBtn;
const btn = refs.formBtn;

function handleButtonClick() {
  hiddenElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

function pictureClick(e) {
  if (!e.target.classList.contains('card-img')) {
    return;
  }
  
  const instance = basicLightbox.create(`
    <img src="${e.target.dataset.largeImg}" width="800" height="600">
  `);
  instance.show();
}

function trackScroll() {
  const scrolled = window.pageYOffset;
  const coords = document.documentElement.clientHeight;

  if (scrolled > coords) {
    refs.goTopBtn.classList.add('back_to_top-show');
  }
  if (scrolled < coords) {
    refs.goTopBtn.classList.remove('back_to_top-show');
  }
}

function backToTop() {
  if (window.pageYOffset > 0) {
    window.scrollBy(0, -80);
    setTimeout(backToTop, 0);
  }
}