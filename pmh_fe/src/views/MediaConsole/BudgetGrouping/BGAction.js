import { PUBLICURL } from '_helpers/Utils/dashboardUtil';
import styles from '_theme/modules/BudgetGrouping/BudgetGrouping.module.css';

const BGAction = ({ group, handleRemoveClick, onEditBudgetGroup }) => {
  const actionListItems = [
    {
      actionBtnName: 'Edit',
      actionIconImg: `bg-edit.svg`,
      onClickHandler: onEditBudgetGroup,
    },
    {
      actionBtnName: 'View',
      actionIconImg: `bg-view.svg`,
    },
    {
      actionBtnName: 'Delete',
      actionIconImg: `bg-delete.svg`,
      onClickHandler: handleRemoveClick,
    },
  ];

  return (
    <div className={styles['bg-action_btn']}>
      <div
        className={`dropdown`}
        data-bs-toggle='dropdown'
        aria-expanded='false'
      >
        <img
          src={`${window.location.origin}${PUBLICURL}/assets/icons/ellipsis-h.svg`}
          alt='Action'
        />
        <ul className={`dropdown-menu ${styles['bg-action__dropdown']}`}>
          {actionListItems.map((item) => {
            return (
              <li className={styles['bg-action__dropdown__dropDownItem-mb']}>
                <button
                  className={`dropdown-item ${styles['bg-action__dropdownItem']} d-flex`}
                  type='button'
                  onClick={() => item.onClickHandler(group)}
                >
                  <img
                    src={`${window.location.origin}${PUBLICURL}/assets/icons/${item.actionIconImg}`}
                    alt={item.actionBtnName}
                  />
                  <span className={styles['bg-action_label']}>
                    {item.actionBtnName}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default BGAction;
