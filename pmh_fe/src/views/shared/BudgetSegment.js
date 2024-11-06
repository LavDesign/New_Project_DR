import React, { useEffect, useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import CustomModal from '../UI/CustomModal';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useStore } from '../../_helpers/storeContext';
import CloseIcon from '@mui/icons-material/Close';
import styles from '../../_theme/modules/shared/BudgetSegment.module.css';
import { useUserViews } from '../../_helpers/userViewsContext';
import { showLocalCurrrencySymbol } from '_helpers/columns/cellFormatters';
import {
  trackButtonClick,
  getPageCategory,
  pageSubCategory,
} from '_helpers/Utils/segmentAnalyticsUtil';
import { Platform } from '_helpers/Utils/availablePlatformsInfo';

import '_theme/modules/shared/GrooveDatePicker.scss';
import BulkOperationWarning from 'views/campaignDash/BulkComponents/BulkOperationWarning';
import { BULK_WARNING_MODEL } from 'common/Redux/Constants';
import { BULK_EDIT_OPTIONS } from 'views/campaignDash/BulkComponents/BulkEdit';
import Spinner from 'common/SmallSpinner';

export const numberToCurrencyFormat = (value) =>
  value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const getEndDate = (data) =>
  data?.[0]?.endDate &&
  `${moment(data[data.length - 1].endDate).format('MMM-DD-YYYY')}`;

export const totalBudget = (data) =>
  numberToCurrencyFormat(
    data.reduce((a, v) => (a = a + v?.pacingBudget * 1), 0)
  );

export const totalSpend = (data) =>
  numberToCurrencyFormat(data.reduce((a, v) => (a = a + v?.spend * 1), 0));

const BudgetSegmentBackdrop = (props) => {
  return (
    <div className={styles.backdrop} onClick={props.onClick}>
      {' '}
    </div>
  );
};

export const validateBudgetAmount = (val) => {
  const regex = /([0-9]*[\.|\,]{0,1}[0-9]{0,2})/s;
  const decimalVal = val?.match(regex)[0];
  val = isNaN(decimalVal) ? '' : decimalVal;
  const hasDecimal = val.includes('.');
  const decimalValue = (hasDecimal ? val.split('.') : [val, ''])[1];
  if (decimalValue.length > 0) {
    const splittedVal = val.split('.');
    val = splittedVal[1] > 0 ? val * 1 : val;
  }
  return val;
};

