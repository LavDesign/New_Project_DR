import { useEffect, useState } from 'react';
import { PUBLICURL } from '_helpers/Utils/dashboardUtil';
import './CommonToolBar.scss';
import { findLabelByValue } from '_helpers/Utils/mediaConsoleUtil';
import ToggleImage from './ToggleImage';
import SearchComponent from '../FormComponents/SearchComponent';

const initialSearchCriteria = {
  label: 'Select',
  value: 'noValue',
};

/**
@param searchByTextLabel: Search By label display
@param searchCriteriaList: List of search criteria. This prop is mandatory if search dropdown is required
@param searchRecords: List of records to search
@param displayfilteredRecords: This function is used to display the filtered data in the parent component
@param searchFunction: This function is used to search the data based on search text and search criteria
@param displayComponents: Any other components that needs to be displayed along with search
@param showSearchInput: Boolean value to show/hide search input
**/

const CommonToolBar = ({
  searchByTextLabel = 'Search by',
  searchCriteriaList,
  searchRecords = [],
  displayfilteredRecords = () => {},
  searchFunction = () => {},
  displayComponents,
  showSearchInput = true,
  className
}) => {
  const [searchCriteria, setSearchCriteria] = useState(initialSearchCriteria);
  const [searchValue, setSearchValue] = useState(undefined);

  useEffect(() => {
    if (searchValue) {
      onSearch({ target: { value: searchValue } });
    }
  }, [searchCriteria]);

  const onSearch = (event) => {
    const searchText = event.target.value.toLowerCase();
    setSearchValue(event.target.value || undefined);
    let filteredData = [];
    if (searchText) {
      if (searchCriteria.value === initialSearchCriteria.value) {
        filteredData = searchFunction(searchRecords, searchText);
      } else {
        filteredData = searchFunction(
          searchRecords,
          searchText,
          searchCriteria?.value
        );
      }
      displayfilteredRecords(filteredData);
    } else {
      displayfilteredRecords(searchRecords);
    }
  };

  const displaySearchList = () => {
    return (
      <div className={`dropdown`}>
        <button
          className={`select-dropdown`}
          type='button'
          data-bs-toggle='dropdown'
        >
          <div
            className={`select-dropdown-value ${
              searchCriteria.value === initialSearchCriteria.value
                ? ''
                : 'select-dropdown-selected-value'
            }`}
          >
            {searchCriteria.value === initialSearchCriteria.value
              ? initialSearchCriteria.label
              : findLabelByValue(searchCriteria.value, searchCriteriaList)}
          </div>
          <ToggleImage />
        </button>
        <ul className={`dropdown-menu search-dropdown`}>
          {searchCriteriaList.map((item, index) => {
            return (
              <li
                className={`search-dropdown-item`}
                onClick={() => {
                  item.value === initialSearchCriteria.value
                    ? setSearchCriteria(initialSearchCriteria)
                    : setSearchCriteria(item);
                }}
                key={`searchCriteria_${index}`}
              >
                <span
                  className={`search-dropdown-item-label ${
                    item.value === initialSearchCriteria.value
                      ? 'search-dropdown-item-label-clear'
                      : ''
                  }`}
                >
                  {item.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className={`common-tool-bar ${className}`}>
      {searchCriteriaList && (
        <>
          <div className='search-by-text'>{searchByTextLabel}</div>
          {displaySearchList()}
          <img
            src={`${window.location.origin}${PUBLICURL}/assets/icons/vertical-divider.svg`}
            alt='Divider'
          />
        </>
      )}

      {showSearchInput && (
        <SearchComponent
          searchValue={searchValue}
          onSearchText={(event) => onSearch(event)}
          clearSearch={() => onSearch({ target: { value: '' } })}
          customClass='search-input-container'
        />
      )}
      {displayComponents}
    </div>
  );
};

export default CommonToolBar;
