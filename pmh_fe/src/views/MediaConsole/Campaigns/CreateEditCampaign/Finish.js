import styles from '_theme/modules/BudgetGrouping/CreateEditBudgetGroup/CreateEditMainContainer.module.css';

const finishText = {
    color: '#15181B',
    fontFamily: '"Graphik", sans-serif',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '18px', 
    letterSpacing: '-0.25px'
}

const Finish = () => {
  return (
    <div className={styles['ce__section']}>
      <div className={'gen-cof-container'}>
        <div className={'ce__panels_container'}>
          <div className={'ce__title-container-label'}>You are almost done!</div>
          <br />
          <div >
            <div className={styles['field-container']} style={finishText}>
                Once your campaign is saved you will see it reflected on the Management screen 
                You can also add it to a Budget Group for easier management
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Finish;
