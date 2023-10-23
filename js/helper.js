import {
  CARD_IMAGE_SIZE,
  IMAGE_PADDING_SIZE,
  MAX_CARD_CONTAINER_SIZE,
  $modalContainer,
  $modal,
  $shadow,
  $searchResultContainer,
} from './index.js';
import TMDB from './tmdb.js';

// div를 움직이게 하는 함수
export const moveElementByWidth = (elem, width) => {
  elem.style.transform = `translate3d(${width}, 0px, 0px)`;
};

// 최신 영화 슬라이드 버튼 클릭시 색상 변화
export const changeSelectedButtonColor = order => {
  document.querySelectorAll('.list-button').forEach(elem => {
    const elemOrder = elem.getAttribute('order');
    if (order === +elemOrder) {
      elem.classList.add('bg-black');
    } else elem.classList.remove('bg-black');
  });
};

export const renderMovieSlideList = (container, dataList) => {
  const results = dataList.results;
  if (results) {
    results.forEach(movie => {
      const movieCardDiv = document.createElement('div');
      const moviePosterImg = document.createElement('img');
      movieCardDiv.style.width = `${CARD_IMAGE_SIZE}vw`;
      movieCardDiv.style.padding = `${IMAGE_PADDING_SIZE}px`;
      moviePosterImg.src = `https://image.tmdb.org/t/p/original/${movie.poster_path}`;
      moviePosterImg.className = 'movie-poster';
      movieCardDiv.append(moviePosterImg);

      addDetailClickEventListener(movieCardDiv, movie);

      container.append(movieCardDiv);
    });
    hideLoading(container.parentElement);
  }

  // scrollbar가 생길경우 최신 영화 카드 margin 조절..
  document.querySelectorAll('.recent-movie-card').forEach(elem => {
    elem.style.margin = `10px ${window.innerWidth - document.body.clientWidth + 10}px 10px 10px`;
  });
};

export const renderSearchResultList = (container, dataList) => {
  const results = dataList.results;
  if (results) {
    if (results.length > 0) {
      results
        .filter(movie => movie.poster_path && movie.backdrop_path)
        .forEach(movie => {
          const movieCardDiv = document.createElement('div');
          const moviePosterImg = document.createElement('img');
          moviePosterImg.src = `https://image.tmdb.org/t/p/original/${movie.poster_path}`;
          movieCardDiv.append(moviePosterImg);
          moviePosterImg.className = 'movie-poster';

          addDetailClickEventListener(movieCardDiv, movie);

          container.append(movieCardDiv);
        });
    } else {
      const warnDiv = document.createElement('div');
      warnDiv.innerText = '검색 결과가 없습니다.';
      warnDiv.className = 'no-result';
      container.append(warnDiv);
    }
  }
  hideLoading(container);
};

// elem: 클릭할 element, movie: movie정보
const addDetailClickEventListener = (elem, movie) => {
  elem.addEventListener('click', () => {
    showLoading($modalContainer);
    TMDB.getDetail(movie.id).then(detail => {
      if (detail) {
        document.getElementById('modalMovieTitle').innerText = detail.title;
        document.getElementById('modalMovieImage').src = `https://image.tmdb.org/t/p/original/${detail.backdrop_path}`;
        document.getElementById('modalMovieOverview').innerText = detail.overview;
        document.getElementById('modalMovieShort').innerText = detail.tagline || detail.original_title;
        document.getElementById('modalMovieRating').innerText = detail.vote_average;
        document.getElementById('modalMovieDate').innerText = detail.release_date;
      }
      hideLoading($modalContainer);
    });
    // document.getElementById("modalMovieTitle").innerText =
    showModal();
  });
};

const buttonSwitch = (elem, power) => {
  if (power === 'on') {
    elem.style.zIndex = '5';
    elem.style.opacity = '1';
  } else {
    elem.style.zIndex = '-99';
    elem.style.opacity = '0';
  }
};

const showModal = () => {
  $modal.style.opacity = '1';
  $modal.style.zIndex = '999';
  $shadow.style.opacity = '1';
  $shadow.style.zIndex = '98';
};

export const hideModal = () => {
  $modal.style.opacity = '0';
  $modal.style.zIndex = '-999';
  $shadow.style.opacity = '0';
  $shadow.style.zIndex = '-99';
};

export const showLoading = elem => {
  elem.classList.add('spin');
  elem.parentElement.classList.add('spin-bg');
};

export const hideLoading = elem => {
  elem.classList.remove('spin');
  elem.parentElement.classList.remove('spin-bg');
};

export const checkShowingLeftMoveButton = (elem, index) => {
  if (index <= 0) buttonSwitch(elem, 'off');
  else buttonSwitch(elem, 'on');
};

export const checkShowingRightMoveButton = (elem, index) => {
  if (-CARD_IMAGE_SIZE * index <= -MAX_CARD_CONTAINER_SIZE) buttonSwitch(elem, 'off');
  else buttonSwitch(elem, 'on');
};

export const showSearchResult = () => {
  document.querySelectorAll('.movie-main').forEach(elem => (elem.style.display = 'none'));
  $searchResultContainer.style.display = 'flex';
};

export const hideSearchResult = () => {
  document.querySelectorAll('.movie-main').forEach(elem => (elem.style.display = 'block'));
  $searchResultContainer.style.display = 'none';
};
