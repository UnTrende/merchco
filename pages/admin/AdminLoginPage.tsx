import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../hooks/useAuth';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    try {
        await adminLogin(email, password);
        navigate('/admin/dashboard');
    } catch (err) {
        setError('Failed to login. Please check credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
            <Link to="/" className="text-3xl font-bold font-poppins text-text-primary">
              MerchCo
            </Link>
            <h2 className="mt-2 text-xl text-text-secondary">Admin Panel</h2>
        </div>
        <Card padding="lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-primary">Admin Login</h1>
            <p className="mt-2 text-text-secondary">
              Please enter your credentials to proceed.
            </p>
          </div>
          
          <form className="mt-8 space-y-4" onSubmit={handleLogin}>
            <Input id="email" name="email" type="email" required placeholder="admin@example.com" label="Email Address" />
            <Input id="password" name="password" type="password" required placeholder="••••••••" label="Password" />
            
            {error && <p className="text-sm text-error text-center">{error}</p>}
            
            <div>
              <Button type="submit" className="w-full mt-2" size="lg">
                Login
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminLoginPage;
