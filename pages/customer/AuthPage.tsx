import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../../components/Spinner';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/profile';

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setIsLoading(true);

      try {
          if (mode === 'login') {
              await login(email, password);
          } else {
              await signup(name, email, password);
          }
          navigate(from, { replace: true });
      } catch (err) {
          setError('Authentication failed. Please try again.');
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12">
      <div className="w-full max-w-md flex flex-col items-center">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-text-primary">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-text-secondary text-sm">Manage your profile, orders, and designs.</p>
          </div>

          <Card padding="lg" className="w-full">
              <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                      <Input 
                        id="name" 
                        label="Full Name" 
                        placeholder="John Doe" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                      />
                  )}
                  <Input 
                    id="email" 
                    type="email" 
                    label="Email Address" 
                    placeholder="you@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                  <Input 
                    id="password" 
                    type="password" 
                    label="Password" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                  
                  {error && <p className="text-sm text-error text-center">{error}</p>}

                  <Button type="submit" size="lg" className="w-full mt-4" disabled={isLoading}>
                      {isLoading ? <Spinner /> : (mode === 'login' ? 'Sign In' : 'Sign Up')}
                  </Button>
              </form>
          </Card>
          
          <div className="mt-6 text-center">
            <button 
                onClick={() => {
                    setMode(mode === 'login' ? 'signup' : 'login');
                    setError('');
                }}
                className="text-sm text-text-secondary hover:text-accent transition-colors"
            >
                {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </button>
          </div>
      </div>
    </div>
  );
};

export default AuthPage;