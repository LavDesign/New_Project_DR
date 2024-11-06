import React from 'react';
import CustomModal from '../UI/CustomModal';
import { useTranslation } from 'react-i18next';
import styles from '../../_theme/modules/shared/RoasKpi.module.css';

const RoasKPI = props => {
    const { t } = useTranslation(['common']);

    const onCloseHandler = () => props.setOpenModal(false);
    const onAcceptHandler = () => props.setOpenModal(false);

    return (
        <>
            {
                props.modalOpen &&
                <CustomModal
                    open={props.modalOpen}
                    onClose={onCloseHandler}
                    onAccept={onAcceptHandler}
                    modalWidth={'16rem'}
                    title={t('site_titles.roas_new')}
                    onSaveText={t('button_text.save')}
                    onCloseText={t('button_text.cancel')}
                >
                    <div>
                        <div>
                            <label className={`${styles['label']}`}>
                                {t('site_texts.name')}
                            </label>
                            <input className={`${styles['text_name']}`} type="text" name="name" />
                        </div>
                        <div>
                            <label className={`${styles['label']}`}>
                                {t('site_texts.revenue_formula')}
                            </label>
                            <textarea className={`${styles['text_revenue']}`}  ></textarea>
                        </div>
                        <p className={`${styles['p']}`}>
                            {t('validation_messages.revenue_validation')}
                            <b>{t('validation_messages.revenue_validation_note')}</b>
                        </p>
                    </div>
                </CustomModal >
            }
        </>
    )
}
export default RoasKPI;
