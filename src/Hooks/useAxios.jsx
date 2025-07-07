import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `https://assignment-psi-flax.vercel.app/`
})

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;