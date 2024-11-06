import styles from '_theme/modules/BudgetGrouping/CreateEditBudgetGroup/CreateEditMainContainer.module.css';
import DropdownFieldWithLabel from 'views/MediaConsole/Common/FormComponents/DropdownFieldWithLabel';
import 'views/MediaConsole/Campaigns/CreateEditCampaign/GeneralConfiguration.scss';
import 'views/MediaConsole/Campaigns/CreateEditCampaign/BussinessInformation';
import 'views/MediaConsole/Campaigns/CreateEditCampaign/BudgetAndBidding.scss';
import InputFieldWithLabel from 'views/MediaConsole/Common/FormComponents/InputFieldWithLabel';

const dropdownArray = [{ label: 'Conversions' }];

const BudgetAndBidding = () => {
  return (
    <div className={styles['ce__section']}>
      <div className={'gen-cof-container'}>
        <div className={'ce__panels_container'}>
          <div className={'ce__title-container-sub-label'}>Bidding</div>
          <br />
          <div className='bid-dropdown-multiple'>
            <div className={styles['field-container']}>
              <DropdownFieldWithLabel
                label='Bid Strategy'
                optionsArray={dropdownArray}
                placeholder='Choose Bid Strategy'
              />
            </div>
            <div className={styles['field-container']}>
              <InputFieldWithLabel
                label='Maximum CPB'
                onChange={(event) => handleInputChange(event, 'budgetName')}
                placeholder='$1.50'
              />
            </div>
          </div>

          <br />
          <div className={'ce__title-container-sub-label'}>Campaign Budget</div>
          <br />
          <div className='bid-dropdown-single'>
            <div className={styles['field-container']}>
              <InputFieldWithLabel
                label='Set Budget'
                value=''
                onChange={(event) => handleInputChange(event, 'budgetName')}
                placeholder='$45000'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BudgetAndBidding;
