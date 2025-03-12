import { useState } from 'react';
import { Link } from 'react-router-dom';
import logoWeb from '../assets/LOGO FREAKY AHH.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Color palette from the provided image
  const colors = {
    darkBrown: '#573C27',
    tan: '#A98360',
    cream: '#FDEED9',
    lightPink: '#FFADC6',
    purple: '#E34989'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log('Login attempt with:', { email, password, rememberMe });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: colors.cream }}>
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-8 text-center">
          <div className="flex flex-col items-center justify-center mb-4">
            <img src={logoWeb} alt="Logo" className="h-10 w-10 sm:h-12 sm:w-12 mb-2" />
            <h1 className="text-2xl font-bold" style={{ color: colors.darkBrown }}>
              Kenal.<span style={{ color: colors.purple }}>In</span>
            </h1>
          </div>
          <h2 className="text-xl font-medium" style={{ color: colors.darkBrown }}>Sign in</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: colors.darkBrown }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none"
              style={{ borderColor: colors.tan, backgroundColor: 'white', color: colors.darkBrown }}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: colors.darkBrown }}>
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none"
                style={{ borderColor: colors.tan, backgroundColor: 'white', color: colors.darkBrown }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                style={{ color: colors.tan }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4"
                style={{ accentColor: colors.purple }}
              />
              <label htmlFor="remember-me" className="ml-2 text-sm" style={{ color: colors.darkBrown }}>
                Remember me
              </label>
            </div>
            <a 
              href="#" 
              className="text-sm hover:underline" 
              style={{ color: colors.purple }}
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full p-3 rounded-md text-white font-medium transition-colors mt-4"
            style={{ backgroundColor: colors.purple, hover: { backgroundColor: colors.lightPink } }}
          >
            Sign in
          </button>
        </form>

        <div className="mt-6 text-center" style={{ color: colors.darkBrown }}>
          Don't have an account?{' '}
          <Link to="/register" className="hover:underline" style={{ color: colors.purple }}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;