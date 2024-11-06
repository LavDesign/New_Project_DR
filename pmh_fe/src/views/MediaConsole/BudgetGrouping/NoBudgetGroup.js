import { PUBLICURL } from '_helpers/Utils/dashboardUtil';
import styles from '_theme/modules/BudgetGrouping/BudgetGrouping.module.css';

const NoBudgetGroup = ({ 
  mainHeading = 'You don’t have any Budget Group created',
  content = 'Your Budget Groups will be shown in this screen',
}) => {
  return (
    <div className={`${styles['bg-no-budget-group__container']}`}>
      <div className={`${styles['bg-no-budget-group__text-container']}`}>
        <img
          src={`${window.location.origin}${PUBLICURL}/assets/icons/vertical-line-thick.svg`}
          className={styles['bg-no-budget-group__vertical-line']}
        />
        <div>
          <div className={styles['bg-no-budget-group__main-heading']} style={{ fontSize : mainHeading.length > 25 ? '39px' : '3rem'}}>
            {mainHeading}
          </div>
          <div className={styles['bg-no-budget-group__content']}>
            {content}
          </div>
        </div>
      </div>
      <img
        src={`${window.location.origin}${PUBLICURL}/assets/icons/no-budget-group.png`}
        className={styles['bg-no-budget-group__image']}
      />
    </div>
  );
};

export default NoBudgetGroup;
