import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth,
  children
}) => {
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && isAuthenticated) {
    const from = location.state?.from || {
      pathname: '/'
    };

    return <Navigate replace to={from} />;
  }

  return children;
};
