const API_KEY = 'd96c320e2d464160bfee15cf0ad53918';
const choicesElem = document.querySelector('.js-choice');
const newsList = document.querySelector('.news-list');
const formSearch = document.querySelector('.form-search');
const title = document.querySelector('.title');

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

const getDateCorrectFormat = isoDate => {
    const date = new Date(isoDate);
    const fullDate = date.toLocaleString('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });

    const fullTime = date.toLocaleString('en-GB', {
        hour: 'numeric',
        minute: 'numeric',
    })

    return `<span class="news-date">${fullDate}</span> ${fullTime}`
}

const renderCard = (data) => {
    newsList.textContent = '';
    data.forEach(({urlToImage, title, url, description, publishedAt, author }) => {
        const card = document.createElement('li');
        card.className = 'news-items';

        card.innerHTML = `
            <img src="${urlToImage}" alt="${title}" class="news-img" width="270" height="200">

            <h3 class="news-title">
                <a href="${url}" class="news-link" target="_blank">${title || ''}</a>
            </h3>
            <p class="description-news">${description || ''}</p>

            <div class="news-footer">
                <time class="news-datetime" datetime="${publishedAt}">
                    ${getDateCorrectFormat(publishedAt)}
                </time>
                <div class="news-autor">${author || ''}</div>
            </div>
        `;

        newsList.append(card);
    })
}

async function loadNews() {
    newsList.innerHTML = '<li class="preload"></li>';
    const country = localStorage.getItem('country') || 'ru';
    choices.setChoiceByValue(country);
    title.classList.add('hide');

    const data = await getdata(`https://newsapi.org/v2/top-headlines?country=${country}`);
    renderCard(data.articles);
}
const loadSearch = async (value) => {
    
    const data = await getdata(`https://newsapi.org/v2/everything?q=${value}`);
    title.classList.remove('hide');
    title.textContent = `По вашему запросу “${value}” найдено ${data.articles.length} результатов`
    choices.setChoiceByValue('');
    renderCard(data.articles);
};

choicesElem.addEventListener('change', (event) => {
    const value = event.detail.value;
    localStorage.setItem('country', value);
    loadNews();
});

formSearch.addEventListener('submit', event => {
    event.preventDefault();
    loadSearch(formSearch.search.value);
    formSearch.reset();
});

loadNews()