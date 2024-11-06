import styles from '_theme/modules/BudgetGrouping/CreateEditBudgetGroup/CreateEditMainContainer.module.css';
import DropdownFieldWithLabel from 'views/MediaConsole/Common/FormComponents/DropdownFieldWithLabel';
import 'views/MediaConsole/Campaigns/CreateEditCampaign/GeneralConfiguration.scss';
import 'views/MediaConsole/Campaigns/CreateEditCampaign/BussinessInformation';

const dropdownArray = [
  { label: 'Purchases' },
  { label: 'Lead form' },
  { label: 'Phone Call Leads' },
  { label: 'Page Views' },
  { label: 'Brand Awareness' },
];

const GeneralConfiguration = () => {
  return (
    <div className={styles['ce__section']}>
      <div className={'gen-cof-container'}>
        <div className={'ce__panels_container'}>
          <div className={'ce__title-container-sub-label'}>Choose Goal</div>
          <br />
          <div className={styles['field-container']}>
            <DropdownFieldWithLabel
              label='Choose your goal for this campaign'
              optionsArray={dropdownArray}
              placeholder='Select Goal'
            />
          </div>
          <br />
          <div className={'ce__title-container'}>
            <div className={'ce__title-container-sub-label'}>Search Topics</div>
          </div>
          <br />
          <label className='label-title'>
            What words or phrases do users use to search for your products or
            services?
          </label>
          <div className={'key-words-field'}>
            <span>Type Key Words</span>
          </div>
          <label className='max-characters-note'>Maximum of 25</label>
          <br /> 
          <div className={'ce__title-container'}>
            <div className={'ce__title-container-sub-label'}>More Settings</div>
          </div>
          <br />
          <div className='gf__container'>
            <div className='left-content'>
              <label className='label-title'>Languages</label>
              <div className='key-words-field'>
                <span>Search for a language</span>
              </div>
            </div>
            <div className='right-content'>
              <label className='label-title'>Location</label>
              <div className='radio-buttons-vertical-container'>
                <div className='radio-button'>
                  <input type='radio' />
                  <label>All Countries and Territories</label>
                </div>
                <div className='radio-button'>
                  <input type='radio' />
                  <label>Personalized</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GeneralConfiguration;
