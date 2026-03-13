import fetch from 'node-fetch';

const testFetch = async () => {
    try {
        const res = await fetch('http://127.0.0.1:5001/api/categories');
        const data = await res.json();
        console.log('API Response:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Fetch failed:', err.message);
    }
};

testFetch();
