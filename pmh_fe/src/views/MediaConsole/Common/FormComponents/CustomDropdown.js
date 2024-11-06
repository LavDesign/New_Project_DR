import { customEmptyComponent } from '_helpers/Utils/mediaConsoleUtil';
import SearchComponent from 'views/MediaConsole/Common/FormComponents/SearchComponent';
import 'views/MediaConsole/Common/FormComponents/CustomDropdown.scss';


const customDropDownComponent = (
  isData,
  titleTextObj,
  searchValue,
  searchFn,
  dropdownUserRef,
  dataType,
  headerComponent,
  bodyComponent
) => {
  return (
    <div className='item-container' ref={dropdownUserRef}>
      <SearchComponent
        searchValue={searchValue}
        onSearchText={(event) => searchFn(event)}
        placeholderText={`Search for ${dataType}`}
        clearSearch={() => searchFn({ target: { value: '' } })}
      />
      <div className='list-container'>
        {headerComponent}
        {isData
           ? bodyComponent
          : customEmptyComponent(titleTextObj)}
      </div>
    </div>
  );
};

export { customDropDownComponent };
