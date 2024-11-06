import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { getBudgetGroupKpis } from '_services/budgetGrouping';

export const DAILY_REVIEW_TABS = {
  BUDGET_REC: {
    id: 1,
    name: 'Budget Recommendation',
    value: 'budgetRec',
  },
  CAMPAIGN_ADV: {
    id: 2,
    name: 'Campaign Advisor',
    value: 'campaignAdv',
  },
  DAILY_REV_DASH: {
    id: 3,
    name: 'Dashboard',
    value: 'dailyRevDash',
  },
};

export const FIELD_INFO = {
  MANDATORY: 'Mandatory',
  OPTIONAL: 'Optional',
};

export const COMPLETION_STATE = {
  NOT_STARTED: 'not-started',
  PROGRESS: 'progress',
  FINISH: 'finish',
};

export const SECTION = {
  GENERAL: 'general',
  CHANNEL: 'channel',
  FINISH: 'finish',
};

export const findLabelValue = (value, array) =>
  array.find((option) => option.value === value);

export const findLabelByValue = (value, array) =>
  findLabelValue(value, array) ? findLabelValue(value, array).label : null;

export const showSecondaryHeaderModuleList = [
  '/new-edit-budget-group',
  '/new-edit-campaign',
  '/budget-group-details',
];

export const validateNumberField = (val) => {
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

export const truncateText = (text, length) =>
  text?.length > length ? `${text?.substring(0, length)}...` : text;

export const allowCharacters = (data) => {
  const allowRegex = /^[A-Za-z\w!@#$%&*()\-:;',.?/\\\s]*$/;
  return allowRegex.test(data);
};

export const customEmptyComponent = ({ mainTitle = '', subTitle = '' }) => {
  return (
    <div className='no-text-container'>
      <div>{mainTitle}</div>
      <div>{subTitle}</div>
    </div>
  );
};

export const displayToolTipField = (data, length = 110) => {
  const toolTipInfo = data?.name || data;
  const toolTipData = data?.key ? `${data.key} | ${data.name}` : data;
  const truncatedText = truncateText(toolTipData, length);

  return truncatedText?.includes('...') ? (
    <OverlayTrigger
      placement={'bottom'}
      overlay={
        <Tooltip className='customToolTip' id={`tooltip-right`}>
          {toolTipInfo}
        </Tooltip>
      }
    >
      <span className='chip-name'>{truncatedText}</span>
    </OverlayTrigger>
  ) : (
    <span className='chip-name'>{toolTipData}</span>
  );
};

export const isNullOrUndefinedStored = (key) =>
  ['undefined', 'null', null, undefined].includes(
    sessionStorage.getItem(key) ?? null
  );

export const getKpiOptions = async () => {
  const kpiOptions = await getBudgetGroupKpis();

  return {
    kpiOptionsArray: kpiOptions.map((kpi) => ({
      label: kpi.name,
      value: kpi.name,
    })),
  };
};
