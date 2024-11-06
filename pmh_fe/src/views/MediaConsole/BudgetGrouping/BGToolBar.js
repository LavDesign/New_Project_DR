import React from 'react';
import { PUBLICURL } from '_helpers/Utils/dashboardUtil';
import styles from '_theme/modules/BudgetGrouping/BudgetGrouping.module.css';
import CommonToolBar from '../Common/CommonToolBar/CommonToolBar';

const searchCriteriaList = [
  {
    label: 'Budget Group',
    value: 'groupName',
  },
  {
    label: 'KPI',
    value: 'kpi',
  },
  {
    label: 'Campaign',
    value: 'campaignName',
  },
  {
    label: 'Client',
    value: 'clientName',
  },
  {
    label: 'Region',
    value: 'region',
  },
  {
    label: 'Clear Filter',
    value: 'noValue',
  },
];

const viewList = [
  {
    label: 'List',
    value: 'list',
  },
  {
    label: 'Cards',
    value: 'cards',
  },
];

const BGToolBar = ({
  onCreateBudgetGroup,
  viewSelection,
  setViewSelection,
  budgetGroupData,
  filteredBudgetGroup,
}) => {
  const displayView = () => {
    return (
      <div
        className={`${styles['bg-toolbar__view-flex']} ${styles['bg-toolbar__view-flex-gap-1']}`}
      >
        <div className={styles['bg-toolbar__view']}>Show as:</div>
        <div
          className={`${styles['bg-toolbar__view-flex']} ${styles['bg-toolbar__view-flex-gap-1']}  ${styles['bg-toolbar__view-btn']}`}
        >
          {viewList.map((item, index) => {
            return (
              <div
                className={`d-flex align-items-end ${styles['bg-toolbar__view-flex-gap-half']}`}
                onClick={() => setViewSelection(item.value)}
                key={`view_${index}`}
              >
                <img
                  src={`${window.location.origin}${PUBLICURL}/assets/icons/${
                    viewSelection === item.value
                      ? 'checked-radio'
                      : 'unchecked-radio'
                  }.svg`}
                  alt='View Layout'
                  className={
                    viewSelection === item.value
                      ? styles['bg-toolbar__view-radio-checked-img']
                      : styles['bg-toolbar__view-radio-unchecked-img']
                  }
                />
                <div
                  className={`${styles['bg-toolbar__view-label']} ${
                    viewSelection === item.value
                      ? styles['bg-toolbar__view-label-checked']
                      : ''
                  }`}
                >
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const displayNewGroupBtn = () => {
    return (
      <button
        className={`${styles['bg-toolbar__new-group-btn']}`}
        onClick={() => onCreateBudgetGroup()}
      >
        <img
          src={`${window.location.origin}${PUBLICURL}/assets/icons/bg-plus.svg`}
          alt='Add'
        />
        <span className={`${styles['bg-toolbar__new-group-btn-text']}`}>
          New Group
        </span>
      </button>
    );
  };

  const searchFunction = (searchRecords, searchText, criteriaValue) => {
    if (criteriaValue) {
      return searchRecords
        ?.map((item) => {
          const matchingData = item.campaigns.filter((data) =>
            data[criteriaValue]?.toLowerCase().includes(searchText)
          );

          const isItemMatch = item[criteriaValue]
            ?.toLowerCase()
            .includes(searchText);

          if (matchingData.length || isItemMatch)
            return {
              ...item,
              campaigns: matchingData,
            };
          else return null;
        })
        .filter((item) => item !== null);
    }
    return searchRecords
      ?.map((item) => {
        const matchingData = item.campaigns.filter((data) =>
          Object.values(data).some((value) =>
            value?.toString()?.toLowerCase()?.includes(searchText)
          )
        );

        const isItemMatch = Object.values(item).some((value) =>
          value?.toString()?.toLowerCase()?.includes(searchText)
        );

        if (matchingData.length || isItemMatch)
          return {
            ...item,
            campaigns: matchingData,
          };
        else return null;
      })
      .filter((item) => item !== null);
  };

  return (
    <CommonToolBar
      searchCriteriaList={searchCriteriaList}
      searchRecords={budgetGroupData}
      displayfilteredRecords={filteredBudgetGroup}
      searchFunction={searchFunction}
      displayComponents={
        <>
          {displayView()}
          {displayNewGroupBtn()}
        </>
      }
    />
  );
};

export default BGToolBar;
