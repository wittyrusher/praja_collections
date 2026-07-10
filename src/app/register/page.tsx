'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight, MapPin, User as UserIcon } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateStep1 = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number (must be 10 digits)';
      isValid = false;
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const validateStep2 = () => {
    const newErrors = {
      street: '',
      city: '',
      state: '',
      pincode: '',
    };
    let isValid = true;

    if (!formData.street.trim()) {
      newErrors.street = 'Street address is required';
      isValid = false;
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
      isValid = false;
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
      isValid = false;
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
      isValid = false;
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
      isValid = false;
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setStep(1);
  };

  const submitRegistration = async (includeAddress: boolean) => {
    setIsLoading(true);

    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      };

      if (includeAddress) {
        payload.address = {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
        };
      }

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Registration failed');
      }

      toast.success('Registration successful! Logging you in...');

      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        toast.error('Please login manually');
        router.push('/login');
      } else {
        const searchParams = new URLSearchParams(window.location.search);
        const redirectUrl = searchParams.get('redirect') || '/';
        router.push(redirectUrl);
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterWithAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2()) return;
    await submitRegistration(true);
  };

  const handleSkipRegister = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!validateStep1()) return;
    await submitRegistration(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-slate-600 p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-900">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-500 text-blue-700 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 1 ? 'bg-amber-500 text-stone-900' : 'bg-green-600 text-white'
              }`}
            >
              1
            </span>
            <span className={`text-xs font-semibold ${step === 1 ? 'text-white' : 'text-gray-300'}`}>
              Account
            </span>
          </div>
          <div className="w-10 h-0.5 bg-gray-400" />
          <div className="flex items-center gap-1.5">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 2 ? 'bg-amber-500 text-stone-900' : 'bg-gray-400 text-gray-700'
              }`}
            >
              2
            </span>
            <span className={`text-xs font-semibold ${step === 2 ? 'text-white' : 'text-gray-400'}`}>
              Address
            </span>
          </div>
        </div>

        <form className="mt-6 space-y-6" onSubmit={(e) => e.preventDefault()}>
          {step === 1 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-stone-900 font-semibold mb-2">
                <UserIcon className="w-4 h-4 text-amber-400" />
                <span>Step 1: Account details</span>
              </div>

              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="John Doe"
                required
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="you@example.com"
                required
              />

              <Input
                label="Phone Number (Optional)"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                placeholder="9876543210"
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="••••••••"
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                placeholder="••••••••"
                required
              />

              <div className="flex items-center pt-2">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                  I agree to the{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500 underline">
                    Terms and Conditions
                  </a>
                </label>
              </div>

              <Button
                onClick={handleNextStep}
                className="w-full bg-red-800 hover:bg-red-700 text-white mt-4 flex items-center justify-center gap-1.5"
              >
                Continue to Address <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-stone-900 font-semibold mb-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Step 2: Shipping Address (Optional)</span>
              </div>

              <Input
                label="Street Address"
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                error={errors.street}
                placeholder="House / Flat no., Street, Locality"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={errors.city}
                  placeholder="Mumbai"
                  required
                />
                <Input
                  label="State"
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  error={errors.state}
                  placeholder="Maharashtra"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Pincode"
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  error={errors.pincode}
                  placeholder="400001"
                  required
                  maxLength={6}
                />
                <Input
                  label="Country"
                  type="text"
                  name="country"
                  value={formData.country}
                  disabled
                />
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t border-slate-500/40">
                <button
                  type="button"
                  onClick={handleRegisterWithAddress}
                  disabled={isLoading}
                  className="w-full py-2.5 bg-red-800 hover:bg-red-700 text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  {isLoading ? 'Creating Account...' : 'Register with Address'}
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={isLoading}
                    className="flex-1 py-2 border border-gray-300 text-stone-900 font-semibold rounded-lg text-sm flex items-center justify-center gap-1 hover:bg-slate-500/20 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSkipRegister}
                    disabled={isLoading}
                    className="flex-1 py-2 bg-transparent border border-amber-500 text-amber-500 font-semibold rounded-lg text-sm hover:bg-amber-500 hover:text-stone-950 transition-all"
                  >
                    Skip & Create
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}