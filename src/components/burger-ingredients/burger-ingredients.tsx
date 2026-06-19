import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';

export const BurgerIngredients: FC = () => {
  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const { bun, ingredients: constructorIngredients } = useSelector(
    (state) => state.burgerConstructor
  );

  const buns = ingredients.filter((item) => item.type === 'bun');
  const mains = ingredients.filter((item) => item.type === 'main');
  const sauces = ingredients.filter((item) => item.type === 'sauce');

  const getCount = (id: string) => {
    if (bun?._id === id) return 2;
    return constructorIngredients.filter((item) => item._id === id).length;
  };

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  // ✅ FIX: приведение string → TTabMode локально
  const onTabClick = (tab: string) => {
    const typedTab = tab as TTabMode;

    setCurrentTab(typedTab);

    if (typedTab === 'bun') {
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    if (typedTab === 'main') {
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    if (typedTab === 'sauce') {
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns.map((item) => ({ ...item, count: getCount(item._id) }))}
      mains={mains.map((item) => ({ ...item, count: getCount(item._id) }))}
      sauces={sauces.map((item) => ({ ...item, count: getCount(item._id) }))}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
