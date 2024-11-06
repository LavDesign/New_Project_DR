import { PUBLICURL } from '_helpers/Utils/dashboardUtil';
import './CEFooter.scss';
import LeftArrowImage from './LeftArrowImage';
import ButtonLoader from 'views/MediaConsole/Common/FormComponents/ButtonLoader';

const CEFooter = ({
  onPrimaryBtnClick,
  onSecondaryBtnClick,
  onCancelBtnClick,
  showFooterBtns: { cancel = {}, primary = {}, secondary = {} },
}) => {
  return (
    <div className='ce__fixed-container'>
      {cancel.show && (
        <button className='ce__cancel-btn' onClick={() => onCancelBtnClick()}>
          <span className='ce__btn-label'>{cancel.name}</span>
        </button>
      )}
      <div className='ce__rigth-end'>
        {secondary.show && (
          <button
            className='ce__back-btn'
            onClick={() => onSecondaryBtnClick()}
          >
            <LeftArrowImage customClass='ce__btn-img' />
            <span className='ce__btn-label'>{secondary.name}</span>
          </button>
        )}
        {primary.show &&
          (primary.state === 'loader' ? (
            <ButtonLoader />
          ) : (
            <button
              className={`ce__next-btn ${
                primary.state === 'disabled' ? 'ce__next-btn-disabled' : ''
              }`}
              onClick={() => onPrimaryBtnClick()}
            >
              <span className='ce__btn-label ce__btn-next-label'>
                {primary.name}
              </span>
              <img
                src={`${window.location.origin}${PUBLICURL}/assets/icons/right-arrow.svg`}
                alt='Right Arrow'
                className='ce__btn-img'
              />
            </button>
          ))}
      </div>
    </div>
  );
};

export default CEFooter;
