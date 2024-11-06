import React from 'react';
import PropTypes from 'prop-types';
import Header from 'common/MasterPage/Header/Header';
import Footer from '../../common/Footer/Footer';
import { useSelector } from 'react-redux';
import AlertMessage from 'views/UI/AlertMessage';

const Main = ({ children }) => {
    const { showNotification } = useSelector((store) => store.getCommonData);
    return (
        <>
        {showNotification && <AlertMessage alertType={showNotification.alertType} strongMessage={showNotification.strongMessage} message={showNotification.message}/>}
            <Header />
            <main className={`h-auto px-0 pb-5`} style={{ marginTop: "8rem" }}>
                {children}
            </main>
            <Footer />
        </>
    );
};

Main.propTypes = {
  children: PropTypes.node,
};

export default Main;
