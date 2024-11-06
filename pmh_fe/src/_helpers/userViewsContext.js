import { createContext, useContext, useState, useEffect } from 'react';
import { useStore } from './storeContext';

export const UserViewsContext = createContext(null);
export const useUserViews = () => useContext(UserViewsContext);

export const UserViewsProvider = ({ children }) => {
  const [userSavedViews, setUserSavedViews] = useState([]);
  const [userSelectedView, setUserSelectedView] = useState(undefined);
  const [userSelectedColumns, setUserSelectedColumns] = useState({
    campaignDash: [],
    adSetDash: [],
  });
  const [columnSelectionState, setColumnSelectionState] = useState('saved');
  const [freezedColumns, setFreezedColumns] = useState({
    campaignDash: 0,
    adSetDash: 0,
  });
  const [pivotColumns, setPivotColumns] = useState({
    campaignDash: [],
    adSetDash: [],
  });

  const [pivotOperation, setPivotOperation] = useState(true);

  const { store, setStore } = useStore();

  useEffect(() => {
    if (userSelectedView) {
      const {
        columns,
        adSetColumns,
        columnList,
        adSetColumnList,
      } = userSelectedView;
      setUserSelectedColumns({
        campaignDash: columns,
        adSetDash: adSetColumns,
      });
      setFreezedColumns({
        campaignDash: columnList?.filter((element) => element.isFreeze).length,
        adSetDash: adSetColumnList?.filter((element) => element.isFreeze)
          .length,
      });
      setPivotColumns({
        campaignDash: columnList
          ?.filter((element) => element?.isPivot)
          .map((data) => data?.columnKey),
        adSetDash: adSetColumnList
          ?.filter((element) => element?.isPivot)
          .map((data) => data?.columnKey),
      });
      setPivotOperation(true);
    }
  }, [userSelectedView]);

  const columnSelectionIsEqualHandler = ({ prevList, newList }) =>
    prevList.length === newList.length &&
    prevList.every((element, index) => element === newList[index]);

  const setSelectedViewHandler = ({ view }) => {
    const dashSelectedViewsData = view && {
      dashboardSelectedViews: { ...view, selected: true },
    };
    setUserSelectedColumns({
      campaignDash: view.columns,
      adSetDash: view.adSetColumns,
    });
    setUserSelectedView({ ...view, selected: true });
    setStore({ newDashboardSelectedView: dashSelectedViewsData });
    setUserSavedViews((prevState) =>
      prevState.map((savedView) => ({
        ...savedView,
        selected: view.label === savedView.label,
      }))
    );
  };

  const fetchSavedViewsHandler = (views) => {
    let itemInLocalStorage = {};
    //itemInLocalStorage = store?.newDashboardSelectedView; // commenting this line for future reference in case of any issues
    itemInLocalStorage = views?.map((view) => { if (view.isSelected) return view; });
    let selectedItem = undefined;

    if (
      itemInLocalStorage &&
      itemInLocalStorage.dashboardSelectedViews &&
      itemInLocalStorage.dashboardSelectedViews.selected
    ) {
      selectedItem = itemInLocalStorage.dashboardSelectedViews;
      setUserSelectedView(itemInLocalStorage.dashboardSelectedViews);
    }

    if (views && views.length > 0) {
      setUserSavedViews(
        views.map((view, idx) => {
          const { viewName, columnList, adSetColumnList } = view;
          const viewItem = {
            ...view,
            label: viewName,
            columnList: columnList.sort((a, b) => {
              return a.displayOrder - b.displayOrder;
            }),
            columns: new Array(
              columnList.map((column) => {
                return column.columnKey;
              })
            ),
            adSetColumnList: adSetColumnList.sort((a, b) => {
              return a.displayOrder - b.displayOrder;
            }),
            adSetColumns: new Array(
              adSetColumnList.map((column) => {
                return column.columnKey;
              })
            ),
          };
          if (selectedItem) {
            return {
              ...viewItem,
              selected: view.viewName === selectedItem.label ? true : false,
            };
          }
          if (idx === 0) {
            setUserSelectedView({ ...viewItem, selected: true });
            const dashSelectedViewsData =
              viewItem &&
              JSON.stringify({
                dashboardSelectedViews: { ...viewItem, selected: true },
              });
            setStore({
              newDashboardSelectedView: dashSelectedViewsData,
            });
          }

          return { ...viewItem, selected: idx === 0 };
        })
      );
    }
  };

  const addNewOrEditViewHandler = (view, isEdit) => {
    const addUpdateViewObject = {
      ...view,
      label: view.viewName,
      selected: true,
    };
    setUserSelectedColumns({
      campaignDash: addUpdateViewObject.columns,
      adSetDash: addUpdateViewObject.adSetColumns,
    });
    setUserSelectedView(addUpdateViewObject);

    const dashSelectedViewsData =
      addUpdateViewObject &&
      JSON.stringify({
        dashboardSelectedViews: { ...addUpdateViewObject, selected: true },
      });
    setStore({ newDashboardSelectedView: dashSelectedViewsData });
    if (isEdit) {
      setUserSavedViews((prevState) =>
        prevState.map((data) =>
          view.viewId === data.viewId
            ? addUpdateViewObject
            : { ...data, selected: false }
        )
      );
    } else {
      setUserSavedViews((prev) => [
        ...prev.map((data) => ({ ...data, selected: false })),
        addUpdateViewObject,
      ]);
    }
  };

  const removeViewHandler = (viewId) => {
    const updatedView = JSON.parse(JSON.stringify(userSavedViews));
    let removedDeletedView = updatedView.filter(
      (view) => view.viewId !== viewId
    );
    removedDeletedView = removedDeletedView.map((view) => {
      if (userSelectedView.viewId === viewId && view.viewId === 1) {
        const viewData = view && JSON.stringify({ ...view, selected: true });
        setUserSelectedColumns({
          campaignDash: view.columns,
          adSetDash: view.adSetColumns,
        });
        setUserSelectedView({ ...view, selected: true });
        setStore({ newDashboardSelectedView: viewData });
        view.selected = true;
        setColumnSelectionState('saved');
      }
      return view;
    });
    setUserSavedViews(removedDeletedView);
  };

  const userViewsObject = {
    userSavedViews,
    userSelectedView,
    userSelectedColumns,
    columnSelectionState,
    freezedColumns,
    fetchSavedViews: fetchSavedViewsHandler,
    setSelectedView: setSelectedViewHandler,
    columnSelectionIsEqual: columnSelectionIsEqualHandler,
    setUserSelectedColumns,
    setColumnSelectionState,
    setFreezedColumns,
    removeViewHandler,
    setPivotColumns,
    pivotColumns,
    pivotOperation,
    setPivotOperation,
    addNewOrEditViewHandler,
  };

  return (
    <UserViewsContext.Provider value={userViewsObject}>
      {children}
    </UserViewsContext.Provider>
  );
};
