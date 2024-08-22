const searchInput = document.getElementById('search');
const suggestionsList = document.getElementById('suggestions');
const coinDetailsDiv = document.getElementById('coin-details');
const slider = document.getElementById('slider');

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const DEBOUNCE_DELAY = 300;

let debounceTimer;

const fetchCoinList = async () => {
    try {
        const response = await fetch(`${COINGECKO_API_URL}/coins/list`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching coin list:', error);
    }
};

const fetchCoinDetails = async (id) => {
    try {
        const response = await fetch(`${COINGECKO_API_URL}/coins/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching coin details:', error);
    }
};

const debounce = (func, delay) => {
    return (...args) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func(...args), delay);
    };
};

const handleSearch = async () => {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
        suggestionsList.innerHTML = '';
        slider.classList.remove('visible'); // Hide slider when search field is empty
        return;
    }

    const coinList = await fetchCoinList();
    const filteredCoins = coinList.filter(coin => 
        coin.name.toLowerCase().includes(query) || 
        coin.symbol.toLowerCase().includes(query)
    );

    suggestionsList.innerHTML = '';
    filteredCoins.forEach(coin => {
        const li = document.createElement('li');
        li.textContent = `${coin.name} (${coin.symbol})`;
        li.dataset.id = coin.id;
        li.addEventListener('click', () => showCoinDetails(coin.id));
        suggestionsList.appendChild(li);
    });
};

const showCoinDetails = async (id) => {
    const coinDetails = await fetchCoinDetails(id);

    if (coinDetails) {
        const name = coinDetails.name || 'N/A';
        const symbol = coinDetails.symbol || 'N/A';
        const hashingAlgorithm = coinDetails.hashing_algorithm || 'N/A';
        const description = coinDetails.description.en || 'N/A';
        const marketCapEur = coinDetails.market_data?.market_cap?.eur || 'N/A';
        const homepage = coinDetails.links.homepage[0] || 'N/A';
        const genesisDate = coinDetails.genesis_date || 'N/A';

        coinDetailsDiv.innerHTML = `
            <h2>${name}</h2>
            <p><strong>Symbol:</strong> ${symbol}</p>
            <p><strong>Hashing Algorithm:</strong> ${hashingAlgorithm}</p>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Market Cap in Euro:</strong> €${marketCapEur.toLocaleString()}</p>
            <p><strong>Homepage:</strong> <a href="${homepage}" target="_blank">${homepage}</a></p>
            <p><strong>Genesis Date:</strong> ${genesisDate}</p>
        `;

        slider.classList.add('visible'); // Show the slider when a coin is selected
    }
};

searchInput.addEventListener('input', debounce(handleSearch, DEBOUNCE_DELAY));
