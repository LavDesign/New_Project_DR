import React from 'react';
import styles from '../../_theme/modules/campaingDash/CampaignSelectorForm.module.css';
import { PUBLICURL } from '../../_helpers/Utils/dashboardUtil';

const CustomNavTabs = props => {

  const onClickTabHandler = idx => {
    props.setSelectedTab(idx);
  };

  return (
    <>
      <ul className='nav'>
        {props.tabHeaders.map((name, idx) => (
          <li key={`${name}_${idx}`} className='nav-item'>
            <a style={{
              border: 'none',
              color: idx === props.selectedTab ? 'rgba(21, 24, 27, 1)' : 'rgba(107, 114, 128, 1)'
            }} role="button" tabIndex={idx}
              className={`nav-link ${styles['groove_nav_link']}
              ${idx === props.selectedTab && props.isCampaignSelectorPopup ? styles['groove_active_tab_text_black'] : ""}
               ${idx == props.selectedTab ? styles['groove_nav_link_active'] : ""}`} onClick={onClickTabHandler.bind(null, idx)} >{`${name}`}</a>
          </li>
        ))}
      </ul>

      {props.isCampaignSelectorPopup ?
        <>
          <img className={props.selectedTab === 0 ? `me-1 ${styles['groove_camp_selector_underline_active']}` : `me-1 ${styles['groove_camp_selector_underline']}`} src={`${window.location.origin}${PUBLICURL}/assets/icons/groove_underline.png`}/>
          <img className={props.selectedTab === 1 ? `me-1 ${styles['groove_camp_selector_underline_active']}` : `me-1 ${styles['groove_camp_selector_underline']}`} src={`${window.location.origin}${PUBLICURL}/assets/icons/groove_underline.png`}
            style={{ marginLeft: '-30px' }}
          />
        </> :
        <>
          <img className={props.selectedTab === 0 ? `me-1 ${styles['groove_underline_active']}` : `me-1 ${styles['groove_underline']}`} src={`${window.location.origin}${PUBLICURL}/assets/icons/groove_Indicator.png`}
            style={{ marginLeft: '16px' }} />
          <img className={props.selectedTab === 1 ? `me-1 ${styles['groove_underline_active']}` : `me-1 ${styles['groove_underline']}`} src={`${window.location.origin}${PUBLICURL}/assets/icons/groove_Indicator.png`}
            style={{ marginLeft: '108px' }}
          />
        </>
      }
    </>
  )
};

export default CustomNavTabs;
