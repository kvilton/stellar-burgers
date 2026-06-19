import { FC, SyntheticEvent, useEffect, useState, ChangeEvent } from 'react';

import { ProfileUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { updateUser } from '../../services/slices/userSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    Boolean(formValue.password);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    dispatch(
      updateUser({
        name: formValue.name,
        email: formValue.email,
        ...(formValue.password && { password: formValue.password })
      })
    );
  };

  const handleCancel = (event: SyntheticEvent) => {
    event.preventDefault();

    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormValue((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
