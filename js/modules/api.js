export const fetchRequest = async (url, options = {}) => {
    try {
        const { 
            method = 'GET', 
            body, 
            headers 
        } = options;

        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        if (body) config.body = JSON.stringify(body);

        const response = await fetch(url, config);
        
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};