export const BudgetSegmentContainer = (props) => {
  const {
    data,
    handleRowEdit,
    handleInputChange,
    handleOnBlur,
    handleDateChange,
    handleRemoveRow,
    isEdit,
    error,
    validation,
    editableRow,
    editablecolumn,
    validationErrorMsg,
    handleAddSegment,
    budgetCurrencyCode,
  } = props;
  const { t } = useTranslation(['common']);

  const createDate = (dateStr) => {
    const dateParts = dateStr.split('-');
    const year = parseInt(dateParts[0], 10);
    const mon = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[2], 10);

    return new Date(year, mon, day);
  };

  return (
    <>
      <div
        className='col col-sm-12 table-responsive'
        data-testid='budget-segment'
      >
        <table className='table'>
          <thead>
            <tr>
              <th scope='col' align='right'>
                {t('header_names.spend')}
              </th>
              <th scope='col' align='right'>
                {t('header_names.pacing_budget')}
              </th>
              <th scope='col'>{t('header_names.start_date')}</th>
              <th scope='col'>{t('header_names.end_date')}</th>
              <th align='right'>{t('header_names.notes')}</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((row, i) => (
                <tr
                  key={row?.campaignSelectedId + '_' + row?.id}
                  className={styles['td_border']}
                >
                  <td className={`${styles['width_205']}`}>
                    <span>{`${showLocalCurrrencySymbol(budgetCurrencyCode)}${
                      showLocalCurrrencySymbol(budgetCurrencyCode)?.length > 1
                        ? ' '
                        : ''
                    }`}</span>
                    <span className={styles['float_right']}>
                      {row?.spend && numberToCurrencyFormat(row.spend)}
                    </span>
                  </td>
                  <td
                    name='pacingBudget'
                    className={`${styles['width_205']} ${styles['td-padding']} ${styles['td_border']} ${styles['cursor_pointer']}`}
                    onClick={(e) => handleRowEdit(e, row)}
                  >
                    {isEdit &&
                    editableRow !== null &&
                    editableRow === row?.id &&
                    editablecolumn &&
                    editablecolumn === 'pacingBudget' ? (
                      <input
                        className={`${styles['input']} ${styles['input-budget']}`}
                        value={row?.pacingBudget}
                        type='text'
                        onChange={(e) =>
                          handleInputChange(e, 'pacingBudget', row?.id)
                        }
                        onBlur={(e) => handleOnBlur(e, 'pacingBudget', row?.id)}
                      />
                    ) : (
                      <>
                        <span>{`${showLocalCurrrencySymbol(
                          budgetCurrencyCode
                        )}${
                          showLocalCurrrencySymbol(budgetCurrencyCode)?.length >
                          1
                            ? ' '
                            : ''
                        }`}</span>
                        <span className={`${styles['float_right']}`}>
                          {row?.pacingBudget &&
                            numberToCurrencyFormat(row.pacingBudget)}
                        </span>
                      </>
                    )}
                  </td>

                  <td
                    name='startDate'
                    className={`${styles['width_182']}`}
                    onClick={(e) => handleRowEdit(e, row)}
                  >
                    {isEdit &&
                    editableRow !== null &&
                    editableRow === row?.id &&
                    editablecolumn &&
                    editablecolumn === 'startDate' ? (
                      <div className={`${styles['position_absolute']}`}>
                        <DatePicker
                          inline
                          selectsRange
                          calendarClassName="groove-date-picker"
                          selected={createDate(row?.startDate)}
                          onChange={(e) =>
                            handleDateChange(
                              'startDate',
                              e,
                              row?.id,
                              row?.startDate,
                              row?.endDate
                            )
                          }
                        />
                      </div>
                    ) : (
                      row?.startDate &&
                      `${moment(row.startDate).format('MMM-DD-YYYY')}`
                    )}
                  </td>
                  <td
                    name='endDate'
                    className={`${styles['width_182']}`}
                    onClick={(e) => handleRowEdit(e, row)}
                  >
                    {isEdit &&
                    editableRow !== null &&
                    editableRow === row?.id &&
                    editablecolumn &&
                    editablecolumn === 'endDate' ? (
                      <div className={`${styles['position_absolute']}`}>
                        <DatePicker
                          inline
                          selectsRange
                          calendarClassName="groove-date-picker"
                          selected={createDate(row?.endDate)}
                          onChange={(e) =>
                            handleDateChange(
                              'endDate',
                              e,
                              row?.id,
                              row?.startDate,
                              row?.endDate
                            )
                          }
                        />
                      </div>
                    ) : (
                      row?.endDate &&
                      `${moment(row.endDate).format('MMM-DD-YYYY')}`
                    )}
                  </td>
                  <td
                    name='notes'
                    className={`${styles['width_182']} ${styles['td-padding']} ${styles['td_border']} ${styles['cursor_pointer']}`}
                    onClick={(e) => handleRowEdit(e, row)}
                  >
                    {isEdit &&
                    editableRow !== null &&
                    editableRow === row?.id &&
                    editablecolumn &&
                    editablecolumn === 'notes' ? (
                      <input
                        className={`${styles['input']} ${styles['input-notes']}`}
                        value={row?.notes}
                        type='text'
                        onChange={(e) => handleInputChange(e, 'notes', row?.id)}
                        onBlur={(e) => handleOnBlur(e, 'pacingBudget', row?.id)}
                      />
                    ) : (
                      <span className='d-inline-block text-truncate'>
                        {row?.notes}
                      </span>
                    )}
                  </td>
                  <td
                    className={`${styles['width_10']} ${styles['cursor_pointer']}`}
                  >
                    <CloseIcon onClick={() => handleRemoveRow(row?.id)} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {error && (
          <span className={`${styles['errorText']}`}>
            End date should be greater than start date.
          </span>
        )}
        {validation && (
          <span className={`${styles['errorText']}`}>{validationErrorMsg}</span>
        )}
      </div>
      <div className='col col-sm-12 table-responsive'>
        <table className='table'>
          <tbody>
            <tr>
              <td
                className={`${
                  data.length > 0 ? styles['width_205'] : styles['width_100px']
                }`}
              >
                <span className={styles['font_bold']}>Total</span>
                <span className={styles['float_right']}>
                  {`${showLocalCurrrencySymbol(budgetCurrencyCode)}${
                    showLocalCurrrencySymbol(budgetCurrencyCode)?.length > 1
                      ? ' '
                      : ''
                  }${totalSpend(data)}`}
                </span>
              </td>
              <td
                align='right'
                className={
                  data.length > 0 ? styles['width_205'] : styles['width_noData']
                }
              >
                {`${showLocalCurrrencySymbol(budgetCurrencyCode)}${
                  showLocalCurrrencySymbol(budgetCurrencyCode)?.length > 1
                    ? ' '
                    : ''
                }${totalBudget(data)}`}
              </td>
              <td className={styles['width_182']}>
                {data?.[0]?.startDate &&
                  `${moment(data[0].startDate).format('MMM-DD-YYYY')}`}
              </td>
              <td className={styles['width_182']}>{getEndDate(data)}</td>
              <td align='right' className={styles['width_232']}></td>
            </tr>
          </tbody>
        </table>
      </div>{' '}
      <a
        onClick={handleAddSegment}
        rel='noopener noreferrer'
        className={`policy ${styles['cursor_pointer']}`}
        data-testid='budget-segment-add-segment'
      >
        {t('button_text.add_segment')}
      </a>
    </>
  );
};
const BudgetSegment = ({
  budgetSegmentData,
  setOpenModal,
  modalOpen,
  saveData,
  budgetSegment,
  bulkOperation,
  dispatch,
  setClearCampaignId
}) => {
  const { t } = useTranslation(['common']);
  const { store } = useStore();
  const [data, setData] = useState(undefined);
  const [isEdit, setIsEdit] = useState(false);
  const [editableRow, setEditableRow] = useState(null);
  const [editablecolumn, setEditableColumn] = useState(null);
  const [error, setError] = useState(false);
  const [validation, setValidation] = useState(false);
  const [validationErrorMsg, setValidationErrorMsg] = useState('');
  const selectedUser = useMemo(() => store.selectedDash, [store.selectedDash]);
  const { userSelectedView } = useUserViews();

  const { budgetCurrencyCode, platformId, campaignSelectedId } = budgetSegment;

  useEffect(() => {
    return () => {
      setData(undefined);
    };
  }, []);

  useEffect(
    () =>
      budgetSegmentData?.json
        ? setData(JSON.parse(JSON.stringify(budgetSegmentData.json.sort((a, b) => { 
          return new Date(a.startDate) - new Date(b.startDate)}))))
        : setData(budgetSegmentData),
    [budgetSegmentData]
  );

  const handleInputChange = (e, column, rowId) => {
    let val = e.target.textContent || e.target.value;
    if (column === 'pacingBudget') val = validateBudgetAmount(val);

    setData((prevState) =>
      prevState.map((item) =>
        item.id !== rowId
          ? item
          : column === 'pacingBudget'
          ? { ...item, pacingBudget: val }
          : { ...item, notes: val }
      )
    );
  };

  const handleRowEdit = (event, row) => {
    setIsEdit(true);
    setEditableRow(row?.id);
    let columnName =
      event.target.getAttribute('name') ||
      event.target.parentElement.getAttribute('name');
    if (columnName) setEditableColumn(columnName);
  };

  const validateData = () => {
    let message = '';
    data.forEach((i, idx) => {
      if (message === '') {
        if (moment(i.startDate).isAfter(moment(i.endDate)))
          message = 'End date should be greater than start date.';
        else if (!i.startDate) message = 'Start date can not be blank';
        else if (!i.endDate) message = 'End date can not be blank';
        else if (
          idx > 0 &&
          moment(i.startDate).isSameOrBefore(moment(data[idx - 1].endDate))
        )
          message = 'You can not have overlapping segments';
        else if (i.pacingBudget <= 0)
          message = 'Billable budget can not be zero';
      }
    });

    if (message) {
      setValidation(true);
      setValidationErrorMsg(message);
    }
    return message;
  };

  const onAcceptHandler = () => {
    const message = validateData();
    if (!message) {
      saveData({ data, campaignSelectedId });
      setOpenModal(false);
    }
  };

  const onBtnHandler = () => {
    if (bulkOperation?.state) {
      dispatch({ type: BULK_WARNING_MODEL, payload: true });
    } else {
      onAcceptHandler();
    }
  };

  const onCloseHandler = () => {
    trackButtonClick(
      t('button_text.cancel'),
      `${getPageCategory()} ${pageSubCategory.budgetAndDatesModal}`
    );
    setOpenModal(false);
    setClearCampaignId(true);
  };

  const handleDateChange = (column, e, rowId, startDate, endDate) => {
    setData((prevState) =>
      prevState.map((item) => {
        if (item.id === rowId) {
          if (column === 'startDate')
            return { ...item, startDate: moment(e[0]).format('YYYY-MM-DD') };
          else return { ...item, endDate: moment(e[0]).format('YYYY-MM-DD') };
        } else return item;
      })
    );
    setEditableColumn(null);
  };

  const onBackdropClicked = () => {
    setIsEdit(false);
    setEditableColumn(null);
  };

  const handleOnBlur = () => {
    setData((prevState) =>
      prevState.map((item) => {
        return { ...item, pacingBudget: Number(item.pacingBudget) };
      })
    );
    setIsEdit(false);
    setEditableColumn(null);
  };

  const handleAddSegment = () => {
    trackButtonClick(
      t('button_text.add_segment'),
      `${getPageCategory()} ${pageSubCategory.budgetAndDatesModal}`
    );
    let id = 0;
    setEditableColumn(null);
    setEditableRow(false);

    var newRowDate;
    if (data.length > 0) {
      id = data.reduce((max, item) => (item.id > max ? item.id : max), 0) + 1;
      newRowDate = moment(data[data.length - 1].endDate);
      newRowDate.add(1, 'days');
    } 
    else 
        newRowDate = new Date();

    setData((prevState) => {
      return [
        ...prevState,
        {
          id: id,
          pacingBudget: 0,
          startDate: moment(newRowDate).format('YYYY-MM-DD'),
          endDate: moment(newRowDate).format('YYYY-MM-DD'),
          notes: '',
          spend: 0,
          campaignDashUserId: selectedUser.userId,
          campaignDashviewId: userSelectedView.viewId,
          platformId,
        },
      ];
    });
  };

  const handleRemoveRow = (rowId) => {
    setData((prevState) => prevState.filter((item) => item.id !== rowId));
  };

  useEffect(() => {
    if (data?.length && Array.isArray(data)) {
      let message = '';
      setValidationErrorMsg(message);
      validateData();
    }
  }, [data]);

  return (
    <>
      {modalOpen && (
        <CustomModal
          open={modalOpen}
          onClose={onCloseHandler}
          onAccept={onBtnHandler}
          title={`${
            bulkOperation?.option === BULK_EDIT_OPTIONS.PACING
              ? `${t('modal_text.bulk')} ${t('modal_text.edit')}:`
              : ''
          } ${t('site_titles.budget_and_dates')}`}
          onSaveText={t('button_text.ok')}
          onCloseText={t('button_text.cancel')}
          disabledOkButton={!data}
        >
          <BulkOperationWarning onButtonClick={() => onAcceptHandler()} />
          {isEdit &&
            editableRow !== null &&
            editablecolumn &&
            (editablecolumn === 'startDate' ||
              editablecolumn === 'endDate') && (
              <BudgetSegmentBackdrop onClick={onBackdropClicked} />
            )}
          {data ? (
            data.message ? (
              <span className={`${styles['errorText']}`}>{data.message}</span>
            ) : (
              <BudgetSegmentContainer
                data={data}
                handleRowEdit={handleRowEdit}
                handleInputChange={handleInputChange}
                handleOnBlur={handleOnBlur}
                handleDateChange={handleDateChange}
                handleRemoveRow={handleRemoveRow}
                isEdit={isEdit}
                error={error}
                validation={validation}
                editableRow={editableRow}
                editablecolumn={editablecolumn}
                validationErrorMsg={validationErrorMsg}
                handleAddSegment={handleAddSegment}
                budgetCurrencyCode={budgetCurrencyCode}
                bulkOperation={bulkOperation}
              />
            )
          ) : (
            <Spinner />
          )}
        </CustomModal>
      )}
    </>
  );
};
export default BudgetSegment;
