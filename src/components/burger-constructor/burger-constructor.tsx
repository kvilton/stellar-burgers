import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import { TConstructorIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { clearConstructor } from '../../services/slices/constructorSlice';
import {
  createOrder,
  clearOrderModalData
} from '../../services/slices/orderSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);
  const { orderRequest, orderModalData } = useSelector((state) => state.order);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const constructorItems = {
    bun,
    ingredients
  };

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModalData());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (sum: number, ingredient: TConstructorIngredient) =>
          sum + ingredient.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
