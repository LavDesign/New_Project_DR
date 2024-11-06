import _ from "underscore";
import moment from 'moment-timezone';
import { Platform, getPlatformsInfo, getPlatformsInfoById } from '../Utils/availablePlatformsInfo';
import { kpiMetrics } from './campaignDash';
import styles from '../../_theme/modules/shared/Table.module.css';
import PublisherComponent from "./PublisherComponent";
import { standardKpiMetricsFields as standardKpiFB } from '_helpers/columns/facebook';
import { standardKpiMetricsFields as standardKpiGA } from '_helpers/columns/googleads';
import { standardKpiMetricsFields as standardKpiDV360 } from '_helpers/columns/googledv360';
import { standardKpiMetricsFields as standardKpiSA360 } from '_helpers/columns/googlesa360';
import { standardKpiMetricsFields as standardKpiLI } from '_helpers/columns/linkedin';
import { evaluatePlatform } from "../Utils/availablePlatformsInfo";
import { currencyColumn } from "_helpers/Utils/dashboardUtil";
import { PUBLICURL } from "../Utils/dashboardUtil";

const showNull = '-';
const everythingElseText = 'Everything else';

// * Campaign Dash Formatters
export const dateCellRender = (val) => !val ? showNull : moment(val).format('MMM-DD-YYYY');

export const datewithTimeCellRender = (val) => !val ? showNull : moment.utc(val).local().format('DD/MM/YYYY hh:mm a');

export const stringOrMixedAggregateFunction = (columnId, vals) => {
  const newVals = vals.map(val => val.getValue(columnId))
  const isEqual = (currentValue) => currentValue === newVals[0];
  return newVals.every(isEqual) ? vals[0].getValue(columnId) !== '' && !_.isUndefined(vals[0].getValue(columnId)) ? vals[0].getValue(columnId) : "-" : "Mixed"
} //what to display if free text value is blank

const areEqual = (columnId, vals) =>
  vals.every((value, index, array) =>
    value.getValue(columnId) === array[0].getValue(columnId));

export const publisherOrMixedAggregateFunction = (columnId, vals) => {
  if (_.isUndefined(vals) || vals === '') return showNull;
  const platformInfo = getPlatformsInfo(vals?.[0]?.getValue(columnId)?.toLowerCase());
  const newVals = vals.map(val => val.getValue(columnId))
  const isEqual = (currentValue) => currentValue === newVals[0];
  return !newVals.every(isEqual) ? "Mixed"
    : platformInfo ? <span className="publisher-text">
      <img src={`${window.location.origin}${PUBLICURL}/assets/icons/${platformInfo.icon}`} className={styles['table-publisher-icon']} alt={vals?.[0]?.getValue(columnId)} /> {vals?.[0]?.getValue(columnId)}</span> : showNull;
}

export const showLocalCurrrencySymbol = (currency_code) => {
  if (currency_code) {
    const options = {
      style: 'currency',
      currency: currency_code,
    };
    const numberFormat = new Intl.NumberFormat('en-US', options);

    return numberFormat
      .formatToParts(undefined)
      ?.filter((item) => item.type === 'currency')?.[0]?.value;
  }
  return "";
};

