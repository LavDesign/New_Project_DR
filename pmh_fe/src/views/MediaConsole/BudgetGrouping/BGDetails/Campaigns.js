import { useEffect, useState, useRef, useMemo } from 'react';
import CampaignsToolBar from './CampaignsToolBar';
import TableComponent from '../../Common/NewUI/TableComponent';
import * as Columns from '_helpers/columns/columns';
import { allColumnslist } from '_helpers/columns/budgetGroupsCampaigns';
import NoBudgetGroup from '../../BudgetGrouping/NoBudgetGroup';

const Campaigns = ({ group }) => {
  const campaignsRef = useRef([]);
  const [headerGroups, setHeaderGroups] = useState([]);
  const [campaigns, setCampaigns] = useState(group?.campaigns || undefined);

  const tableColumnHeaders = useMemo(() => {
    let listOfColumns = Columns.processSelectedColumns(
      allColumnslist,
      'budgetGroupsCampaigns'
    ).filter((col) => col !== undefined);
    listOfColumns = listOfColumns.filter(
      (item, index) =>
        listOfColumns.findIndex(
          (elem) => elem.accessorKey === item.accessorKey
        ) === index
    );
    return listOfColumns;
  }, []);

  useEffect(() => {
    if (group) {
      campaignsRef.current = JSON.parse([JSON.stringify(group?.campaigns)]);
    }
  }, []);

  const handleHeaderGroups = (headerGroups) => {
    setHeaderGroups(headerGroups);
  };
  return (
    <>
      <CampaignsToolBar
        campaignData={campaignsRef.current}
        filteredCampaigns={(data) => setCampaigns(data)}
        headerGroups={headerGroups || undefined}
      />
      {campaigns?.length > 0 ? (
        <TableComponent
          tableColumnHeaders={tableColumnHeaders}
          data={campaigns}
          onHeaderGroupsChange={handleHeaderGroups}
          tabName='bgCampaigns'
        />
      ) : (
        <NoBudgetGroup
          mainHeading={
            campaignsRef.current.length
              ? 'We didn’t find a match for your search'
              : 'Budget Group doesn\'t have any campaigns associated'
          }
          content={
            campaignsRef.current.length
              ? 'Try Searching for something else'
              : 'Your Campaigns will be shown in this screen'
          }
        />
      )}
    </>
  );
};

export default Campaigns;
