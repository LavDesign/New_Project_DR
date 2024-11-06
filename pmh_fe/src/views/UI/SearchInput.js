import React from 'react';
import styles from '../../_theme/modules/campaingDash/CampaignDashToolbar.module.css';
import { PUBLICURL } from '../../_helpers/Utils/dashboardUtil';

const SearchInput = (params) => {
  return (
    <div
      className={`row input-group mt-2 mb-2${params?.classSeachInput ? ` ${params.classSeachInput}` : ''
        }`}
    >
      <div style={{ ...params?.style }} className={`${styles['groove_search_div']}`}>

        <img src={`${window.location.origin}${PUBLICURL}/assets/icons/groove_search.png`} data-testid="SearchIcon"
          className={`d-inline-block align-baseline publisher-icon ${styles['groove_search_image']}`} />

        <input
          type='text'
          className={`form-control ${styles['groove_search_input_text']}${
            params?.inputSearchStyle ? ` ${params.inputSearchStyle}` : ''
          }`}
          placeholder={params.placeholderText}
          value={params.inputValue}
          onChange={params.onChangeHandler}
        />
      </div>
    </div>
  );
};

export default SearchInput;
