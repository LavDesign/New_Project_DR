import React from 'react';
import styles from '../../_theme/modules/shared/DataNotFound.module.css';
import { useTranslation } from 'react-i18next';
import { DASHBOARD_TABS, PUBLICURL} from '_helpers/Utils/dashboardUtil';

const DataNotFound = (props) => {
    const { t } = useTranslation(['common']);
    return (
        <>
            <div className={`col col-md-12 col-sm-12 ${styles['groove_nodata_div']}`}>
                <div className='col col-md-6 col-sm-6'>
                    <img src={`${window.location.origin}${PUBLICURL}/assets/icons/groove_rectangle.png`}
                        className={`me-1 ${styles['groove_vertical_seperator']}`} />
                    <p className={styles.para_not_found}>
                        {t('template.no_data_available')}
                    </p>


                    <p className={styles.groove_noDataFoundText}>
                        {props.selectedDashboardTab === DASHBOARD_TABS.AD_SET.name ? t('template.no_ad_set_available') : t('template.no_data_available_comment')}
                    </p>
                </div>
                <div className='col col-md-5 col-sm-5'>
                    <img src={`${window.location.origin}${PUBLICURL}/assets/icons/groove_doYouNeedImage.png`}
                        className={` ${styles['groove_nodatafound_image']}`} />
                </div>
            </div>


        </>
    );
};

export default DataNotFound;
