import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../Provider/AuthProvider';
import { FaGithub, FaGoogle, FaUpload } from 'react-icons/fa';
import { useNavigate } from 'react-router';

const imgbbApiKey = '7648b5e8c439a674a01fa42348137dbe';

const Register = () => {
  const navigate = useNavigate();
  const { createUser, updateUser, googleSignup, githubSignup } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [uploading, setUploading] = useState(false);

  const fetchToken = async (email) => {
    try {
      await axios.get(`${import.meta.env.VITE_BASE_URI}api/jwt/${email}`, {
        withCredentials: true,
      });
    } catch (error) {
      toast.error("JWT token fetch failed");
    }
  };

  const saveUserToDB = async ({ email, name, image }) => {
    try {
      const res= await axios.post(`${import.meta.env.VITE_BASE_URI}api/user`, {
        email,
        name,
        image,
      }, { withCredentials: true });
      
    } catch (err) {
      console.error('User save error:', err);
      toast.error('Failed to save user to DB');
    }
  };

  const onSubmit = async (data) => {
    const { name, email, password, image } = data;

    try {
      const imageFile = image[0];
      setUploading(true);

      const formData = new FormData();
      formData.append('image', imageFile);

      const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: 'POST',
        body: formData,
      });

      const imgbbData = await imgbbRes.json();
      if (!imgbbData.success) throw new Error('Image upload failed');

      const imageUrl = imgbbData.data.url;

      await createUser(email, password);
      await updateUser({ displayName: name, photoURL: imageUrl });

      await saveUserToDB({ email, name, image: imageUrl });
      await fetchToken(email);

      toast.success('Registration successful!');
      reset();
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Signup failed');
    } finally {
      setUploading(false);
    }
  };

  const handleProviderLogin = async (providerFunc) => {
    try {
      const result = await providerFunc();
      const { displayName, email, photoURL } = result.user;

      await saveUserToDB({ name: displayName, email, image: photoURL });
      await fetchToken(email);

      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Provider login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl p-10 shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Account</h2>

        <input
          placeholder="Name"
          {...register("name", { required: true })}
          className="w-full mb-3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && <p className="text-sm text-red-500 mb-2">Name is required</p>}

        <input
          placeholder="Email"
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          className="w-full mb-3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && <p className="text-sm text-red-500 mb-2">Valid email is required</p>}

        <input
          type="password"
          placeholder="Password"
          {...register("password", {
            required: true,
            minLength: 6,
            validate: {
              hasUpper: val => /[A-Z]/.test(val) || "At least one uppercase letter",
              hasSpecial: val => /[@$!%*?&#]/.test(val) || "At least one special character"
            }
          })}
          className="w-full mb-3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && <p className="text-sm text-red-500 mb-2">{errors.password.message}</p>}

        {/* File Upload */}
        <label className="w-full mb-3 cursor-pointer flex items-center gap-3 border px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition">
          <FaUpload className="text-gray-600" />
          <span className="text-sm text-gray-700">Upload Profile Picture</span>
          <input
            type="file"
            accept="image/*"
            {...register("image", { required: true })}
            className="hidden"
          />
        </label>
        {errors.image && <p className="text-sm text-red-500 mb-2">Profile image is required</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Sign Up'}
        </button>

        {/* OAuth */}
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

export default Register;
