import { useSelector } from 'react-redux';
import Header from 'common/MasterPage/Header/Header';
import Footer from 'common/Footer/Footer';
import PropTypes from 'prop-types';
import AlertMessage from 'views/UI/AlertMessage';
import './MasterPage.css';
import SecondaryHeader from 'common/MasterPage/SecondaryHeader/SecondaryHeader';
import { showSecondaryHeaderModuleList } from '_helpers/Utils/mediaConsoleUtil';

const MasterPage = ({ children, hideLinks }) => {
  const { showNotification } = useSelector((store) => store.getCommonData);

  const secondaryHeader = showSecondaryHeaderModuleList.some((path) =>
    window?.location?.pathname.includes(path)
  );

  return (
    <>
      {showNotification && <AlertMessage />}
      {secondaryHeader ? <SecondaryHeader /> : <Header hideLinks={hideLinks} />}
      <main>
        <div
          className={
            secondaryHeader
              ? window?.location?.pathname.includes('budget-group-details')
                ? 'master-page-container-secondary-bgdetails'
                : 'master-page-container-secondary'
              : 'master-page-container'
          }
        >
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
};

MasterPage.propTypes = {
  children: PropTypes.node,
};

export default MasterPage;
