'use client';

import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { IShippingAddress } from '../../types/order';

interface CheckoutFormProps {
  onSubmit: (address: IShippingAddress) => void;
  isLoading: boolean;
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
    else if (!/^[6-9]\d{9}$/.test(formData.phone))
      newErrors.phone = 'Invalid phone number';
    if (!formData.street.trim()) newErrors.street = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode))
      newErrors.pincode = 'Invalid pincode';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Shipping Address</h2>

      <Input
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <Input
        label="Phone Number"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
        placeholder="10-digit mobile number"
        required
      />

      <Input
        label="Street Address"
        name="street"
        value={formData.street}
        onChange={handleChange}
        error={errors.street}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          error={errors.city}
          required
        />

        <Input
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange}
          error={errors.state}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Pincode"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          error={errors.pincode}
          placeholder="6-digit pincode"
          required
        />

        <Input
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          disabled
        />
      </div>

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Continue to Payment
      </Button>
    </form>
  );
}