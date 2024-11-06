import React from 'react';
import PropTypes from 'prop-types';

import SearchInput from '../UI/SearchInput';
import { useTranslation } from 'react-i18next';

const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  classSeachInput,
  placeholderText,
  style,
  inputSearchStyle
}) => {
  const count = preGlobalFilteredRows?.length;
  const { t } = useTranslation(['common']);
  return (
    <SearchInput
      placeholderText={placeholderText || `${count} ` + t('button_text.records')}
      inputValue={globalFilter || ''}
      onChangeHandler={(e) => {
        setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      classSeachInput={classSeachInput}
      inputSearchStyle={inputSearchStyle}
      style={style}
    />
  );
};

GlobalFilter.propTypes = {
  preGlobalFilteredRows: PropTypes.array.isRequired,
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func.isRequired,
};

export default GlobalFilter;
