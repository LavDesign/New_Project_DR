import React, { useEffect, useState, useRef } from 'react';
import CustomModal from '../UI/CustomModal';
import { useTranslation } from 'react-i18next';
import styles from '../../_theme/modules/shared/PlatformBudget.module.css';
import Spinner from 'common/SmallSpinner';
import {
  convertDateToUTC,
  showLocalCurrrencySymbol,
} from '_helpers/columns/cellFormatters';
import {
  saveAdSetBudgetPlatform,
  saveCampaignBudgetPlatform,
} from '_services/platformBudget';
import {
  trackButtonClick,
  getPageCategory,
  pageSubCategory,
} from '_helpers/Utils/segmentAnalyticsUtil';
import { evaluatePlatform } from '_helpers/Utils/availablePlatformsInfo';

export const numberToCurrencyFormat = (value) => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const validateBudgetAmount = (val) => {
  const regex = /([0-9]*[\.|\,]{0,1}[0-9]{0,2})/s;
  const decimalVal = val?.match(regex)[0];
  val = isNaN(decimalVal) || decimalVal === '0' ? '' : decimalVal;
  const hasDecimal = val.includes('.');
  const decimalValue = (hasDecimal ? val.split('.') : [val, ''])[1];
  if (decimalValue.length > 0) {
    const splittedVal = val.split('.');
    val = splittedVal[1] > 0 ? val * 1 : val;
  }
  return val;
};