const showCurrencyString = (currency, newVals) => {
  return `${showLocalCurrrencySymbol(currency)}${parseFloat(
    newVals.reduce((acc, val) => Number(acc) + Number(val))
  )
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

const displayBudgetRecomCell = (_vals, newVals, currencyList) => {
    const uniqueBudgetValues = _.uniq(newVals);
    if (uniqueBudgetValues.every((value) => value === "-")) return "-";
    else if (
        currencyList.length > 1 ||
        uniqueBudgetValues.some((value) => value === "-")
    )
        return "Mixed";
    return showCurrencyString(currencyList[0], newVals);
};

const displayPlatformBudgetCell = (_vals, newVals, currencyList) => {
  const uniqueBudgetValues = _.uniq(newVals);
  if (uniqueBudgetValues.every((value) => value === '-')) return '-';
  else if (uniqueBudgetValues.every((value) =>  value?.toString().includes('|'))) {
    if (currencyList.length > 1) return 'Mixed';
    const result = newVals.reduce(
      (acc, value) => {
        const [left, right] = value?.toString().split('|').map(Number);
        acc.leftSum += isNaN(left) ? 0 : left;
        acc.rightSum += isNaN(right) ? 0 : right;
        return acc;
      },
      { leftSum: 0, rightSum: 0 }
    );
    let retVal = '';
    if (![0, '0'].includes(result?.leftSum) && [0, '0'].includes(result?.rightSum))
      retVal = `${formatNumberToCurrency(
        parseFloat(result?.leftSum).toFixed(2),
        currencyList[0]
      )}`;
    else if (![0, '0'].includes(result?.rightSum) && [0, '0'].includes(result?.leftSum)) 
      retVal = `${formatNumberToCurrency(
        parseFloat(result?.rightSum).toFixed(2),
        currencyList[0]
      )}`;
    else if (![0, '0'].includes(result?.leftSum) && ![0, '0'].includes(result?.rightSum))
      retVal = `D: ${formatNumberToCurrency(
        parseFloat(result?.leftSum).toFixed(2),
        currencyList[0]
      )}; L: ${formatNumberToCurrency(
        parseFloat(result?.rightSum).toFixed(2),
        currencyList[0]
      )}`;
    else
      retVal = '-';

    return retVal;

  } else if (
    uniqueBudgetValues.some(
      (value) =>
        value?.toString().includes('|') ||
        value === '-' ||
        value === '0' ||
        value === 'Mixed'
    ) ||
    currencyList.length > 1
  )
    return 'Mixed';
  return showCurrencyString(currencyList[0], newVals);
};

const customizedStrCurrency = (col, vals, newVals, currencyList) => {
  switch (col) {
    case 'budget_recommendation':
    case 'ad_set_budget_recommendation':
      return displayBudgetRecomCell(vals, newVals, currencyList);
    case 'platform_campaign_budget':
    case 'platform_ad_set_budget':
      return displayPlatformBudgetCell(vals, newVals, currencyList);
  }
};

export const showValueOrEmpty = (value) => (_.isUndefined(value) || _.isNull(value) || value === '') ? '' : value;

export const numberOrMixedAggregateFunction = (
  columnId,
  childRows,
  isInteger = false
) => {
  let vals = childRows;
  const isCurrencySupportCol = currencyColumn.includes(columnId);
  const currencyCodeList = vals.map((val) => val?.original?.currency_code);
  let uniqueCurrencyCodeList = _.uniq(currencyCodeList);

  const newVals = vals.map((val) =>
    val.getValue(columnId) === '' ||
    _.isNull(val.getValue(columnId)) ||
    _.isUndefined(val.getValue(columnId))
      ? 0
      : val.getValue(columnId)
  );

  // Below statements are added to handle logic for custom column
  const customCell = [
    'budget_recommendation',
    'ad_set_budget_recommendation',
    'platform_campaign_budget',
    'platform_ad_set_budget',
  ].includes(columnId)
    ? customizedStrCurrency(columnId, vals, newVals, uniqueCurrencyCodeList)
    : undefined;
  if (customCell) return customCell;

  const uniqueValues = _.uniq(newVals);
  if (uniqueValues.length === 1 && uniqueValues[0] === 0) return "";

  // To show Mixed for differt currency symbol in currency support column
  uniqueCurrencyCodeList = uniqueCurrencyCodeList.filter((code) => code !== null && code !== undefined);
  if (isCurrencySupportCol && uniqueCurrencyCodeList.length > 1) return 'Mixed';

  return isInteger
    ? parseFloat(newVals.reduce((acc, val) => Number(acc) + Number(val)))
    : showCurrencyString(uniqueCurrencyCodeList[0], newVals);
};

export const formatNumberToCurrency = (value, code) => {
  const numValue = Number(value);
  const data = isNaN(numValue) ? 0 : numValue;
  if (_.isUndefined(code) || _.isNull(code))
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(data);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(data);
};

export const numberToCurrency = (cell, excelData = false) => {
  if (excelData) {
    const { rowData, value } = cell;
    if (_.isNull(value) || value === '') return '';
    else if (value === 'Mixed') return value;
    return formatNumberToCurrency(
      parseFloat(value).toFixed(2),
      rowData?.currency_code
    );
  }
  if (_.isNull(cell.getValue()) || cell.getValue() === '') return '';
  else if (cell.getValue() === 'Mixed') return cell.getValue();

  const {
    row: {
      original: { currency_code },
    },
  } = cell;

  return formatNumberToCurrency(
    parseFloat(cell.getValue()).toFixed(2),
    currency_code
  );
};

export const convertToPercentage = (value) => {
  if (_.isNull(value) || value === '') return '';
  const number = parseFloat(value);
  if (!number) return "0.00%";

  const percentage = ((number / 100) * 100).toFixed(2);

  return percentage > 100 ? "100.00%" : `${percentage}%`;
};

export const publisherIcon = (value) => {
  const platformInfo = _.isUndefined(value) || value === '' || (!value) ? null : getPlatformsInfo(value.toLowerCase());
  return <PublisherComponent platformInfo={platformInfo} styles={styles} showNull={showNull} value={value} />;
};

export const campaignNameIcon = (value, status) => {
  const statusIcon = _.isUndefined(value) || value === '' || (!value) ? null : status.toLowerCase();
  return statusIcon ? <span className="publisher-text">
    <img src={`${window.location.origin}${PUBLICURL}/assets/icons/status-${statusIcon}.svg`} className={styles['table-status-icon']} alt={status} />{value}</span> : showNull;
}

export const defaultTypeOrMicroCurrency = (value, groupedNullEmpty = false) =>
    _.isUndefined(value) || value === "" || _.isNull(value)
        ? groupedNullEmpty
            ? everythingElseText
            : showNull
        : value;

const TypeDefaults = {

  blankValue: "",
  mixedValue: "Mixed",
  rangeValue: "Range",
  blankAggregateValue: "None",
  blankNumericValue: 0,
  errorValue: "--",
  // NOTICE the inputFieldLength and textAreaLength are defined here aswell
  // as in slick.grid.adaptly-dist.js because we do not have access to these
  // variables when slickgrid is first loaded. Any changes made to the these
  // values must also be changed in the SlickGrid repo
  inputFieldLength: 500,
  textAreaLength: 5000,

  getAllDefaultValues() {
    return [
      TypeDefaults.blankValue,
      TypeDefaults.mixedValue,
      TypeDefaults.rangeValue,
      TypeDefaults.blankAggregateValue,
      TypeDefaults.blankNumericValue,
      TypeDefaults.errorValue,
      TypeDefaults.inputFieldLength,
      TypeDefaults.textAreaLength
    ];
  }
}

const ensureValueExists = (value, fn) => (_.isEmpty(value) || _.isUndefined(value) || _.isNull(value)) ? showNull : fn();

export const urlLink = (v, groupedNullEmpty = false) => {
    if (!v?.includes("accenture.com"))
        return _.isUndefined(v) || v === "" || _.isNull(v)
            ? groupedNullEmpty
                ? everythingElseText
                : showNull
            : v;
    else {
        return v === TypeDefaults.mixedValue
            ? v
            : ensureValueExists(v, () => (
                  <a
                      href={_.escape(v)}
                      className="cell-link"
                      target="_blank"
                      style={{ pointerEvents: "auto" }}
                  >
                      {_.escape(v)}
                  </a>
              ));
    }
};

export const nativeAppUrlLink = (platformName, showIcon = false) => {
  const platformValue = platformName.toLowerCase().replace(' ', '');
  const platformInfo = getPlatformsInfo(platformValue);
  let href = '';
  switch (platformValue) {
    case 'facebook':
      href = 'https://business.facebook.com/adsmanager';
      break;
    case 'googleads':
      href = 'https://ads.google.com/nav/selectaccount';
      break;
    case 'googledv360':
      href = 'https://displayvideo.google.com/ng_nav/partners';
      break;
    case 'linkedin':
      href = 'https://www.linkedin.com/campaignmanager/accounts';
      break;
    case 'googlesa360':
      href = 'https://searchads.google.com/nav/selectaccount';
      break;
  }

  const icon = <img src={`${window.location.origin}${PUBLICURL}/assets/icons/${platformInfo.icon}`} style={{ height: '16px', width: '16px', marginRight: '4px' }} alt={platformValue} />
  const link = ensureValueExists(platformName, () => <a href={_.escape(href)} className='cell-link' target='_blank'>{_.escape(platformName)}</a>);
  return <span>{showIcon ? icon : null}{link}</span>
}


export const statusColorizer = (value, chilRows) => {
  const vals = {
    'Completed': 'rgb(150,158,168)',
    'Not Spending': 'rgb(229,179,177)',
    'Paused': 'rgb(234,210,156)',
  };
  /*
    Below if block is added for pivot/grouping scenario
  */
  if (chilRows?.length > 1) {
    const uniqueStatusList = _.uniq(
      chilRows.map((val) => val?.original?.status)
    );
    if (uniqueStatusList.includes('Not Spending')) return vals['Not Spending'];
    else if (uniqueStatusList.includes('Paused')) return vals['Paused'];
    else if (uniqueStatusList.includes('Completed')) return vals['Completed'];
    return null;
  }

  return vals?.[value];
};


// * Management Table formatters
//TODO: Remove unnecessary functions when implementing Management Table
//TODO: Some of this functions could be removed because there is another similar function for Campaign Dash
export const sumAggregateFunction = (vals) => { return vals.reduce((acc, x) => acc + parseFloat(x || 0), 0) };

export const amountCellRender = (val) => { return _.isUndefined(val) || val === '' ? showNull : '$ ' + parseFloat(val).toFixed(2) };

export const avgDailySpendCalculator = (row, i) => { return _.isUndefined(row.runSchedule) ? NaN : row.costInUsd / Math.round((row.runSchedule.end - row.runSchedule.start) / (1000 * 60 * 60 * 24)); }

export const averageCPMCalculator = (row, i) => { return 1000 * row.costInUsd / row.impressions };

export const averageCPCCalculator = (row, i) => { return row.costInUsd * row.clicks };

export const averageCTRCalculator = (row, i) => { return row.clicks / row.impressions * 100 };

export const totalSocialActionsCalculator = (row, i) => { return row.reactions + row.comments + row.shares + row.follows };

export const engagementRateCalculator = (row, i) => { return row.totalEngagements / row.impressions * 100 };

export const conversionsRateCalculator = (row, i) => { return row.externalWebsiteConversions / row.clicks * 100 };

export const costPerConversionCalculator = (row, i) => { return row.costInUsd / row.externalWebsiteConversions };

export const returnOnAdSpendCalculator = (row, i) => { return row.conversionValueInLocalCurrency / row.costInUsd };

export const costPerLeadCalculator = (row, i) => { return row.costInUsd / row.oneClickLeads };

export const leadFormCompletionRateCalculator = (row, i) => { return row.oneClickLeads / row.oneClickLeadFormOpens };

export const viewRateCalculator = (row, i) => { return row.videoViews / row.impressions * 100 };

export const estimateCPVCalculator = (row, i) => { return row.costInUsd / row.videoViews };

export const completionRateCalculator = (row, i) => { return row.videoCompletions / row.videoViews * 100 };

export const viralVideoCompletionRateCalculator = (row, i) => { return row.viralVideoCompletions / row.viralVideoViews * 100 };

export const sponsoredMessagingClicksCalculator = (row, i) => { return row.actionClicks + row.adUnitClicks + row.textUrlClicks };

export const openRateCalculator = (row, i) => { return row.opens / row.sends * 100 };

export const clicksToOpenRateCalculator = (row, i) => { return row.clicks / row.opens * 100 };

export const costPerSendCalculator = (row, i) => { return row.costInUsd / row.sends };

export const costPerOpenCalculator = (row, i) => { return row.costInUsd / row.opens };

export const talentLeadRateCalculator = (row, i) => { return row.talentLeads / row.clicks * 100 };

export const costPerTalentLeadCalculator = (row, i) => { return row.costInUsd / row.talentLeads };

export const jobApplicationRateCalculator = (row, i) => { return row.jobApplications / row.adUnitClicks * 100 }

export const costPerJobApplicationCalculator = (row, i) => { return row.costInUsd / row.jobApplications };

export const statusDetailsFormatter = (row, i) => { return _.isUndefined(row.configured_status) && _.isUndefined(row.effective_status) ? '' : 'Configured: ' + row.configured_status + '; Actual: ' + row.effective_status };

export const valueOrMixedAggregateFunction = (vals) => { return vals.some((val, i) => isNaN(parseInt(val))) ? "Mixed" : vals[0] }

export const buyingTypeFormatter = (buying_type) => {
  let values = { 'AUCTION': 'Auction', 'RESERVED': 'Reserved' };
  return _.isUndefined(buying_type) ? '' : values[buying_type];
}

export const campaignObjectiveFormatter = (objective) => {
  let values = {
    'NONE': 'None',
    'LINK_CLICKS': 'Traffic',
    'PAGE_LIKES': 'Page likes',
    'VIDEO_VIEWS': 'Video views',
    'POST_ENGAGEMENT': 'Post engagement',
    'BRAND_AWARENESS': 'Brand awareness',
    'CANVAS_APP_ENGAGEMENT': 'Canvas app engagement',
    'CANVAS_APP_INSTALLS': 'Canvas app installs',
    'EVENT_RESPONSES': 'Event responses',
    'EXTERNAL': 'External',
    'LEAD_GENERATION': 'Lead generation',
    'LOCAL_AWARENESS': 'Local awareness',
    'MOBILE_APP_ENGAGEMENT': 'Mobile app engagement',
    'MOBILE_APP_INSTALLS': 'Mobile app installs',
    'OFFER_CLAIMS': 'Offer claims',
    'PRODUCT_CATALOG_SALES': 'Product catalog sales',
    'CONVERSIONS': 'Conversions',
    'REACH': 'Reach',
    'STORE_VISITS': 'Store Visits'
  }
  return _.isUndefined(objective) ? '' : values[objective]
}

export const specialAdCategoriesFormatter = (category) => {
  let values = {
    'NONE': 'None',
    'HOUSING': 'Housing',
    'EMPLOYMENT': 'Employment',
    'CREDIT': 'Credit'
  }
  return _.isUndefined(category) || _.isEmpty(category) ? '' : values[category]
}

export const billingEventFormatter = (key) => {
  let values = {
    'NONE': 'None',
    'CLICKS': 'Clicks',
    'IMPRESSIONS': 'Impressions',
    'APP_INSTALLS': 'App Installs',
    'PAGE_LIKES': 'Page Likes',
    'OFFER_CLAIMS': 'Offer Claims',
    'LINK_CLICKS': 'Link Clicks',
    'POST_ENGAGEMENT': 'Post Engagement',
    'VIDEO_VIEWS': 'Video Views',
  }
  return _.isUndefined(key) ? '' : values[key]
}

export const ageRangeFormatter = (key) => {
  if (_.isUndefined(key))
    return '';

  return key.age_min == 18 ? key.age_min + '+' : key.age_min + '-' + key.age_max;
}

export const targExpansion = (value) => _.isUndefined(value) || value.targeting_optimization !== 'expansion_all' ? '' : 'Expanded';

export const targetingArrayFormatter = (value, key) => _.isUndefined(value) || _.isUndefined(value[key]) ? '' : value[key].map(val => val.name).toString();

export const deliveryTypeFormatter = (key) => {
  let values = {
    'standard': 'Standard',
    'day_parting': 'Day Parting',
    'no_pacing': 'Accelerated',
    'disabled': 'Disabled',
  }
  return _.isUndefined(key) ? '' : values[key]
}

export const destinationTypeFormatter = (key) => {
  let values = {
    'WEBSITE': 'Website',
    'APP': 'App',
    'MESSENGER': 'Messenger',
    'APPLINKS_AUTOMATIC': 'Applinks Automatic',
    'UNDEFINED': '',
  }
  return _.isUndefined(key) ? '' : values[key]
}

export const frequencyCapFormatter = (value) => {
  return _.isUndefined(value) || _.isEmpty(value) ?
    '' : value[0].max_frequency + ' ' + value[0].event.toLowerCase() + ' per ' + value[0].interval_days + ' days';
}

export const gendersFormatter = (value) => {
  if (_.isUndefined(value) || _.isUndefined(value.genders))
    return 'All';

  return value.genders[0] === 1 ? 'M' : 'F';
}

export const locationTypeFormatter = (value) => {
  if (_.isUndefined(value) || _.isUndefined(value.location_types) || _.isEmpty(value.location_types))
    return '';

  let locationTypes = {
    everyone: 'Everyone in this location',
    home: 'People who live in this location',
    recent: 'People recently in this location',
    travel_in: 'People traveling in this location'
  };

  return _.contains(value.location_types, 'home') && _.contains(value.location_types, 'recent') ?
    locationTypes.everyone
    : locationTypes[value.location_types[0]]
}

export const placementsFormatter = (targeting) => {
  if (_.isUndefined(targeting))
    return '';

  let devicePlatformsOptions = { 'both': 'Desktop & Mobile', 'mobile': 'Mobile Only', 'desktop': 'Desktop Only' };
  let publisherPlatformsOptions = { 'facebook': 'Facebook', 'instagram': 'Instagram', 'audience_network': 'Audience Network', 'messenger': 'Messenger' }
  let fbPositionsOptions = { 'feed': 'Facebook News Feed', 'right_hand_column': 'Facebook Right Column', 'instant_article': 'Instant Article', 'instream_video': 'In-Stream Video', 'suggested_video': 'Suggested Video' }
  let instPositionsOptions = { 'stream': 'Instagram Feed', 'story': 'Instagram Stories' };

  let devPlatformString = _.isUndefined(targeting.device_platforms) || _.isEmpty(targeting.device_platforms) ? ''
    : (_.contains(targeting.device_platforms, 'mobile') && _.contains(targeting.device_platforms, 'desktop') ? devicePlatformsOptions['both'] : devicePlatformsOptions[targeting.device_platforms[0]])

  let pubPlatformString = _.isUndefined(targeting.publisher_platforms) || _.isEmpty(targeting.publisher_platforms) ? ''
    : targeting.publisher_platforms.map(platform => publisherPlatformsOptions[platform]).sort().join(', ');

  let fbPositionsString = _.isUndefined(targeting.facebook_positions) || _.isEmpty(targeting.facebook_positions) ? ''
    : targeting.facebook_positions.map(platform => fbPositionsOptions[platform]).sort().join(', ');

  let instPositionsString = _.isUndefined(targeting.instagram_positions) || _.isEmpty(targeting.instagram_positions) ? ''
    : targeting.instagram_positions.map(platform => instPositionsOptions[platform]).sort().join(', ');



  return [devPlatformString, pubPlatformString, fbPositionsString, instPositionsString].filter(x => x !== '').join(' | ');
};

export const arrayToStringFormatter = (value) => _.isUndefined(value) ? '' : JSON.stringify(value);

export const userDeviceFormatter = (value) => _.isUndefined(value) || _.isUndefined(value.user_device) || _.isEmpty(value.user_device) ? '' : value.user_device.join(', ');

export const wifiFormatter = (value) => _.isUndefined(value) || _.isUndefined(value.wireless_carrier) || !_.contains(value.wireless_carrier, 'Wifi') ? '' : 'Wifi';

export const userOSFormatter = (value) => _.isUndefined(value) || _.isUndefined(value.user_os) || _.isEmpty(value.user_os) ? '' : value.user_os.map(os => os.replace(/_/g, ' ')).join(', ');

export const bidAmountFormatter = (value) => _.isUndefined(value) ? '' : '$' + value;

export const eventFormatter = (value) => _.isUndefined(value) || _.isUndefined(value.event) ? '' : value.event;

export const isInlineFormatter = (value) => _.isUndefined(value) || _.isUndefined(value.is_inline) ? '' : value.is_inline;

export const offerIdFormatter = (value) => _.isUndefined(value) || _.isUndefined(value.offer_id) ? '' : value.offer_id;

export const trackingSpecsColsFormatters = (trackingSpecs, actionType, field) => {
  return _.isUndefined(trackingSpecs) || _.isEmpty(trackingSpecs) ? []
    : _.uniq(_.flatten(
      trackingSpecs.filter(spec => _.first(spec['action.type']) === actionType && !_.isUndefined(spec[field])).map(spec => spec[field])
    ))
}

export const previewLinkFormatter = (value) => _.isUndefined(value) ? '' : `https://www.facebook.com/?feed_demo_ad=${value}`;

export const mSpendCapFormatter = (value) => {
  let formatter = new Intl.NumberFormat('en')
  return _.isUndefined(value) ? '' : `$${formatter.format(value.substring(0, value.length - 2))}.${value.substring(value.length - 2, value.length)}`
}

export const statsDateCellAggregateFn = (columnId, vals) => {
  const newVals = vals.map(val => val.getValue(columnId) === '' || _.isNull(val.getValue(columnId)) || _.isUndefined(val.getValue(columnId)) ? '' : val.getValue(columnId));
  const isEqual = (currentValue) => moment.utc(currentValue).local().format('MMM-DD-YYYY hh:mm a') === moment.utc(newVals[0]).local().format('MMM-DD-YYYY hh:mm a');
  return newVals.every(isEqual) ? moment.utc(vals[0].getValue(columnId)).local().format('MMM-DD-YYYY hh:mm a') : 'Mixed';
}

export const statsDateCellRender = (val) => {
  return !val ? showNull : moment.utc(val).local().format('MMM-DD-YYYY hh:mm a');
}


export const dateDiffCellRender = (columnId, vals) => {
  let datesArr = vals.filter(x => x.getValue(columnId)).map(dateObj => { return dateObj.getValue(columnId) });
  let isEqual = "";
  if (!_.isNull(datesArr) && !_.isUndefined(datesArr) && datesArr.length !== 0) {
    datesArr = datesArr.sort((date1, date2) => { return new Date(date1) - new Date(date2) })
    isEqual = (currentValue) => currentValue === datesArr[0];
  }

  return _.isNull(datesArr) || _.isUndefined(datesArr) || datesArr.length === 0 ? showNull
    : datesArr.every(isEqual) ? moment(datesArr[0]).format('MMM-DD-YYYY')
      : moment(datesArr[0]).format('MMM-DD-YYYY') + ' - ' + moment(datesArr[datesArr.length - 1]).format('MMM-DD-YYYY')
}

export const singleNumberValueOrMixedCellRender = (columnId, vals) => vals.length > 1 ? 'Mixed' : vals[0].getValue(columnId)

export const singlePercentageValueOrMixedCellRender = (columnId, vals) => vals.length > 1 ? 'Mixed' : convertToPercentage(vals[0].getValue(columnId));

export const pacing = (columnId, vals) => {
  let aggAvgDailySpend = 0;
  let aggAvgDailyGoalSpend = 0;

  vals.map(val => {
    aggAvgDailySpend = aggAvgDailySpend + Number(val.original.average_daily_spend_lifetime);
    aggAvgDailyGoalSpend = aggAvgDailyGoalSpend + Number(val.original.average_daily_goal_spend);
  });

  return convertToPercentage((aggAvgDailySpend - aggAvgDailyGoalSpend) / aggAvgDailyGoalSpend);

}

export const budgetProgress = (columnId, vals, type) => {
  const newVals = vals.map(val => val.getValue(columnId) === '' || _.isNull(val.getValue(columnId)) || _.isUndefined(val.getValue(columnId)) ? 0 : val.getValue(columnId));
  const uniqueValues = _.uniq(newVals);
  if (uniqueValues.length === 1 && uniqueValues[0] === 0) return "";

  let aggLifetimeSpend = 0;
  let aggPacingBudget = 0;

  vals.map(val => {
    aggLifetimeSpend = aggLifetimeSpend + Number(val.original.lifetime_spend);
    aggPacingBudget = aggPacingBudget + (type === "lifetime" ? Number(val.original.pacing_budget_lifetime) : Number(val.original.pacing_budget_current_segment));
  });

  return convertToPercentage(aggLifetimeSpend / aggPacingBudget);

}

export const yestSpendTargetReached = (columnId, vals) => {
  const newVals = vals.map(val => val.getValue(columnId) === '' || _.isNull(val.getValue(columnId)) || _.isUndefined(val.getValue(columnId)) ? 0 : val.getValue(columnId));
  const uniqueValues = _.uniq(newVals);
  if (uniqueValues.length === 1 && uniqueValues[0] === 0) return "";

  let aggYestSpend = 0;
  let aggTargetDailySpend = 0;

  vals.map(val => {
    aggYestSpend = aggYestSpend + Number(val.original.yesterday_spend);
    aggTargetDailySpend = aggTargetDailySpend + Number(val.original.target_daily_spend_current_segment);
  });

  return convertToPercentage(aggYestSpend / aggTargetDailySpend);

}

export const numberOrMixedVariedType = (columnId, childRows, type) => {
  let vals = childRows;
  const newVals = vals.map(val => val.getValue(columnId) === '' || _.isNull(val.getValue(columnId)) || _.isUndefined(val.getValue(columnId)) ? 0 : val.getValue(columnId));

  if (newVals.some((val, i) => isNaN(parseInt(val)))) return 'Mixed';

  const isEqual = (currentValue) => currentValue === newVals[0];
  const uniqueValues = _.uniq(newVals);
  if (uniqueValues.length === 1 && uniqueValues[0] === 0) return "";
  switch (type) {
    case 'digit':
      return newVals.every(isEqual) ? newVals[0] : 'Mixed';
    case 'percent':
      return newVals.every(isEqual) ? convertToPercentage(newVals[0]) : 'Mixed';
  }

}

export const getStandardKpiMetrics = (platform) => {
  let standardKpiMetricsFields = [];
  switch (platform) {
    case 'facebook':
      standardKpiMetricsFields = standardKpiFB;
      break;
    case 'googleads':
      standardKpiMetricsFields = standardKpiGA;
      break;
    case 'googledv360':
      standardKpiMetricsFields = standardKpiDV360;
      break;
    case 'googlesa360':
      standardKpiMetricsFields = standardKpiSA360;
      break;
    case 'linkedin':
      standardKpiMetricsFields = standardKpiLI;
      break;
    default:
      break;
  }
  return standardKpiMetricsFields;
}

export const getReadbleFormula = ({ kpiLabel, platform = null, metrics = null }) => {
  let text = kpiLabel;
  const targetMetrics = platform ? getStandardKpiMetrics(platform) : metrics;
    targetMetrics?.map(exp => {
      const regex = new RegExp(`\\b${exp.value}\\b`, 'g');
      text = text.replace(regex, exp.label);
    });
  return text;
};


export const kpi = (cell, excelData = false) => {
  const platformInfo = getPlatformsInfoById(excelData ? cell.rowData?.platform : cell.row.original.platform);
  if (["facebook", "googleads", "googledv360", "linkedin", "googlesa360"].includes(platformInfo?.platform)) {
    if (excelData) {
      const { value } = cell;
      if (value?.includes("="))
        return getReadbleFormula({ kpiLabel: value.split("=")[0], platform: platformInfo.platform });
      else if (_.isNull(value || (value && value.contains("remove"))))
        return "";
      const kpiVal = kpiMetrics[platformInfo.platform.toUpperCase()][value];
      return _.isUndefined(kpiVal) ? value : kpiVal;
    } else {
      if (cell.getValue()?.includes("="))
        return getReadbleFormula({ kpiLabel: cell.getValue().split("=")[0], platform: platformInfo.platform });
      else if (_.isNull(cell.getValue() || (cell.getValue() && cell.getValue().contains("remove"))))
        return "";
      const kpiVal = kpiMetrics[platformInfo.platform.toUpperCase()][cell.getValue()];
      return _.isUndefined(kpiVal) ? cell.getValue() : kpiVal;
    }
  }
  return "";
}

const getAggregatedKpiData = (value, rowData) => {
    const { id, platform } = getPlatformsInfoById(rowData.platform);
    if (
        [
            Platform.FACEBOOK,
            Platform.GOOGLE_ADS,
            Platform.GOOGLE_DV360,
            Platform.LINKEDIN,
            Platform.GOOGLE_SA360
        ].includes(id)
    ) {
        if (value?.includes("="))
            return getReadbleFormula({
                kpiLabel: value.split("=")[0],
                platform: platform,
            });
        else if (_.isNull(value || (value && value.contains("remove"))))
            return "";
        const kpiVal = kpiMetrics[platform.toUpperCase()][value];
        return _.isUndefined(kpiVal) ? value : kpiVal;
    }
    return "";
};

export const aggregatedKpi = (columnId, vals) => {
    const newVals = vals.map((val) => val.getValue(columnId));
    const isEqual = (currentValue) => currentValue === newVals[0];
    return newVals.every(isEqual)
        ? vals[0].getValue(columnId) !== "" &&
          !_.isUndefined(vals[0].getValue(columnId))
            ? getAggregatedKpiData(
                  vals[0].getValue(columnId),
                  vals[0]?.original
              )
            : ""
        : "Mixed";
};

export const kpiUnits = (cell, excelData = false) => {
  if(excelData){
    return cell.toString() === '0' ? '0' : formatNumberToCurrency(cell.toString());
  }
  const kpi = cell.column.columnDef.header.split("_")[0];
  const kpiValue = cell.row.original[kpi];

  let {
    row: {
      original: {maskedValues },
    },
  } = cell;

  let cellValue = cell.getValue();

  if (maskedValues?.kpi1UnitsDeliveredMaskedValue)
    cellValue = maskedValues.kpi1UnitsDeliveredMaskedValue;

  let returnVal = Number(parseInt(cellValue));

  if (kpiValue?.includes("=")){
    const format = kpiValue.split("=")[2];
    if(!_.isNull(format) && format?.length > 0){
      if(format === "decimal" || format === "currency"){
        returnVal = Number(parseFloat(cellValue).toFixed(2));
        return isNaN(returnVal) ? "" : formatNumberToCurrency(returnVal.toString());
      }
    }
  }


  return isNaN(returnVal) ? "" : returnVal.toLocaleString('en-US');
}

const doubleBugetPlatformValue = (value, currencyCode) => {
  const splitValue = value?.replace(' ', '').split('|');
  let retVal = '';
  if (splitValue?.length === 2) {
    if (splitValue[0] !== '0' && splitValue[1] === '0')
      retVal = `${formatNumberToCurrency(
        parseFloat(splitValue[0]).toFixed(2),
        currencyCode
      )}`;
    else if (splitValue[0] === '0' && splitValue[1] !== '0')
      retVal = `${formatNumberToCurrency(
        parseFloat(splitValue[1]).toFixed(2),
        currencyCode
      )}`;
    else if (splitValue[0] !== '0' && splitValue[1] !== '0')
      retVal = `D: ${formatNumberToCurrency(
        parseFloat(splitValue[0]).toFixed(2),
        currencyCode
      )}; L: ${formatNumberToCurrency(
        parseFloat(splitValue[1]).toFixed(2),
        currencyCode
      )}`;
    else
      retVal = '-';
    
    return retVal;
  }
  return '-';
};

export const numberToCurrencyOrString = (cell, excelData = false) => {
  if (excelData) {
    const {
      rowData: { currency_code, platform },
      value,
    } = cell;
    if (value === '0') return '-';
    return ['Mixed', '-'].includes(value)
      ? value
      : evaluatePlatform(platform)
      ? doubleBugetPlatformValue(value, currency_code)
      : formatNumberToCurrency(parseFloat(value).toFixed(2), currency_code);
  }
  const {
    row: {
      original: {
        currency_code,
        platform,
        platformCampaignTooltip,
        platformAdSetTooltip,
      },
    },
    column: { id },
  } = cell;

  if (cell.getValue() === '0')
    return (
      <div
        title={
          id === 'platform_campaign_budget'
            ? platformCampaignTooltip
            : platformAdSetTooltip
        }
      >
        -
      </div>
    );
  return ['Mixed', '-'].includes(cell.getValue()) ? (
    <div
      title={
        cell.getValue() === '-'
          ? id === 'platform_campaign_budget'
            ? platformCampaignTooltip
            : platformAdSetTooltip
          : ''
      }
    >
      {cell.getValue()}
    </div>
  ) : evaluatePlatform(platform) ? (
    doubleBugetPlatformValue(cell.getValue(), currency_code)
  ) : (
    formatNumberToCurrency(
      parseFloat(cell.getValue()).toFixed(2),
      currency_code
    )
  );
};

export const convertDateToUTC = (dateValue) => {
  let utcLocal =
    dateValue ||
    'Accenture Machine Learning has not generated a budget recommendation for this item.';
  const getDateFromValue = utcLocal.match(
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/
  );
  if (getDateFromValue) {
    const localDateString = moment
      .utc(getDateFromValue[0])
      .local()
      .format('MMM-DD-YYYY hh:mm a');
    utcLocal = utcLocal.replace(getDateFromValue[0], localDateString);
  }
  return utcLocal;
};

export const budgetRecommendationCell = (cell, excelData = false) => {
  if (excelData) {
    let {
      rowData: { currency_code, maskedValues },
      value,
    } = cell;
    if (maskedValues?.budgetRecMaskedValue)
      value = maskedValues.budgetRecMaskedValue;

    return ['-', null, undefined].includes(value)
      ? '-'
      : formatNumberToCurrency(parseFloat(value).toFixed(2), currency_code);
  }

  let {
    row: {
      original: { budgetRecTooltip, currency_code, maskedValues },
    },
  } = cell;
  let value = cell.getValue();

  if (maskedValues?.budgetRecMaskedValue)
    value = maskedValues.budgetRecMaskedValue;

  if (maskedValues?.budgetRecTooltipMaskedValue)
    budgetRecTooltip = maskedValues.budgetRecTooltipMaskedValue;

  budgetRecTooltip = convertDateToUTC(budgetRecTooltip);

  return (
    <div title={budgetRecTooltip}>
      {['-', null, undefined].includes(value)
        ? '-'
        : formatNumberToCurrency(parseFloat(value).toFixed(2), currency_code)}
    </div>
  );
};

export const pacingDateColor = (value) => {
  if (!value) return null;
  const date = moment(moment(value).format('DD-MM-YYYY'), 'DD-MM-YYYY');
  const nextDate = moment(
    moment(new Date()).subtract(-1, "days").format('DD-MM-YYYY'),
    'DD-MM-YYYY'
  );
  const diffDate = nextDate.diff(date, 'days');
  return diffDate === 0 ? '#FFECA1' : null;
};

export const pacingColor = (value) => {
  const number = parseFloat(value);
  if (isNaN(number)) return;
  if (!number) return '#AAEACD';
  const percentage = ((number / 100) * 100).toFixed(2);
  let bgColorCss = '#C58E8C';
  const perNumber = Number(percentage);
  if (-5 <= perNumber && perNumber <= 5) bgColorCss = '#AAEACD';
  else if (
    (-10 <= perNumber && perNumber < -5) ||
    (5 <= Math.abs(perNumber) && Math.abs(perNumber) <= 10)
  )
    bgColorCss = '#FFECA1';
  return bgColorCss;
};

export const showToolTipWithValue = (value) => (
  <span title={value}>
    {_.isUndefined(value) || value === '' || _.isNull(value) ? showNull : value}
  </span>
);
