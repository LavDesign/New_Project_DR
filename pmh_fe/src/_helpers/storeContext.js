import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

export const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

/**
 * Exposes context for store. A very simple dataObject state hook.
 * Please consider the use of proper state manager.
 */
export const StoreProvider = ({ children }) => {
  const [dataObject, setDataObject] = useState({});

  const store = (val) => {
    val ? setDataObject((o) => ({ ...o, ...val })) : dataObject;
  };
  return (
    <StoreContext.Provider value={{ store: dataObject, setStore: store }}>
      {children}
    </StoreContext.Provider>
  );
};

StoreProvider.propTypes = {
  children: PropTypes.any.isRequired,
};
