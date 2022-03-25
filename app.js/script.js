const API_KEY = 'd96c320e2d464160bfee15cf0ad53918';
const choicesElem = document.querySelector('.js-choice');
const newsList = document.querySelector('.news-list');
const formSearch = document.querySelector('.form-search');
const choices = new Choices(choicesElem, {
    searchEnabled: false,
    itemSelectText: '',
});

const getdata = async (url) => {
    const response = await fetch(url, {
        headers: {
            'X-Api-Key': API_KEY,
        }
    } )
    const data = await response.json();

    return data
};
const renderCard = (data) => {
    newsList.textContent = '';
    data.forEach(news => {
        const card = document.createElement('li');
        card.className = 'news-items';

        card.innerHTML = `
            <img src="${news.urlToImage}" alt="${news.title}" class="news-img" width="270" height="200">

            <h3 class="news-title">
                <a href="${news.url}" class="news-link" target="_blank">${news.title}</a>
            </h3>
            <p class="description-news">${news.description}</p>

            <div class="news-footer">
                <time class="news-datetime" datetime="${news.publishedAt}">
                    <span class="news-date">${news.publishedAt}</span> 11:06
                </time>
                <div class="news-autor">${news.author}</div>
            </div>
        `;

        newsList.append(card);
    })
}

const loadNews = async() => {
    newsList.innerHTML = '<li class="preload"></li>'
    const country = localStorage.getItem('country') || 'ru';
    choices.setChoicesByValue(country)

    const data = await getdata(`https://newsapi.org/v2/top-headlines?country=${country}`);
    renderCard(data.articles);
};

choicesElem.addEventListener('change', (event) => {
    const value = event.detail.value;
    localStorage.setItem('country', value);
    loadNews();
});

formSearch.addEventListener('submit', event => {
    event.preventDefault();
})

loadNews()