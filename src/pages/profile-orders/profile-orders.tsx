import { FC, useEffect } from 'react';

import { ProfileOrdersUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { fetchProfileOrders } from '../../services/slices/profileOrdersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.profileOrders.orders);

  useEffect(() => {
    dispatch(fetchProfileOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
