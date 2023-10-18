const $recentMovieContainer = document.getElementById("recentMovieContainer");
const $dotButtonContainer = document.getElementById("dotButtonContainer");
const $popularMovieContainer = document.getElementById("popularMovieContainer");

let recentlyMovieSlideInterval = null;
let lastIndex = 0;

// TMDB 관련 옵션 정의 클래스
class TMDB {
  static options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZmU1YjVmNWQxMGQ3NDk2MTdkZjg4ZGYyNDdlNmVkYiIsInN1YiI6IjY1MmYzZWMwMGNiMzM1MTZmODg1M2ExMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IuvgiTvQ4pgT5FDbyv973bJlmTQ-FwDfRw2TrmMm-ws",
    },
  };

  static getNowPlaying() {
    return fetch(
      "https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&region=KR&page=1",
      this.options,
    )
      .then((response) => response.json())
      .catch((err) => console.error(err));
  }

  static getPopular() {
    return fetch(
      "https://api.themoviedb.org/3/movie/popular?language=ko-KR&region=KR&page=1",
      this.options,
    )
      .then((response) => response.json())
      .catch((err) => console.error(err));
  }
}

// 최신 영화를 왼쪽으로 움직이게 하는 함수
const moveRecentlyCardByIndex = (index) => {
  $recentMovieContainer.style.transform = `translate3d(${-(
    100 * index
  )}vw, 0px, 0px)`;
};

// 최신 영화 슬라이드 버튼 클릭시 색상 변화
const changeSelectedButtonColor = (order) => {
  document.querySelectorAll(".list-button").forEach((elem) => {
    const elemOrder = elem.getAttribute("order");
    if (order === +elemOrder) {
      elem.classList.add("bg-black");
    } else elem.classList.remove("bg-black");
  });
};

// 최신 영화 호출
TMDB.getNowPlaying().then((list) => {
  const results = list.results.slice(0, 15);

  // 결과가 있을 경우
  if (results) {
    let resultLength = results.length + 1; // 첫 번째 영화를 끝에 추가해주기 때문에 + 1을 해준다.
    // recentMoveiContainer의 width를 결과 길이만큼 늘려준다.
    $recentMovieContainer.style.width = `${100 * resultLength}vw`;

    // 최신 영화 카드 자동 이동 Interval 생성
    const cardMoveInterval = () => {
      return setInterval(() => {
        if (++lastIndex >= resultLength) {
          // 보여지는 index가 최신 영화 목록 길이 보다 커지면 초기화
          lastIndex = 0;

          // [1] [2] [3] ... [N] [1] 순으로 목록이 되어있음. 끝으로 가면 무한 루프처럼 보이기 위해 transisiton 잠시 멈춤
          $recentMovieContainer.style.transition = "ease 0s";
          moveRecentlyCardByIndex(0);
          changeSelectedButtonColor(0);
          setTimeout(() => {
            $recentMovieContainer.style.transition = "ease 1s";
          }, 1000);
        } else {
          moveRecentlyCardByIndex(lastIndex);

          // card는 결과개수 + 1이지만 슬라이드 버튼은 결과개수 만큼만 보이기 때문에 lastIndex에 1을 더해서 비교
          changeSelectedButtonColor(
            lastIndex + 1 >= resultLength ? 0 : lastIndex,
          );
        }
      }, 300000);
    };

    // 카드를 포함하는 박스에 마우스를 올려놓을시 Interval 제거
    $recentMovieContainer.parentElement.addEventListener("mouseenter", () => {
      clearInterval(recentlyMovieSlideInterval);
    });

    // 카드를 포함하는 박스에서 마우스가 나갈시 Interval 재개
    $recentMovieContainer.parentElement.addEventListener("mouseleave", () => {
      recentlyMovieSlideInterval = cardMoveInterval();
    });

    // 최신 영화 Card 생성
    let firstMovie;
    results.forEach((movie, order) => {
      // 최신 영화 추가
      const itemDiv = document.createElement("div");
      itemDiv.className = "recent-movie-card";

      const html = `
        <div class="recent-movie-container"><img src="https://image.tmdb.org/t/p/original/${movie.backdrop_path}" alt="poster" class="recent-movie-card-img" />
          <div class="recent-movie-container-text">
            <h1>${movie.title}</h1>
            <p><span>⭐️ 평점: ${movie.vote_average} / 10</span><span>🗓️ 개봉일: ${movie.release_date}</span></p>
            <p>${movie.overview}</p>
          </div>
        </div>`;
      const itemImage = document.createElement("img");
      itemImage.src = `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`;

      itemDiv.innerHTML = html;
      if (order === 0) firstMovie = itemDiv.cloneNode(true);
      $recentMovieContainer.append(itemDiv);

      const itemLi = document.createElement("li");
      const itemButton = document.createElement("button");
      itemButton.className = "list-button";
      itemButton.setAttribute("order", order);

      itemButton.addEventListener("click", (e) => {
        changeSelectedButtonColor(order);
        moveRecentlyCardByIndex(order);
        lastIndex = order;
      });

      itemLi.append(itemButton);

      $dotButtonContainer.append(itemLi);
    });

    // 초기화
    changeSelectedButtonColor(0);
    $recentMovieContainer.append(firstMovie); // 마지막에 첫번째 영화 하나 추가 (무한 루프처럼 보이게 하기 위해)
    recentlyMovieSlideInterval = cardMoveInterval(); // 처음 인터벌 시작
  }
});

// 인기 영화 호출
TMDB.getPopular().then((list) => {
  console.log(list);
  const results = list.results;
  if (results) {
    results.forEach((movie) => {
      const movieCardDiv = document.createElement("div");
      const moviePosterImg = document.createElement("img");
      moviePosterImg.src = `https://image.tmdb.org/t/p/original/${movie.poster_path}`;
      moviePosterImg.className = "movie-poster";
      movieCardDiv.append(moviePosterImg);
      $popularMovieContainer.append(movieCardDiv);
    });
  }
});
