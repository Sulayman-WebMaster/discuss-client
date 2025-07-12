import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { AuthContext } from '../Provider/AuthProvider';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const { loginUser, googleSignup, githubSignup } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const baseUrl = import.meta.env.VITE_BASE_URI;

  const fetchToken = async (email) => {
    try {
      await axios.get(`${baseUrl}api/jwt/${email}`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error(error);
      toast.error('Token fetch failed');
      throw error;
    }
  };

  

  const handleLoginSuccess = async (user) => {
    try {
      
      await fetchToken(user.email);
      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
      toast.error('Login process failed. Please try again.');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { email, password } = data;
      const result = await loginUser(email, password);
      await handleLoginSuccess(result.user);
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleProviderLogin = async (providerFunc) => {
    setLoading(true);
    try {
      const result = await providerFunc();
      await handleLoginSuccess(result.user);
    } catch (err) {
      toast.error(err.message || 'Provider login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login to Discuss</h2>

        <div className="mb-4">
          <input
            placeholder="Email"
            {...register('email', { required: true })}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black transition"
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">Email is required</p>}
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            {...register('password', {
              required: true,
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            })}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black transition"
          />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-black text-white py-3 rounded-md font-semibold transition ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-900'}`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="flex justify-between items-center mt-5 text-sm text-gray-600">
          <span>Don't have an account?</span>
          <Link to="/signup" className="text-black font-semibold hover:underline">
            Sign up
          </Link>
        </div>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-2 text-sm text-gray-500">or login with</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => handleProviderLogin(googleSignup)}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition disabled:opacity-60"
          >
            <FaGoogle className="text-red-500" /> Google
          </button>
          <button
            type="button"
            onClick={() => handleProviderLogin(githubSignup)}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition disabled:opacity-60"
          >
            <FaGithub /> GitHub
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
