import React, { useEffect } from 'react';
import { FaDizzy } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const NotFound = () => {
    const { t } = useTranslation(['common']);
    useEffect(() => {
        localStorage.removeItem(import.meta.env.VITE_LAST_URL);
    }, []);

    return (
        <div className='d-flex justify-content-center align-items-center text-center h-100'>
            <div>
                <p><FaDizzy size={"4rem"}/></p>
                <h4>
                {t('template.error.error_404_title')}
                </h4>
                <p>
                    {t('template.error.error_404_comment')}
                </p>
            </div>
        </div>
    );
};

export default NotFound;