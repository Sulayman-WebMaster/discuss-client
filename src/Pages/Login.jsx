import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { AuthContext } from '../Provider/AuthProvider';
import { useMutation } from '@tanstack/react-query';
import { FaGithub, FaGoogle } from 'react-icons/fa';

const Login = () => {
    const navigate = useNavigate();
  const { loginUser, googleSignup, githubSignup } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const tokenMutation = useMutation({
    mutationFn: async (email) => {
      const res = await fetch(`${import.meta.env.VITE_BASE_URI}api/jwt/${email}`, {
        method: 'GET',
        credentials: 'include' 
      });
      const data = await res.json();
      return data.token;
    },
    onSuccess: () => {
      toast.success('Login successful!');
        navigate('/'); 
    },
    onError: () => toast.error('Token fetch failed'),
  });

  const onSubmit = async (data) => {
    try {
      const { email, password } = data;
      const result = await loginUser(email, password);
      tokenMutation.mutate(result.user.email);
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  const handleProviderLogin = async (providerFunc) => {
    try {
      const result = await providerFunc();
      tokenMutation.mutate(result.user.email);
    } catch (err) {
      toast.error(err.message || 'Provider login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

        <input
          placeholder="Email"
          {...register('email', { required: true })}
          className="w-full mb-3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && <p className="text-sm text-red-500 mb-2">Email is required</p>}

        <input
          type="password"
          placeholder="Password"
          {...register('password', { required: true })}
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && <p className="text-sm text-red-500 mb-2">Password is required</p>}

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
        >
          Login
        </button>

        <div className="flex justify-center space-x-4 mt-5">
          <button
            type="button"
            onClick={() => handleProviderLogin(googleSignup)}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 transition"
          >
            <FaGoogle className="text-red-500" /> Google
          </button>
          <button
            type="button"
            onClick={() => handleProviderLogin(githubSignup)}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 transition"
          >
            <FaGithub /> GitHub
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
