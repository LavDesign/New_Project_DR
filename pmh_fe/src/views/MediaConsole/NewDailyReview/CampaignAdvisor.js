import React, { useState} from 'react';
import "./dailyReview.scss";
import CommonToolBar from '../Common/CommonToolBar/CommonToolBar';
import BaseStyles from '_theme/modules/BudgetGrouping/BudgetGrouping.module.css';
import { PUBLICURL } from '_helpers/Utils/dashboardUtil';

const CampaignAdvisor = () => {
  const searchCriteriaList = [
    {
      label: 'Campaign ID',
      value: 'campaignKey',
    },
    {
      label: 'Campaign',
      value: 'campaignName',
    },
    {
      label: 'Account',
      value: 'accountName',
    },
    {
      label: 'Account Id',
      value: 'accountKey',
    },
    {
      label: 'Plaform',
      value: 'platformName',
    },
    {
      label: 'Clear Filter',
      value: 'noValue',
    },
  ];

 const [contentOpen, setContentOpen] = useState(false);
 const [contentOpenRevised, setContentOpenRevised] = useState(false);
  const displayNewGroupBtn = () => {
    return (
      <button
        className={`${BaseStyles['bg-toolbar__new-group-btn']}`}
        onClick={() => onCreateCampaign()}
      >
        <span className={`${BaseStyles['bg-toolbar__new-group-btn-text']}`}>
          Export
        </span>
      </button>
    );
  };


  const searchFunction = (searchRecords, searchText, criteriaValue) => {
    console.log("search function");
    if (criteriaValue) {
      return searchRecords
        .map((data) => {
          const isItemMatch = data[criteriaValue]
            ?.toString()
            ?.toLowerCase()
            ?.includes(searchText);

          if (isItemMatch) return data;
          else return null;
        })
        .filter((item) => item !== null);
    }

    return searchRecords
      .map((data) => {
        const isItemMatch = Object.values(data).some((value) =>
          value?.toString()?.toLowerCase()?.includes(searchText)
        );

        if (isItemMatch) return data;
        else return null;
      })
      .filter((item) => item !== null);
  };

  return (
    <div className="daily-review-container-section ml-0">
      <CommonToolBar
      searchByTextLabel={'Search By'}
      searchCriteriaList={searchCriteriaList}
      searchFunction={searchFunction}
      displayComponents={
        <>
          {displayNewGroupBtn()}
        </>
      }
    />
    <div className="tab-need">
    <div className="accordian-parent">
      <div className="accordian-header" onClick={() => setContentOpen(!contentOpen)}>

           <img className="img-css"
            src={`${window.location.origin}${PUBLICURL}/assets/icons/${
              true ? "select-arrow-down" : "select-arrow-down"
            }.svg`}
            alt='Add Icon'
          />
      <span className="need-txt"> Need Attention </span>
      </div>
      {contentOpen ?<div className="accordian-content">
        Accordian Body
        </div>: <div></div>}

      </div>
      <div className="accordian-parent">
      <div className="accordian-header" onClick={() => setContentOpenRevised(!contentOpenRevised)}>
      <img className="img-css"
            src={`${window.location.origin}${PUBLICURL}/assets/icons/${
              true ? "select-arrow-down" : "select-arrow-down"
            }.svg`}
            alt='Add Icon'
          />
      <span className="need-txt">Revised </span>
      </div>
      {contentOpenRevised ?<div className="accordian-content">
        Accordian Body Revised
        </div>: <div></div>}
      </div>
      
    </div>
    </div>
  );
};
export default CampaignAdvisor;
