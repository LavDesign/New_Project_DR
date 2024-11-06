import react from 'react';
import InputFieldWithLabel from 'views/MediaConsole/Common/FormComponents/InputFieldWithLabel';
import styles from '_theme/modules/BudgetGrouping/CreateEditBudgetGroup/CreateEditMainContainer.module.css';
import 'views/MediaConsole/Campaigns/CreateEditCampaign/CreateEditCampaignMainContainer.scss';
import 'views/MediaConsole/Campaigns/CreateEditCampaign/BussinessInformation.scss';

const BusinessInformation = () => {
  return (
    <div className={styles['ce__section']}>
      <div className={'ce__panels_container'}>
        <div className={'ce__title-container'}>
          <div className={'ce__title-container-sub-label'}>
            About the business
          </div>
        </div>
        <br />
        <div className={styles['field-container']}>
          <InputFieldWithLabel
            label='Name the campaign'
            value={''}
            placeholder='Campaign Name'
          />
        </div>
        <br />
        <label className='label-title'>
          Where should users go after clicking on your ad?
        </label>
        <div className='radio-buttons-container'>
          <div className='radio-button'>
            <input type='radio' value='' />
            <label className='radio-label'>Your Website</label>
          </div>
          <div className='radio-button'>
            <input type='radio' value='' />
            <label className='radio-label'>Phone Number</label>
          </div>
          <div className='radio-button'>
            <input type='radio' value='' />
            <label className='radio-label'>Download an App</label>
          </div>
          <div className='radio-button'>
            <input type='radio' value='' />
            <label className='radio-label'>Something Else</label>
          </div>
        </div>
        <br />
        <div className={styles['field-container']}>
          <InputFieldWithLabel
            label='Enter the URL of your website'
            value={''}
            placeholder='https://example.com'
          />
        </div>
      </div>
    </div>
  );
};

export default BusinessInformation;
