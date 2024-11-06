const columnsToAffect = {
    pacing_budget: [
        "pacing_budget_current_segment",
        "days_remaining",
        "yesterday_spend_target_reached",
        "average_daily_goal_spend_current_segment",
        "average_daily_spend_current_segment",
        "budget_progress_current_segment",
        "flight_progress_current_segment",
        "pacing_current_segment",
        "target_daily_spend_current_segment",
        "budget_recommendation",
        "pacing_budget_current_segment_start_date",
        "pacing_budget_current_segment_end_date"
    ],
    kpi1: [
        "kpi1",
        "kpi1_units_delivered_current_segment",
        "kpi1_average_unit_cost_current_segment",
    ],
    kpi2: [
        "kpi2",
        "kpi2_units_delivered_current_segment",
        "kpi2_average_unit_cost_current_segment",
    ],
    kpi3: [
        "kpi3",
        "kpi3_units_delivered_current_segment",
        "kpi3_average_unit_cost_current_segment",
    ],
    group: [
        "free_text_group"
    ]
};

export const getColumnsBeingCalculated = (colIdentifier) => {
    if (Object.keys(columnsToAffect).includes(colIdentifier)) {
        return columnsToAffect[colIdentifier];
    }

    return [];
};
