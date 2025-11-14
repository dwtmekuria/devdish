import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/slices/authSlice';
import AuthForm from './AuthForm';

const Login = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const handleLogin = (credentials) => {
    dispatch(loginUser(credentials));
  };

  return (
    <div>
      <AuthForm 
        isLogin={true} 
        onSubmit={handleLogin}
        loading={isLoading}
      />
      
      <div className="text-center mt-4">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-500 hover:text-primary-600 font-medium">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;