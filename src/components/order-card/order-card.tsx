import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { TIngredient } from '@utils-types';
import { OrderCardProps } from './type';
import { OrderCardUI } from '../ui/order-card';
import { useSelector } from '../../services/store';

const MAX_INGREDIENTS = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const ingredients = useSelector((state) => state.ingredients.ingredients);

  const orderInfo = useMemo(() => {
    if (!ingredients.length) {
      return null;
    }

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], ingredientId: string) => {
        const ingredient = ingredients.find(
          (currentIngredient) => currentIngredient._id === ingredientId
        );

        if (ingredient) {
          return [...acc, ingredient];
        }

        return acc;
      },
      []
    );

    const total = ingredientsInfo.reduce(
      (sum, ingredient) => sum + ingredient.price,
      0
    );

    const ingredientsToShow = ingredientsInfo.slice(0, MAX_INGREDIENTS);

    const remains =
      ingredientsInfo.length > MAX_INGREDIENTS
        ? ingredientsInfo.length - MAX_INGREDIENTS
        : 0;

    const date = new Date(order.createdAt);

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  if (!orderInfo) {
    return null;
  }

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={MAX_INGREDIENTS}
      locationState={{ background: location }}
    />
  );
});

OrderCard.displayName = 'OrderCard';
