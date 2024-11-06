import { useTranslation } from 'react-i18next';

const Spinner = ({ showLoadingText = true }) => {
  const { t } = useTranslation(['common']);

  return (
    <div style={{ height: '80px' }} className='p-3 text-center text-primary'>
      <div style={{ left: '50%', position: 'absolute' }}>
        <div className='spinner-border' role='status' aria-hidden='true'></div>
        {showLoadingText && (
          <strong className='p-2'>{t('template.loading')}</strong>
        )}
      </div>
    </div>
  );
};

export default Spinner;
