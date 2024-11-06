import _ from 'underscore';
import HeaderNames from './facebookHeaderNames';

const platform = 'facebook';
/*
NOT ADDED COLUMNS 
- campaigns.js.coffee
  - m Budget

- ad_sets.js.coffee
  - m Budget
  - Goal & Bid
  - Languages
  - Locations
  - Targeting Description
  - Potential Reach
  - Audience Reached Ratio

- ads.js.coffee
  - Card Count
  - Card Order Fixed?
  - Card # - Call To Action Type columns
  - Card # - Display Link columns
  - Card # - Image
  - Card # - Link
  - Card # - Title
  - Card # - Body
  - Card # - Video
  - Preview
  - Tracking Pixel
  - Instagram Account
  - Title
  - Link
  - Link Description
  - Display Link
  - Video Lenght
  - Image
  - Display End Card
  - Product IDs
  - Event
  - Ad Scheduling
*/


export const defaultColumns = [
  [HeaderNames.ID['campaign'], HeaderNames.NAME['campaign'], HeaderNames.SPEND, HeaderNames.IMPRESSIONS],
  [HeaderNames.ID['adSet'], HeaderNames.NAME['adSet'], HeaderNames.SPEND, HeaderNames.IMPRESSIONS],
  [HeaderNames.ID['ads'], HeaderNames.NAME['ads'], HeaderNames.SPEND, HeaderNames.IMPRESSIONS]
];

export const preDefinedViews = [{
  label: 'Default 1',
  selected: false,
  isDefault: true,
  columns: [[HeaderNames.ID['campaign'], HeaderNames.NAME['campaign'], HeaderNames.SPEND, HeaderNames.IMPRESSIONS],
          [HeaderNames.ID['adSet'], HeaderNames.NAME['adSet'], HeaderNames.SPEND, HeaderNames.IMPRESSIONS],
          [HeaderNames.ID['ads'], HeaderNames.NAME['ads'], HeaderNames.SPEND, HeaderNames.IMPRESSIONS]]
},
{
  label: 'Default 2',
  selected: false,
  isDefault: true,
  columns: [[HeaderNames.ID['campaign'], HeaderNames.NAME['campaign'], HeaderNames.SPEND, HeaderNames.IMPRESSIONS, HeaderNames.STATUS],
          [HeaderNames.ID['adSet'], HeaderNames.NAME['adSet'], HeaderNames.SPEND, HeaderNames.IMPRESSIONS, HeaderNames.STATUS],
          [HeaderNames.ID['ads'], HeaderNames.NAME['ads'], HeaderNames.SPEND, HeaderNames.IMPRESSIONS, HeaderNames.STATUS]]
}];

export const standardKpiMetricsFields = [
  {value: "canvas_avg_view_time", label: "'Average Duration of Canvas Viewed'"},
  {value: "clicks", label: "'Clicks'"},
  {value: "estimated_ad_recallers", label: "'Estimated Ad Recallers'"},
  {value: "frequency", label: "'Frequency'"},
  {value: "impressions", label: "'Impressions'"},
  {value: "inline_link_clicks", label: "'Inline Link Clicks'"},
  {value: "inline_post_engagement", label: "'Inline Post Engagement'"},
  {value: "link_click", label: "'Link Clicks'"},
  {value: "mobile_app_install", label: "'Mobile App Installs'"},
  {value: "outbound_clicks", label: "'Outbound Clicks'"},
  {value: "page_like", label: "'Page Likes'"},
  {value: "post_engagement", label: "'Post Engagement'"},
  {value: "reach", label: "'Reach'"},
  {value: "spend", label: "'Spend'"},
  {value: "video_view", label: "'Video Views'"},
  {value: "video_30_sec_watched", label: "'30-Second Video Views'"},
  {value: "video_avg_time_watched", label: "'Average Duration of Video Viewed'"},
  {value: "video_p25_watched", label: "'Video Watches at 25%'"},
  {value: "video_p50_watched", label: "'Video Watches at 50%'"},
  {value: "video_p75_watched", label: "'Video Watches at 75%'"},
  {value: "video_p95_watched", label: "'Video Watches at 95%'"},
  {value: "video_p100_watched", label: "'Video Watches at 100%'"},
  {value: "quality_ranking", label: "'Quality Ranking'"},
  {value: "engagement_rate_ranking", label: "'Engagement Rate Ranking'"},
  {value: "conversion_rate_ranking", label: "'Conversion Rate Ranking'"}
]
