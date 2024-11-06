import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import styles from '../../_theme/modules/UI/TermsAndConditions.module.css'
import { useTranslation } from 'react-i18next';

const TermsAndConditions = () => {
  const { t } = useTranslation(['common']);
  const ColoredText = (text) => <><br></br><span className={`${styles['groove_details_heading']}`}>{text}</span></>;

  return (
    <>
      <div className={`${styles['groove_terms_container']}`}>
        <div className={`${styles['groove_terms_parent_container']}`}>
          <div>
            <h1 className={`${styles['groove_terms_heading']}`}>{t('site_texts.terms_legal_notice')}</h1>
            <Accordion className={` rounded ${styles['groove_terms_div']}`}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography className={`${styles['groove_term_heading']}`}>{t('site_texts.terms_of_use')}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography className={`${styles['groove_term_details']}`} style={{ whiteSpace: 'pre-line' }}>
                  {`Your access to and use of this site is subject to the following terms and conditions and all applicable laws. By accessing and using this site, you accept the following terms and conditions, without limitation or qualification.
            The information provided on this site is free of charge and for informational purposes and internal use only. Unless otherwise stated, the contents of this site including, but not limited to, the text and images contained herein and their arrangement are the property of Accenture. All trademarks used or referred to in this website are the property of their respective owners.
            Nothing contained in this site shall be construed as conferring by implication, estoppel, or otherwise, any license or right to any copyright, patent, trademark or other proprietary interest of Accenture or any third party. This site and the content provided in this site, including, but not limited to, graphic images, audio, video, html code, buttons, and text, may not be copied, reproduced, republished, uploaded, posted, transmitted, or distributed in any way, without the prior written consent of Accenture, except that you may download, display, and print one copy of the materials on any single computer solely for your personal, non-commercial use, provided that you do not modify the material in any way and you keep intact all copyright, trademark, and other proprietary notices.Links on this site may lead to services or sites not operated by Accenture. No judgment or warranty is made with respect to such other services or sites and Accenture takes no responsibility for such other sites or services. A link to another site or service is not an endorsement of that site or service. Any use you make of the information provided on this site, or any site or service linked to by this site, is at your own risk.
            This site and its contents are provided “as is” and Accenture makes no representation or warranty of any kind with respect to this site or any site or service accessible through this site. Accenture expressly disclaims all express and implied warranties including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement. In no event will Accenture be liable to any party for any direct, indirect, incidental, special, exemplary, consequential, or other damages (including, but not limited to, lost profits, business interruption, loss of programs or data) without regard to the form of action and whether in contract, tort, negligence, strict liability, or otherwise, arising out of or in connection with this site, any content on or accessed through this site or any site service linked to, or any copying, displaying, or use thereof.
            You are responsible for complying with the laws of the jurisdiction from which you are accessing this site and you agree that you will not access or use the information on this site in violation of such laws. Unless expressly stated otherwise herein, any information submitted by you through this site shall be deemed non-confidential and non-proprietary. You represent that you have the lawful right to submit such information and agree that you will not submit any information unless you are legally entitled to do so. Because of the open nature of the Internet, we recommend that you not submit information you consider confidential.`}
                </Typography>
              </AccordionDetails>
            </Accordion>
            {/* <br /> */}
            <Accordion className={` rounded ${styles['groove_terms_div']} ${styles['groove_terms_div_position']}`}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography className={`${styles['groove_term_heading']}`}>{t('site_texts.privacy_statement')}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography className={`${styles['groove_term_details']}`} style={{ whiteSpace: 'pre-line' }}>
                  {`This website is administered by Accenture. The primary purpose of this site is to provide information and knowledge resources for Accenture employees. We want you to feel secure when visiting our site and are committed to maintaining your privacy when doing so.
            Before using and providing information through this site, we invite you to carefully read the below and our `} 
            <a href="https://www.accenture.com/us-en/support/privacy-policy" target="_blank" rel="noopener noreferrer">Accenture Global Privacy Statement.</a><br/>
            {ColoredText('What information do we gather?')}{`
            Information in this site is gathered in two ways: indirectly (for example, through our site's technology) and directly (for example, when you provide information on various pages of the Accenture Portal). One example of information we collect indirectly is through our Internet access logs. When you access this site, your Internet address is automatically collected and is placed in our Internet access logs. Although we do not generally seek to collect sensitive personal data through this site, we may do so in certain cases where we have the legal right to do so, or where you have expressly consented to this.
            One way that we collect information is through the use of cookies. Cookies are small files of information that save and retrieve information about your visit to this site – for example, how you entered our site, how you navigated through the site, and what information was of interest to you. Please read our cookies policy for further information on this. If you are uncomfortable regarding cookies use, please keep in mind you can disable cookies on your computer by changing the settings in preferences or options menu in your browser. We also collect information when you voluntarily submit it to us. There is a feedback page where you can volunteer information that is sent to us and stored in a database.
            `}{ColoredText('How do we use this information?')}{`
            We process your personal data as permitted by applicable data protection laws and our internal policies, including Accenture’s Global Data Privacy Policy 0090.
            We analyze your information to determine what is most effective about our site, to help us identify ways to improve it, and eventually, to determine how we can tailor our site to make it more effective for you and other users. We may also use your information for certain other purposes, where we have the legal right to do so, such as complying with requests from public authorities or conducting internal investigations.
            `}{ColoredText('Will we share this with outside parties?')}{`
            As a global organization, information we collect may be transferred internationally throughout Accenture's worldwide organization. In addition, we may at times share your information with certain third parties, such as our third party service providers.
            `}{ColoredText('How do we protect your information?')}{`
            The protection of your information is important to us. We will process your information in accordance with applicable legislation, and will take appropriate steps to maintain the security of this site.
            `}{ColoredText('Where can I find further information on this?')}{`
            You can find further information on how and for what purposes we use your information, and on what rights you have in relation to your information, in our Privacy Policy.`}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
}

export default TermsAndConditions;