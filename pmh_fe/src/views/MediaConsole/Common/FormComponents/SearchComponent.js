import { PUBLICURL } from '_helpers/Utils/dashboardUtil';
import './SearchComponent.scss';
import SearchIconImage from './SearchIconImage';

const SearchComponent = ({
  searchValue,
  onSearchText,
  placeholderText = 'Search',
  clearSearch,
  customClass,
}) => {
  return (
    <div className={`search-container ${customClass ? customClass : ''}`}>
      <div className={`search-field`}>
        <SearchIconImage />
        <input
          type='text'
          className='search-input-text'
          placeholder={placeholderText}
          value={searchValue || ''}
          onChange={(event) => onSearchText(event)}
        />
        {searchValue && (
          <button className='clear-search' onClick={() => clearSearch()}>
            <img
              src={`${window.location.origin}${PUBLICURL}/assets/icons/clear-search.svg`}
              alt='Clear'
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
