import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/slices/authSlice';
import AuthForm from './AuthForm';

const Register = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const handleRegister = (userData) => {
    dispatch(registerUser(userData));
  };

  return (
    <div>
      <AuthForm 
        isLogin={false} 
        onSubmit={handleRegister}
        loading={isLoading}
      />
      
      <div className="text-center mt-4">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;