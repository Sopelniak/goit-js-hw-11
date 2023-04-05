import axios from 'axios';

export class SearchQuery {
  BASE_URL = 'https://pixabay.com/api/';
  config = {
    params: {
      key: '30807685-8e6cd00353cc1057d11bd8bf4',
      q: '',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: 1,
      per_page: 40,
    },
  };

  async getResponse() {
    return await axios.get(this.BASE_URL, this.config);
  }

  get query() {
    return this.config.params.q;
  }
  set query(newQuery) {
    this.config.params.q = newQuery;
  }

  get page() {
    return this.config.params.page;
  }
  set page(newPage) {
    this.config.params.page = newPage;
  }
}
