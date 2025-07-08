import { useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const useSecureAxios = () => {
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_BASE_URI ,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
     instance.interceptors.response.use(
      (response) => response,
      (error) => {
       
        if (error.response?.status === 401) {
          toast.error('Unauthorized. Please log in again.');
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, []);

  return axiosInstance;
};

export default useSecureAxios;
