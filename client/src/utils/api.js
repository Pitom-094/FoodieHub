const getBaseUrl = () => {
    if (import.meta.env.MODE === 'development') {
        return ''; // Proxy handles it in dev
    }
    return import.meta.env.VITE_API_BASE_URL || '';
};

export const API_BASE_URL = getBaseUrl();

export const fetchWithAuth = async (url, options = {}) => {
    const userInfo = localStorage.getItem('userInfo');
    const token = userInfo ? JSON.parse(userInfo).token : null;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    return response;
};
