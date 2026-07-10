'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, ShieldCheck, CreditCard } from 'lucide-react';
import { IShippingAddress } from '../../types/order';
import toast from 'react-hot-toast';

interface CheckoutFormProps {
  onSubmit: (address: IShippingAddress) => void;
  isLoading: boolean;
}

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
}

function Field({
  label, name, value, onChange, error, hint,
  placeholder, type = 'text', disabled, required, maxLength,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-xs font-semibold text-stone-400 flex items-center gap-1">
        {label}
        {required && <span className="text-red-400 text-[11px]">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={[
          'h-10 w-full rounded-lg border px-3 text-sm outline-none transition-all duration-150',
          'bg-stone-950 text-stone-100 placeholder:text-stone-600',
          'focus:ring-2 focus:ring-amber-500/20',
          error
            ? 'border-red-500/50 focus:border-red-500'
            : 'border-stone-700 hover:border-stone-600 focus:border-amber-500/60',
          disabled ? 'opacity-40 cursor-not-allowed' : '',
        ].join(' ')}
      />
      {hint && !error && (
        <p className="text-[11px] text-stone-500 mt-0.5">{hint}</p>
      )}
      {error && (
        <p className="text-[11px] text-red-400 mt-0.5 flex items-center gap-1">
          <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 4.5a.5.5 0 01.5.5v2a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm0-2a.625.625 0 110 1.25A.625.625 0 016 3.5z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

export default function CheckoutForm({ onSubmit, isLoading }: CheckoutFormProps) {
  const [formData, setFormData] = useState<IShippingAddress>({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const [errors, setErrors] = useState<Partial<IShippingAddress>>({});
  const [saveAddress, setSaveAddress] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Pre-fill user profile details if available
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch('/api/users/profile');
        const data = await res.json();
        if (data.success && data.user) {
          const u = data.user;
          setFormData({
            name: u.name || '',
            phone: u.phone || '',
            street: u.address?.street || '',
            city: u.address?.city || '',
            state: u.address?.state || '',
            pincode: u.address?.pincode || '',
            country: u.address?.country || 'India',
          });
        }
      } catch (err) {
        console.error('Failed to load profile details:', err);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof IShippingAddress]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<IShippingAddress> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phone)) newErrors.phone = 'Enter a valid 10-digit mobile number';
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Enter a valid 6-digit pincode';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (saveAddress) {
      setIsSaving(true);
      try {
        const res = await fetch('/api/users/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: formData.phone,
            address: {
              street: formData.street,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,
              country: formData.country,
            },
          }),
        });
        const data = await res.json();
        if (data.success) {
          toast.success('Address saved for future orders!');
        } else {
          toast.error('Failed to save address for future orders');
        }
      } catch (err) {
        console.error('Error saving profile:', err);
        toast.error('Error saving address');
      } finally {
        setIsSaving(false);
      }
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Contact details */}
      <div>
        <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-3 pb-2 border-b border-stone-800">
          Contact details
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Full name" name="name" value={formData.name}
            onChange={handleChange} error={errors.name}
            placeholder="Rahul Sharma" required
          />
          <Field
            label="Phone number" name="phone" type="tel" value={formData.phone}
            onChange={handleChange} error={errors.phone}
            placeholder="10-digit mobile" required maxLength={10}
          />
        </div>
      </div>

      {/* Delivery address */}
      <div>
        <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-3 pb-2 border-b border-stone-800">
          Delivery address
        </p>
        <div className="space-y-3">
          <Field
            label="Street address" name="street" value={formData.street}
            onChange={handleChange} error={errors.street}
            placeholder="House / flat no., street, locality" required
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="City" name="city" value={formData.city}
              onChange={handleChange} error={errors.city}
              placeholder="Mumbai" required
            />
            <Field
              label="State" name="state" value={formData.state}
              onChange={handleChange} error={errors.state}
              placeholder="Maharashtra" required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Pincode" name="pincode" value={formData.pincode}
              onChange={handleChange} error={errors.pincode}
              placeholder="400001" hint="6-digit postal code"
              required maxLength={6}
            />
            <Field
              label="Country" name="country" value={formData.country}
              onChange={handleChange} disabled
            />
          </div>
        </div>
      </div>

      {/* Checkbox for saving address */}
      <div className="flex items-center gap-2 py-1">
        <input
          id="saveAddress"
          name="saveAddress"
          type="checkbox"
          checked={saveAddress}
          onChange={(e) => setSaveAddress(e.target.checked)}
          className="h-4 w-4 bg-stone-950 border border-stone-800 rounded focus:ring-amber-500 text-amber-500 cursor-pointer"
        />
        <label htmlFor="saveAddress" className="text-xs text-stone-400 font-semibold cursor-pointer select-none">
          Save this address for future orders
        </label>
      </div>

      {/* Submit */}
      <div className="space-y-3 pt-1">
        <button
          type="submit"
          disabled={isLoading || isSaving}
          className="w-full h-11 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-900 text-sm font-semibold rounded-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
        >
          {isLoading || isSaving ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              {isSaving ? 'Saving Address…' : 'Processing…'}
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Continue to payment
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5" />
          Your information is encrypted and secure
        </div>
      </div>

    </form>
  );
}