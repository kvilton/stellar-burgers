import { describe, expect, test } from '@jest/globals';

import reducer, {
  initialState,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} from '../slices/constructorSlice';

const ingredient = {
  _id: '1',
  id: '1',
  name: 'Мясо',
  type: 'main',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 100,
  image: '',
  image_mobile: '',
  image_large: ''
};

const bun = {
  _id: '2',
  id: '2',
  name: 'Булка',
  type: 'bun',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 200,
  image: '',
  image_mobile: '',
  image_large: ''
};

describe('constructorSlice', () => {
  test('возвращает initialState', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  test('добавляет ингредиент', () => {
    const state = reducer(initialState, addIngredient(ingredient));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe('1');
  });

  test('добавляет булку', () => {
    const state = reducer(initialState, addIngredient(bun));

    expect(state.bun).toEqual(
      expect.objectContaining({
        _id: '2'
      })
    );
  });

  test('удаляет ингредиент', () => {
    const state = reducer(
      {
        ...initialState,
        ingredients: [ingredient]
      },
      removeIngredient('1')
    );

    expect(state.ingredients).toHaveLength(0);
  });

  test('перемещает ингредиент вниз', () => {
    const state = reducer(
      {
        ...initialState,
        ingredients: [
          { ...ingredient, id: '1' },
          { ...ingredient, id: '2' }
        ]
      },
      moveIngredientDown(0)
    );

    expect(state.ingredients[0].id).toBe('2');
  });

  test('перемещает ингредиент вверх', () => {
    const state = reducer(
      {
        ...initialState,
        ingredients: [
          { ...ingredient, id: '1' },
          { ...ingredient, id: '2' }
        ]
      },
      moveIngredientUp(1)
    );

    expect(state.ingredients[0].id).toBe('2');
  });

  test('очищает конструктор', () => {
    const state = reducer(
      {
        bun,
        ingredients: [ingredient]
      },
      clearConstructor()
    );

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });
});
