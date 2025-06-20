import React from 'react';
import { useTranslation } from 'react-i18next';

const CTAButton = ({ href = '#', textKey = 'button.bookNow' }) => {
  const { t } = useTranslation();

  return (
    <a
      href={href}
      className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-full transition"
    >
      {t(textKey)}
    </a>
  );
};

export default CTAButton;
