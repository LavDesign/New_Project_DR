import React from 'react';
import dataNotFoundStyles from '../../_theme/modules/shared/DataNotFound.module.css'; 
import { DASHBOARD_TABS, PUBLICURL } from '_helpers/Utils/dashboardUtil';
import { useTranslation } from 'react-i18next';
import CustomButton from '../UI/CustomButton';
import { useAuth } from '_helpers/Auth/authContext';

const SessionLogout = ({  selectedDashboardTab }) => {
    const { t } = useTranslation(['common']); 
    const auth = useAuth();    
    async function doLogout() {
        auth.logOut();
      }
    
    return (
        <div className={`col col-md-12 col-sm-12 ${dataNotFoundStyles['groove_sessionLogout_div']}`}>
            <div className={`${dataNotFoundStyles['groove_sessionLogout_rectangle']}`}>
                <img src={`${window.location.origin}${PUBLICURL}/assets/icons/vertical-line-thick.svg`}
                    className={`me-1 ${dataNotFoundStyles['groove_vertical_sessionLogout_seperator']}`} alt="Separator" />
            </div>
            <div className='col col-md-6 col-sm-6'>
                <p className={dataNotFoundStyles.groove_sessionLogout_title}>
                    {t('template.session_logout')}
                </p>
                <p className={dataNotFoundStyles.groove_sessionLogout_comment}>
                    {selectedDashboardTab === DASHBOARD_TABS.AD_SET.name ? t('template.groove_sessionLogout_comment') : t('template.session_logout_comment')}
                </p>
                <CustomButton
                    className={`btn btn-primary text-white ${dataNotFoundStyles['groove_sessionLogout_btn']}`}
                    onClick={doLogout}>
                    {t('button_text.log_out')}
                </CustomButton>
            </div>
            <div className='col col-md-5 col-sm-5'>
                <img src={`${window.location.origin}${PUBLICURL}/assets/icons/session-logout.png`}
                    className={` ${dataNotFoundStyles['groove_nodatafound_image']}`} alt="IP Change Logout" />
            </div>
        </div>
    );
};

export default SessionLogout;
