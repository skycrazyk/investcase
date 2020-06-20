import { useState } from 'react';

const useModalActions = () => {
  const [visible, setVisible] = useState(false);

  const show = () => {
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  return {
    visible,
    setVisible,
    show,
    hide,
  };
};

export default useModalActions;
