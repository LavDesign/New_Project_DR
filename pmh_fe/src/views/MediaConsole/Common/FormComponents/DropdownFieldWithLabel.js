import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './DropdownFieldWithLabel.scss';
import ListToggleImage from './ListToggleImage';
import SearchComponent from './SearchComponent';
import { PUBLICURL } from '_helpers/Utils/dashboardUtil';

const DropdownFieldWithLabel = ({
  label = 'Label',
  showAsterisk = false,
  isInvalid = false,
  optionsArray = [],
  errorMsg,
  placeholder = 'Select',
  selectedData,
  onClickHandler,
  customClass = '',
  closeDropdown = 'true',
  customDropDownComponent,
  disabled = false,
  showSearch = false,
  searchValue = '',
  onSearchText = () => {},
  clearSearch = () => {},
  placeholderText,
  customEmptyComponent,
  showInfo = false,
  toolTipInfo,
}) => {
  return (
    <div
      className={`dropdown-field-container w-100 position-relative ${customClass}`}
    >
      <div className='label-container'>
        <label
          className={`form-label ${
            isInvalid
              ? 'error-color'
              : disabled
              ? 'disabled-dropdown-class'
              : ''
          }`}
        >
          {label}
          {showAsterisk && <span className='error-color'>{` *`}</span>}
        </label>

        {showInfo ? (
          <OverlayTrigger
            placement={'right'}
            overlay={
              <Tooltip className='customToolTip' id={`tooltip-right`}>
                {toolTipInfo}
              </Tooltip>
            }
          >
            <img
              src={`${window.location.origin}${PUBLICURL}/assets/icons/info-form.svg`}
              alt={'info-icon'}
            />
          </OverlayTrigger>
        ) : null}
      </div>

      <div className='dropdown dropdown-field'>
        <div
          className={`value-container ${
            isInvalid ? 'error-border-color' : ''
          } ${disabled ? 'disabled-dropdown-class' : ''}`}
          data-bs-toggle='dropdown'
          data-bs-auto-close={closeDropdown}
          tabIndex={0}
        >
          <span>{selectedData?.label || placeholder}</span>
          <ListToggleImage />
        </div>
        <ul className='dropdown-menu'>
          {customDropDownComponent ? (
            customDropDownComponent
          ) : (
            <div className='dropdown-container'>
              {showSearch && (
                <SearchComponent
                  searchValue={searchValue}
                  onSearchText={onSearchText}
                  placeholderText={placeholderText}
                  clearSearch={clearSearch}
                />
              )}
              {optionsArray.length
                ? optionsArray.map((item, index) => {
                    return (
                      <li className='dropdown-item-list' key={`key_${index}`}>
                        <button
                          className='dropdown-item d-flex'
                          type='button'
                          onClick={() => onClickHandler(item)}
                        >
                          <span>{item.label}</span>
                        </button>
                      </li>
                    );
                  })
                : customEmptyComponent
                ? customEmptyComponent
                : null}
            </div>
          )}
        </ul>
      </div>
      {isInvalid && <div className='helper-text-container'>{errorMsg}</div>}
    </div>
  );
};

export default DropdownFieldWithLabel;
