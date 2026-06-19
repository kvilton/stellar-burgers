import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { IngredientDetailsUI } from '../ui/ingredient-details';
import { Preloader } from '../ui/preloader';
import { useSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  const { id } = useParams();

  const ingredientData = useSelector((state) =>
    state.ingredients.ingredients.find((ingredient) => ingredient._id === id)
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
