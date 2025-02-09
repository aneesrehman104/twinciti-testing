import axios from 'axios';
import { AxiosInstance } from 'axios';
import { getCookie } from 'cookies-next';

export const backEndURLWithAuth = axios.create({
    baseURL: `https://api-stag.twinciti.com/api/twin_citi`,
    headers: {
        Authorization: `Bearer ${getCookie('accessToken')}`,
        Accept: 'application/json',
    },
    withCredentials: true,
});

export const backEndURLWithoutAuth = axios.create({
    baseURL: 'https://api-stag.twinciti.com/api/twin_citi',
    headers: { Accept: 'application/json' },
    withCredentials: true,
});

export const postApiWithoutAuth = async (url, body) => {
    try {
        const result = await backEndURLWithoutAuth.post(url, body);
        return result.data;
    } catch (error) {
        return error.response.data;
    }
};

export const postApiWithAuth = async (url, body) => {
    backEndURLWithAuth.interceptors.request.use((config) => {
        return config;
    });
    try {
        const result = await backEndURLWithAuth.post(url, body, {
            headers: {
                Authorization: `Bearer ${getCookie('accessToken')}`,
            },
        });
        return result.data;
    } catch (error) {
        return error.response.data;
    }
};
export const postApiWithAuthStream = async (url, body) => {
    backEndURLWithAuth.interceptors.request.use((config) => {
        return config;
    });
    try {
        const result = await backEndURLWithAuth.post(url, body, {
            headers: {
                Authorization: `Bearer ${getCookie('accessToken')}`,
            },
            responseType: 'stream',
        });
        return result.data;
    } catch (error) {
        return error.response.data;
    }
};

// GET request without authentication
export const getApiWithoutAuth = async (url) => {
    try {
        const result = await backEndURLWithoutAuth.get(url);
        return result.data;
    } catch (error) {
        return error.response.data;
    }
};

// GET request with authentication
export const getApiWithAuth = async (url) => {
    backEndURLWithAuth.interceptors.request.use((config) => {
        return config;
    });
    try {
        const result = await backEndURLWithAuth.get(url, {
            headers: {
                Authorization: `Bearer ${getCookie('accessToken')}`,
            },
        });
        return result;
    } catch (error) {
        return error.response;
    }
};

// DELETE request without authentication
export const deleteApiWithoutAuth = async (url) => {
    try {
        const result = await backEndURLWithoutAuth.delete(url);
        return result;
    } catch (error) {
        return error.response.data;
    }
};

// DELETE request with authentication
export const deleteApiWithAuth = async (url) => {
    backEndURLWithAuth.interceptors.request.use((config) => {
        return config;
    });
    try {
        const result = await backEndURLWithAuth.delete(url, {
            headers: {
                Authorization: `Bearer ${getCookie('accessToken')}`,
            },
        });
        return result.data;
    } catch (error) {
        return error.response.data;
    }
};
// PATCH request without authentication
export const patchApiWithoutAuth = async (url, body) => {
    console.log('boadyyy====>', body);
    try {
        const result = await backEndURLWithoutAuth.patch(url, body);
        return result.data;
    } catch (error) {
        return error.response.data;
    }
};

// PATCH request with authentication
export const patchApiWithAuth = async (url, body) => {
    backEndURLWithAuth.interceptors.request.use((config) => {
        return config;
    });
    try {
        const result = await backEndURLWithAuth.patch(url, body, {
            headers: {
                Authorization: `Bearer ${getCookie('accessToken')}`,
            },
        });
        return result.data;
    } catch (error) {
        return error.response.data;
    }
};
// PUT request without authentication
export const putApiWithoutAuth = async (url, body) => {
    try {
        const result = await backEndURLWithoutAuth.put(url, body);
        return result;
    } catch (error) {
        return error.response.data;
    }
};

// PUT request with authentication
export const putApiWithAuth = async (url, body) => {
    backEndURLWithAuth.interceptors.request.use((config) => {
        return config;
    });
    try {
        const result = await backEndURLWithAuth.put(url, body, {
            headers: {
                Authorization: `Bearer ${getCookie('accessToken')}`,
            },
        });
        return result.data;
    } catch (error) {
        return error.response.data;
    }
};

export const postStreamApiWithAuth = async (url, body, options) => {
    try {
        const result = await fetch(url, {
            method: 'post',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie('accessToken')}`,
            },
            body: JSON.stringify(body),
            ...options,
        });
        return result;
    } catch (error) {
        return error?.response?.data || {};
    }
};

export const getStreamApiWithAuth = async (url, options) => {
    try {
        const result = await fetch(url, {
            method: 'get',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie('accessToken')}`,
            },
            ...options,
        });
        return result;
    } catch (error) {
        return error?.response?.data || {};
    }
};
