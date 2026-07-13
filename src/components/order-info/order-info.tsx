import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { TIngredient } from '@utils-types';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/orderSlice';

type TIngredientsWithCount = {
  [key: string]: TIngredient & { count: number };
};

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();

  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const orderData = useSelector((state) => state.order.currentOrder);

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) {
      return null;
    }

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, ingredientId: string) => {
        if (!acc[ingredientId]) {
          const ingredient = ingredients.find(
            (currentIngredient) => currentIngredient._id === ingredientId
          );

          if (ingredient) {
            acc[ingredientId] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[ingredientId].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (sum, ingredient) => sum + ingredient.price * ingredient.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