export const PlatformBudgetContainer = ({
  data,
  handleRowEdit,
  handleInputChange,
  handleOnBlur,
  editableRow,
  cellField,
  budgetEditor,
  showLoaderButton,
  editableCol,
}) => {
  const { t } = useTranslation(['common']);

  return (
    <>
      <div
        className={`col col-sm-12 table-responsive ${styles['div_style']}`}
        data-testid='platform-segment'
        style={{ pointerEvents: showLoaderButton && 'none' }}
      >
        <table className={`table ${styles['table_style']}`}>
          <thead>
            <tr>
              <th scope='col' align='right'>
                {cellField === 'platform_campaign_budget'
                  ? t('header_names.campaign_name')
                  : t('model_data.ad_set_name')}
              </th>
              <th scope='col' align='right'>
                {cellField === 'platform_campaign_budget'
                  ? t('header_names.campaign_key')
                  : t('model_data.ad_set_id')}
              </th>
              {!evaluatePlatform(budgetEditor?.platformId) && (
                <th scope='col'>{t('model_data.budget_type')}</th>
              )}
              {
                <>
                  {budgetEditor?.recommendationAbility && (
                    <th scope='col'>
                      {t('header_names.budget_recommendation')}
                    </th>
                  )}
                  {!evaluatePlatform(budgetEditor?.platformId) && (
                    <th scope='col'>{t('model_data.platform_value')}</th>
                  )}
                </>
              }
              {evaluatePlatform(budgetEditor?.platformId) && (
                <>
                  <th scope='col'>{t('model_data.daily_budget')}</th>
                  <th scope='col'>{t('model_data.lifetime_budget')}</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {data?.map((row, i) => (
              <tr
                key={`Row_${row.campaignId || row.adSetKey}_${i}}`}
                className={styles['td_border']}
              >
                <td>
                  {cellField === 'platform_campaign_budget'
                    ? row.campaignName
                    : row.adSetName}
                </td>

                <td>
                  {cellField === 'platform_campaign_budget'
                    ? row.campaignKey
                    : row.adSetKey}
                </td>
                {!evaluatePlatform(budgetEditor?.platformId) && (
                  <td style={{ minWidth: '8rem' }}>{row.budgetType}</td>
                )}

                {budgetEditor?.recommendationAbility && (
                  <td
                    title={convertDateToUTC(
                      row?.budgetRecommendation?.json?.toolTip
                    )}
                    style={{ padding: '0px' }}
                  >
                    {row?.budgetRecommendation?.json &&
                    !['-', null].includes(
                      row.budgetRecommendation.json.value
                    ) ? (
                      <div className={styles['budget-padding']}>
                        <span>{`${showLocalCurrrencySymbol(
                          budgetEditor?.currency_code
                        )}${
                          showLocalCurrrencySymbol(budgetEditor?.currency_code)
                            ?.length > 1
                            ? ' '
                            : ''
                        }`}</span>
                        <span>
                          {numberToCurrencyFormat(
                            row.budgetRecommendation.json.value
                          )}
                        </span>
                      </div>
                    ) : (
                      <div className={styles['budget-padding']}>-</div>
                    )}
                  </td>
                )}
                <td
                  style={{ padding: '0px' }}
                  className={`${styles['td_border']} ${
                    row.isDailyError
                      ? styles['errorOutline']
                      : editableRow ===
                          (cellField === 'platform_campaign_budget'
                            ? row.campaignId
                            : row.adSetKey) && editableCol === 'daily'
                      ? styles['inputOutline']
                      : ''
                  }`}
                  onClick={() =>
                    [0, '0', ''].includes(row?.budgetValue)
                      ? null
                      : handleRowEdit(row, 'daily')
                  }
                >
                  {editableRow ===
                    (cellField === 'platform_campaign_budget'
                      ? row.campaignId
                      : row.adSetKey) && editableCol === 'daily' ? (
                    <input
                      className={`${styles['input-budget']}`}
                      value={row.budgetValue}
                      type='text'
                      onChange={(e) =>
                        handleInputChange(
                          e,
                          cellField === 'platform_campaign_budget'
                            ? row.campaignId
                            : row.adSetKey,
                          'daily'
                        )
                      }
                      onBlur={() => handleOnBlur()}
                      autoFocus={true}
                    />
                  ) : (
                    <div className={styles['budget-padding']}>
                      {[0, '0', ''].includes(row?.budgetValue) ? (
                        <span>-</span>
                      ) : (
                        <>
                          <span>{`${showLocalCurrrencySymbol(
                            budgetEditor?.currency_code
                          )}${
                            showLocalCurrrencySymbol(
                              budgetEditor?.currency_code
                            )?.length > 1
                              ? ' '
                              : ''
                          }`}</span>
                          <span>
                            {row?.budgetValue &&
                              numberToCurrencyFormat(row.budgetValue)}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </td>

                {evaluatePlatform(budgetEditor?.platformId) && (
                  <td
                    style={{ padding: '0px' }}
                    className={`${styles['td_border']} ${
                      row.isTotalError
                        ? styles['errorOutline']
                        : editableRow ===
                            (cellField === 'platform_campaign_budget'
                              ? row.campaignId
                              : row.adSetKey) && editableCol === 'total'
                        ? styles['inputOutline']
                        : ''
                    }`}
                    onClick={() =>
                      [0, '0', ''].includes(row?.totalBudgetValue)
                        ? null
                        : handleRowEdit(row, 'total')
                    }
                  >
                    {editableRow ===
                      (cellField === 'platform_campaign_budget'
                        ? row.campaignId
                        : row.adSetKey) && editableCol === 'total' ? (
                      <input
                        className={`${styles['input-budget']}`}
                        value={row.totalBudgetValue}
                        type='text'
                        onChange={(e) =>
                          handleInputChange(
                            e,
                            cellField === 'platform_campaign_budget'
                              ? row.campaignId
                              : row.adSetKey,
                            'total'
                          )
                        }
                        onBlur={() => handleOnBlur()}
                        autoFocus={true}
                      />
                    ) : (
                      <div className={styles['budget-padding']}>
                        {[0, '0', ''].includes(row?.totalBudgetValue) ? (
                          <span>-</span>
                        ) : (
                          <>
                            <span>{`${showLocalCurrrencySymbol(
                              budgetEditor?.currency_code
                            )}${
                              showLocalCurrrencySymbol(
                                budgetEditor?.currency_code
                              )?.length > 1
                                ? ' '
                                : ''
                            }`}</span>
                            <span>
                              {row?.totalBudgetValue &&
                                numberToCurrencyFormat(row.totalBudgetValue)}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.map((item) =>
        item.displayErrorMsg ? (
          <div className={`${styles['errorText']}`}>
            <span style={{ fontWeight: 'bold' }}>
              {cellField === 'platform_campaign_budget'
                ? `${item.campaignName}: `
                : `${item.adSetName}: `}
            </span>
            {item.displayErrorMsg}
          </div>
        ) : null
      )}
    </>
  );
};


const PlatformBudget = ({
  platformBudgetData,
  onModelClose,
  modalOpen,
  budgetEditor,
  updateDashboardData,
  setClearCampaignId
}) => {
  const { t } = useTranslation(['common']);
  const [data, setData] = useState(undefined);
  const [editableRow, setEditableRow] = useState(undefined);
  const [showLoaderButton, setShowLoaderButton] = useState(false);
  const [editableCol, setEditableCol] = useState(undefined);

  const copyData = useRef(null);

  useEffect(() => {
    return () => {
      setData(undefined);
      setEditableRow(undefined);
      setShowLoaderButton(false);
      copyData.current = null;
      setEditableCol(undefined);
    };
  }, []);

  useEffect(
    () =>
      platformBudgetData?.json
        ? setData(JSON.parse(JSON.stringify(platformBudgetData.json)))
        : setData(platformBudgetData),
    [platformBudgetData]
  );

  const onModalCancel = () => {
    onModelClose();
    setClearCampaignId(true);
    trackButtonClick(
      t('button_text.cancel'),
      `${getPageCategory()} ${pageSubCategory.platformBudgetModal}`
    );
  };

  const handleInputChange = (e, rowId, type) => {
    setData((prevState) =>
      prevState.map((item) =>
        (budgetEditor?.cellField === 'platform_campaign_budget'
          ? item.campaignId
          : item.adSetKey) !== rowId
          ? item
          : {
              ...item,
              budgetValue:
                type === 'daily'
                  ? validateBudgetAmount(e?.target?.value)
                  : item.budgetValue,
              totalBudgetValue:
                type === 'total'
                  ? validateBudgetAmount(e?.target?.value)
                  : item.totalBudgetValue,
              isDailyError: false,
              isTotalError: false,
              isCommonError: false,
              displayErrorMsg: null,
            }
      )
    );
  };

  const removeUnwantedData = (data) => {
    data.forEach((item) => {
      delete item.isDailyError;
      delete item.isTotalError;
      delete item.isCommonError;
      delete item.displayErrorMsg;
      delete item.cellField;
      delete item.currency_code;
      delete item.recommendationAbility;
      delete item.budgetRecommendation;
    });
    return data;
  };

  const getApiErrorMsg = (statusDescription) => {
    let dailyBudgetError = statusDescription;
    let totalBudgetError, commonError;
    if (evaluatePlatform(budgetEditor?.platformId)) {
      const getAttribute = statusDescription?.split('|');
      if (getAttribute) {
        const getCommonErrorStr = getAttribute
          .find(
            (str) =>
              !str.includes('total_budget_amount_local_micro;') &&
              !str.includes('daily_budget_amount_local_micro;')
          )
          ?.split(';');
        commonError = getCommonErrorStr?.slice(1)?.join(', ');
        const getDailyErrorStr = getAttribute
          .find((str) => str.includes('daily_budget_amount_local_micro'))
          ?.split(';');
        dailyBudgetError = getDailyErrorStr?.slice(1)?.join(', ');
        const getTotalErrorStr = getAttribute
          .find((str) => str.includes('total_budget_amount_local_micro'))
          ?.split(';');
        totalBudgetError = getTotalErrorStr?.slice(1)?.join(', ');
      }
    }
    return { dailyBudgetError, totalBudgetError, commonError };
  };

  const getDataAfrError = (item, statusDescription) => {
    const { dailyBudgetError, totalBudgetError, commonError } = getApiErrorMsg(
      statusDescription
    );
    return {
      ...item,
      isDailyError: dailyBudgetError ? true : false,
      isTotalError: totalBudgetError ? true : false,
      isCommonError: commonError ? true : false,
      displayErrorMsg: `${dailyBudgetError ? `${dailyBudgetError}` : ''}${
        dailyBudgetError && totalBudgetError ? ', ' : ''
      }${totalBudgetError ? `${totalBudgetError}` : ''}${
        commonError && (totalBudgetError || dailyBudgetError) ? ', ' : ''
      }${commonError ? `${commonError}` : ''}`,
    };
  };

  const handleSaveApiRes = (response) => {
    if (response) {
      const { statusCode, columns, statusDescription } = response;
      if (statusCode === 200 && columns?.length) {
        onModelClose(columns);
      } else {
        setShowLoaderButton(false);
        const updatedData = copyData.current.map((item) => {
          return getDataAfrError(item, statusDescription);
        });
        setData(updatedData);
        columns?.length && updateDashboardData(columns);
      }
    }
  };

  const handleSavePlaformBudgetData = (data) => {
    trackButtonClick(
      t('button_text.ok'),
      `${getPageCategory()} ${pageSubCategory.platformBudgetModal}`
    );
    copyData.current = JSON.parse(JSON.stringify(data));
    setShowLoaderButton(true);
    const payload = removeUnwantedData(data);
    if (budgetEditor?.cellField === 'platform_ad_set_budget') {
      payload.forEach((item) => {
        item.campaignId = budgetEditor?.campaignSelectedId;
      });
      saveAdSetBudgetPlatform(payload).then((response) =>
        handleSaveApiRes(response)
      );
    } else {
      saveCampaignBudgetPlatform(payload).then((response) =>
        handleSaveApiRes(response)
      );
    }
  };

  const saveBudgetData = () => {
    if (data.length && budgetEditor) {
      const payloadData = data.map((item) => {
        return {
          ...item,
          ...budgetEditor,
        };
      });
      setEditableRow(undefined);
      setEditableCol(undefined);
      handleSavePlaformBudgetData(payloadData);
    }
  };

  const handleOnBlur = () => {
    const id = budgetEditor?.cellField === 'platform_campaign_budget'
      ? 'campaignId'
      : 'adSetKey';
    setData((prevState) =>
      prevState.map((item) => {
        return {
          ...item,
          budgetValue:
            item.budgetValue === ''
              ? platformBudgetData?.json.find((data) => data[id] === item[id])
                  ?.budgetValue
              : Number(item.budgetValue),
          totalBudgetValue:
            item.totalBudgetValue === ''
              ? platformBudgetData?.json.find((data) => data[id] === item[id])
                  ?.totalBudgetValue
              : Number(item.totalBudgetValue),
        };
      })
    );
    setEditableRow(undefined);
    setEditableCol(undefined);
  };

  const displayModel = () => {
    return (
      <CustomModal
        open={modalOpen}
        onClose={() => onModalCancel()}
        onAccept={() => saveBudgetData()}
        title={t('model_data.platform_budget')}
        onSaveText={t('button_text.ok')}
        onCloseText={t('button_text.cancel')}
        disabledOkButton={!data}
        showLoaderButton={showLoaderButton}
        disabledCancelButton={showLoaderButton}
        modalWidth='93%'
        modalBodyClass={{ padding: '1rem' }}
      >
        {data ? (
          data.message ? (
            <span className={`${styles['errorText']}`}>{data.message}</span>
          ) : (
            <PlatformBudgetContainer
              data={data}
              handleRowEdit={(row, inputCellType) => {
                setEditableRow(
                  budgetEditor?.cellField === 'platform_campaign_budget'
                    ? row.campaignId
                    : row.adSetKey
                );
                setEditableCol(inputCellType);
              }}
              handleInputChange={handleInputChange}
              handleOnBlur={handleOnBlur}
              editableRow={editableRow}
              cellField={budgetEditor?.cellField}
              budgetEditor={budgetEditor}
              showLoaderButton={showLoaderButton}
              editableCol={editableCol}
            />
          )
        ) : (
          <Spinner />
        )}
      </CustomModal>
    );
  };
  return <>{modalOpen && displayModel()}</>;
};

export default PlatformBudget;
