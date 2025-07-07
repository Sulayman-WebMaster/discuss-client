import { useContext, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from '../Provider/AuthProvider';


const useSecureAxios = () => {
  const { user } = useContext(AuthContext);

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: 'https://assignment-psi-flax.vercel.app/',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    instance.interceptors.request.use(
      async (config) => {
        if (user) {
        
          const token = await user.getIdToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );

    return instance;
  }, [user]);

  return axiosInstance;
};

export default useSecureAxios ;
