import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        console.log('Google Token Response:', tokenResponse);
        const res = await fetch(`${API_BASE_URL}/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: tokenResponse.credential || tokenResponse.access_token, // Handle both implicit and authorization code flows if needed, but useGoogleLogin usually gives access_token
          }),
        });

        const data = await res.json();
        console.log('Backend Response:', data);

        if (res.ok) {
          login(data.user, data.token);
          navigate('/');
        } else {
          console.error('Backend Error:', data);
          setErrors({ form: data.message || 'Google signup failed. See console for details.' });
        }
      } catch (err) {
        console.error('Network/Client Error:', err);
        setErrors({ form: 'Network error during Google signup. Is the backend running?' });
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error('Google Login Failed:', errorResponse);
      setErrors({ form: 'Google Login Failed. Check console.' });
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        login(data.user, data.token);
        navigate('/');
      } else {
        setErrors({ form: data.message || 'Signup failed' });
      }
    } catch (err) {
      setErrors({ form: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-heading font-bold text-forestGreen mb-2">
          Create Your Account
        </h1>
        <p className="text-charcoal/70 font-body">
          Join ARRIVIO and start your journey to finding home in Germany
        </p>
      </div>

      <div className="bg-white rounded-lg border border-warmSand/50 p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            type="text"
            name="fullName"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />

          <Button type="submit" variant="primary" className="w-full">
            Create Account
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-warmSand"></div>
          <span className="px-4 text-sm text-earthBrown font-body">Or</span>
          <div className="flex-1 border-t border-warmSand"></div>
        </div>

        {/* Social Auth Button */}
        <Button
          variant="secondary"
          className="w-full"
          type="button"
          onClick={() => googleLogin()}
          disabled={isLoading}
        >
          {isLoading ? 'Connecting...' : 'Sign up with Google'}
        </Button>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-charcoal/70 text-sm font-body">
            Already have an account?{' '}
            <Link to="/login" className="text-forestGreen hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
