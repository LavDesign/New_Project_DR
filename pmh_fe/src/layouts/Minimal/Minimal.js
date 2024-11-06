import React from 'react';
import PropTypes from 'prop-types';

const Minimal = ({ children }) => {
    return (
        <main className="h-100 px-0 container m-2">{children}</main>
    );
};

Minimal.propTypes = {
    children: PropTypes.node,
};

export default Minimal;