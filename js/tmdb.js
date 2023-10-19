// TMDB 관련 옵션 정의 클래스
class TMDB {
  static options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZmU1YjVmNWQxMGQ3NDk2MTdkZjg4ZGYyNDdlNmVkYiIsInN1YiI6IjY1MmYzZWMwMGNiMzM1MTZmODg1M2ExMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IuvgiTvQ4pgT5FDbyv973bJlmTQ-FwDfRw2TrmMm-ws',
    },
  };

  static getNowPlaying() {
    return fetch('https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&region=KR&page=1', this.options)
      .then(response => response.json())
      .catch(err => console.error(err));
  }

  static getPopular() {
    return fetch('https://api.themoviedb.org/3/movie/popular?language=ko-KR&region=KR&page=1', this.options)
      .then(response => response.json())
      .catch(err => console.error(err));
  }

  static getTopRated() {
    return fetch('https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&region=KR&page=1', this.options)
      .then(response => response.json())
      .catch(err => console.error(err));
  }

  static getDetail(id) {
    return fetch(`https://api.themoviedb.org/3/movie/${id}?language=ko-KR`, this.options)
      .then(response => response.json())
      .catch(err => console.error(err));
  }

  static searchByName(name) {
    return fetch(
      `https://api.themoviedb.org/3/search/movie?query=${name}&include_adult=false&language=ko-KR&page=1&region=KR`,
      this.options,
    )
      .then(response => response.json())
      .catch(err => console.error(err));
  }
}
