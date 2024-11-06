import React from 'react';
import { useSelector } from 'react-redux';
import _ from 'underscore';
import 'regenerator-runtime/runtime';
import writeXlsxFile from 'write-excel-file';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { getPlatformsInfo } from '_helpers/Utils/availablePlatformsInfo';
import styles from '../../_theme/modules/campaingDash/CampaignDashToolbar.module.css';
import { PUBLICURL } from '../../_helpers/Utils/dashboardUtil';

import {
    budgetRecommendationCell,
    convertToPercentage,
    dateCellRender,
    kpi,
    kpiUnits,
    numberToCurrency,
    numberToCurrencyOrString,
} from '_helpers/columns/cellFormatters';
import {
    trackButtonClick,
    getPageCategory,
} from '_helpers/Utils/segmentAnalyticsUtil';

/**
@desc ExportTableComponent is a component that exports the table data to excel file.
This component can be used for other dashboards as well.
So in future need to modify, when this component will used as common for other dashboards.
**/
const ExportTableComponent = ({
headerGroups,
tableData,
customExport = false,
fileName = 'Campaigns',
}) => {
const { t } = useTranslation(['common']);

const ignoreColumns = ['is_check_in_am', 'is_check_in_pm'];

const { dashTab } = useSelector((store) => store.getDashboardData);

const dataFormat = (header, data, row) => {
    let cell = {};
    switch (header) {
        case 'current_segment_spend':
        case 'yesterday_spend':
        case 'today_spend':
        case 'pacing_budget_current_segment':
        case 'kpi1_average_unit_cost_current_segment':
        case 'kpi2_average_unit_cost_current_segment':
        case 'kpi3_average_unit_cost_current_segment':
        case 'average_daily_goal_spend_current_segment':
        case 'average_daily_spend_current_segment':
        case 'target_daily_spend_current_segment':
        case 'ad_set_campaign_pacing':
        case 'budgetSpend':
        case 'cpm':
            cell = {
                value: data,
                rowData: row,
            };
            return numberToCurrency(cell, true);
        case 'publisher':
            const platformInfo =
                _.isUndefined(data) || data === ''
                    ? null
                    : getPlatformsInfo(data.toLowerCase());
            return platformInfo?.name
                ? t(`site_titles.${platformInfo?.name}`)
                : null;
        case 'kpi1':
        case 'kpi2':
        case 'kpi3':
            cell = {
                value: data,
                rowData: row,
            };
            return kpi(cell, true);
        case 'kpi1_units_delivered_current_segment':
        case 'kpi2_units_delivered_current_segment':
        case 'kpi3_units_delivered_current_segment':
        case 'kpiValue':
        case 'campaignKpi':
            return kpiUnits(data, true);
        case 'yesterday_spend_target_reached':
        case 'budget_progress_current_segment':
        case 'flight_progress_current_segment':
        case 'pacing_current_segment':
        case 'changeInSpend':
        case 'changeInKpi':
            return convertToPercentage(data);
        case 'platform_campaign_budget':
        case 'platform_ad_set_budget':
            cell = {
                value: data,
                rowData: row,
            };
            return numberToCurrencyOrString(cell, true);
        case 'budget_recommendation':
        case 'ad_set_budget_recommendation':
            cell = {
                value: data,
                rowData: row,
            };
            return budgetRecommendationCell(cell, true);
        case 'pacing_budget_current_segment_start_date':
        case 'pacing_budget_current_segment_end_date':
            return dateCellRender(data);
        default:
            return data ? data.toString() : data;
    }
};

const getExportFileBlob = () => {
    trackButtonClick('Download', getPageCategory(), 'Export Icon');
    const filterIgnoredColumns = headerGroups?.flatMap((headerGroup) =>
        headerGroup?.headers?.filter(
            (header) => !ignoreColumns.includes(header?.id) && header
        )
    );
    const headerArrayById = filterIgnoredColumns.map((header) => header?.id);
    const headerArray = filterIgnoredColumns.map((header) => ({
        value: t(`header_names.${header.id}`),
        fontWeight: 'bold'
    }));

    const dataArray = tableData?.map((row) =>
        headerArrayById.map((header) => ({
                type: String,
                value: dataFormat(header, row[header], row)
        }))
    );

    const sheetData = [
        headerArray,
        ...dataArray
    ];

    const filePathWithName = `${fileName}_${moment(new Date()).format('MMM-DD-YYYY')}.xlsx`;

    writeXlsxFile(sheetData, {
        headerStyle: {
            backgroundColor: '#eeeeee',
            fontWeight: 'bold',
            align: 'center'
          },
        fileName: filePathWithName
    }
    );
};

const exportIconStyles = {
    cursor: 'pointer',
    // margin: '0 1.5rem 0 auto',
};
return (
    <div
        title={t('button_text.exportToolTip')}
        style={exportIconStyles}
        onClick={() => getExportFileBlob()}
    >
        {customExport ? (
            <img
                src={`${window.location.origin}${PUBLICURL}/assets/icons/export-icon.png`}
                style={{
                    width: '1.875rem',
                    height: '1.875rem',
                    marginTop: '0.625rem',
                }}
            />
        ) : (
            <>
                <label
                    style={{ cursor: 'pointer' }}
                    className={`${styles['groove_export_btn_lbl']}`}
                >
                    {t('button_text.exportToolTip')}
                </label>
            </>
        )}
    </div>
);
};

export default ExportTableComponent;
