import axios from "axios";
import { AxiosInstance } from "axios";
import { getCookie } from "cookies-next";

export const backEndURLWithAuth: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  headers: {
    Authorization: `Bearer ${getCookie("accessToken")}`,
    Accept: "application/json",
  },
  withCredentials: true,
});

export const backEndURLWithoutAuth = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
});

export const postApiWithoutAuth = async (url: string, body: object) => {
  try {
    const result = await backEndURLWithoutAuth.post(url, body);
    return result.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const postApiWithAuth = async (url: string, body: any) => {
  backEndURLWithAuth.interceptors.request.use((config: any) => {
    return config;
  });
  try {
    const result = await backEndURLWithAuth.post(url, body, {
      headers: {
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
    return result.data;
  } catch (error: any) {
    return error.response.data;
  }
};
export const postApiWithAuthStream = async (url: string, body: any) => {
  backEndURLWithAuth.interceptors.request.use((config: any) => {
    return config;
  });
  try {
    const result = await backEndURLWithAuth.post(url, body, {
      headers: {
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
      responseType: "stream",
    });
    return result.data;
  } catch (error: any) {
    return error.response.data;
  }
};

// GET request without authentication
export const getApiWithoutAuth = async (url: string) => {
  try {
    const result = await backEndURLWithoutAuth.get(url);
    return result.data;
  } catch (error: any) {
    return error.response.data;
  }
};

// GET request with authentication
export const getApiWithAuth = async (url: string) => {
  backEndURLWithAuth.interceptors.request.use((config: any) => {
    return config;
  });
  try {
    const result = await backEndURLWithAuth.get(url, {
      headers: {
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
    return result;
  } catch (error: any) {
    return error.response;
  }
};

// DELETE request without authentication
export const deleteApiWithoutAuth = async (url: string) => {
  try {
    const result = await backEndURLWithoutAuth.delete(url);
    return result;
  } catch (error: any) {
    return error.response.data;
  }
};

// DELETE request with authentication
export const deleteApiWithAuth = async (url: string) => {
  backEndURLWithAuth.interceptors.request.use((config: any) => {
    return config;
  });
  try {
    const result = await backEndURLWithAuth.delete(url, {
      headers: {
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
    return result.data;
  } catch (error: any) {
    return error.response.data;
  }
};
// PATCH request without authentication
export const patchApiWithoutAuth = async (url: string, body: object) => {
  try {
    const result = await backEndURLWithoutAuth.patch(url, body);
    return result.data;
  } catch (error: any) {
    return error.response.data;
  }
};

// PATCH request with authentication
export const patchApiWithAuth = async (url: string, body: any) => {
  backEndURLWithAuth.interceptors.request.use((config: any) => {
    return config;
  });
  try {
    const result = await backEndURLWithAuth.patch(url, body, {
      headers: {
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
    return result.data;
  } catch (error: any) {
    return error.response.data;
  }
};
// PUT request without authentication
export const putApiWithoutAuth = async (url: string, body: object) => {
  try {
    const result = await backEndURLWithoutAuth.put(url, body);
    return result;
  } catch (error: any) {
    return error.response.data;
  }
};

// PUT request with authentication
export const putApiWithAuth = async (url: string, body: any) => {
  backEndURLWithAuth.interceptors.request.use((config: any) => {
    return config;
  });
  try {
    const result = await backEndURLWithAuth.put(url, body, {
      headers: {
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
    return result.data;
  } catch (error: any) {
    return error.response.data;
  }
};
