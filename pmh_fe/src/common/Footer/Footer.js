import React from "react";
import { useTranslation } from 'react-i18next';
import VERSION from "_helpers/Version";
import "./Footer.scss";
import CustomModal from "views/UI/CustomModal";
import styles from '../../_theme/modules/UI/TermsAndConditions.module.css'
import {useState} from 'react';
import {Typography} from '@mui/material';
import TermsAndConditions from "views/TermsAndConditions/TermsAndConditions";

const Footer = () => {
    const { t } = useTranslation(['common']);
    const currentYear = new Date().getFullYear();
    const [showLegalNoticePopUp, setShowLegalNoticePopUp] = useState(false);
    const [privacyPolicyPopUp, setPrivacyPolicyPopUp] = useState(false);
    
    const renderLegalNotice = () => {
        return (
            <CustomModal
                open={true}
                title={'Legal Notice'}
                onClose={() => setShowLegalNoticePopUp(false)}
                isGroove={true}
                isModalWhiteBackground={true}
            >
                <Typography className={`${styles['groove_term_details']}`} style={{ whiteSpace: 'pre-line' }}>
                    {`This system is the property of Accenture and is to be used in accordance with applicable Accenture policies.`}
                    <br />
                    <br />
                    {`Unauthorized access or activity is a violation of Accenture Policies and may be a violation of law.`}
                    <br />
                    <br />
                    {`Use of this system constitutes consent to monitoring for unauthorized use, in accordance with Accenture Policies, local laws and regulations. Unauthorized use may result in penalties including, but not limited to, reprimand, dismissal, financial penalties and legal action.`}

                </Typography>
            </CustomModal>
        )
    };

    const renderPrivacyPolicy = () => {
        return (
            <CustomModal
                open={true}
                title={t('master_page.footer.links.privacy_policy')}
                onClose={() => setPrivacyPolicyPopUp(false)}
                isGroove={true}
                isModalWhiteBackground={true}
            >
                <TermsAndConditions/>
            </CustomModal>
        )
    }

    return (
        <div>
            {showLegalNoticePopUp && renderLegalNotice()}
            {privacyPolicyPopUp && renderPrivacyPolicy()}
            <footer className="footer mt-auto fixed-bottom">
                <nav className="navbar navbar-light">
                    <div className="container-fluid p-2">
                        <a className="navbar-brand" href="#">
                            <img
                                className="d-inline-block align-text-top groove_footer_image"
                                src={`${import.meta.env.VITE_PUBLIC_URL === '/' ? '' : import.meta.env.VITE_PUBLIC_URL}/static/images/accenture-black.png`}
                                alt="Accenture logo"
                                title={VERSION}
                            />
                        </a>
                        <div style={{ width: '85%', display: 'inline-flex' }}>
                            <span className="navbar-text groove_text">
                                &copy; {currentYear} {t('site_texts.all_rights_reserved')}
                            </span>
                            <span style={{ marginLeft: '40px' ,cursor:'pointer'}} className="navbar-text groove_text" onClick={() => setShowLegalNoticePopUp(true)}>
                                {t('site_texts.legal_notice')}
                            </span>
                            <span style={{ marginLeft: '40px' ,cursor:'pointer'}} className="navbar-text groove_text" onClick={() => setPrivacyPolicyPopUp(true)}>
                                {t('master_page.footer.links.privacy_policy')}
                            </span>
                            <span style={{ marginLeft: '40px' }} className="navbar-text groove_text">
                                {t('site_texts.contact_us')}
                            </span>
                        </div>
                    </div>
                </nav>
            </footer >
        </div>
    );
};

export default Footer;
