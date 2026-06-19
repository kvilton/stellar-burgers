import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { TIngredient } from '@utils-types';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { useSelector } from '../../services/store';
import { getOrderByNumberApi } from '../../utils/burger-api';

type TIngredientsWithCount = {
  [key: string]: TIngredient & { count: number };
};

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const ingredients = useSelector((state) => state.ingredients.ingredients);

  const [orderData, setOrderData] = useState<unknown>(null);

  useEffect(() => {
    if (number) {
      getOrderByNumberApi(Number(number)).then((data) => {
        setOrderData(data.orders[0]);
      });
    }
  }, [number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) {
      return null;
    }

    const date = new Date((orderData as any).createdAt);

    const ingredientsInfo = (orderData as any).ingredients.reduce(
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

    const total = (
      Object.values(ingredientsInfo) as Array<TIngredient & { count: number }>
    ).reduce(
      (sum, ingredient) => sum + ingredient.price * ingredient.count,
      0
    );

    return {
      ...(orderData as any),
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
