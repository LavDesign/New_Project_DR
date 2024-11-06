import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { PUBLICURL } from '_helpers/Utils/dashboardUtil';
import './ManageChannelModel.scss';
import ChannelComponent from './ChannelComponent';

const ManageChannelModel = ({
  onClose,
  channelList,
  setChannelList,
  filterCheckedChannelList,
}) => {
  const [manageChannels, setManageChannels] = useState([]);
  const [primaryBtnDisabled, setPrimaryBtnDisabled] = useState(false);

  useEffect(() => {
    const updateManageChannels = JSON.parse(JSON.stringify(channelList));
    const mergedFilterAndChannel = updateManageChannels.map((channel) => {
      const commonChannel = filterCheckedChannelList.find(
        (filterChannel) => filterChannel.platformId === channel.platformId
      );
      return commonChannel ? { ...channel, ...commonChannel } : channel;
    });
    mergedFilterAndChannel.forEach((channel) => {
      channel.showHelperText = false;
    });
    setManageChannels(mergedFilterAndChannel);
  }, [channelList]);

  const onMangeChannelSelection = (channel) => {
    const updatedChannels = manageChannels.map((item) => {
      if (item.platformId === channel.platformId) {
        item.checked = !item.checked;
        if (
          channel?.accountDataForChannel &&
          Object.values(channel?.accountDataForChannel)?.some(
            (account) => account.selectedCampaigns?.length
          )
        ) {
          item.showHelperText = !item.checked;
        }
      }
      return item;
    });
    setManageChannels(updatedChannels);
  };

  const onPrimaryBtnClick = () => {
    const updateChangedChannelList = JSON.parse(JSON.stringify(manageChannels));
    updateChangedChannelList.forEach((channel) => {
      if (!channel.checked) {
        delete channel.accountDataForChannel;
      }
      delete channel.showHelperText;
    });
    setChannelList(updateChangedChannelList);
    onClose(true);
  };

  return (
    <Modal
      show={true}
      dialogClassName='manage-channel-dialog'
      contentClassName='manage-channel-modal-content'
      centered
      backdrop='static'
      backdropClassName='manage-channel-backdrop'
      keyboard={false}
      scrollable={true}
    >
      <Modal.Header>
        <Modal.Title>Manage Channels</Modal.Title>
        <button type='button' aria-label='Close' onClick={() => onClose()}>
          <img
            src={`${window.location.origin}${PUBLICURL}/assets/icons/clear-close.svg`}
            alt='Close'
          />
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className='modal-subtitle'>
          Manage the channels of the Budget Group
        </div>
        <ChannelComponent
          channelList={manageChannels}
          onChannelSelection={onMangeChannelSelection}
          checkboxState={(flag) => setPrimaryBtnDisabled(flag)}
        />
      </Modal.Body>
      <Modal.Footer>
        <button className='secondary-btn' onClick={() => onClose()}>
          <span className='btn-label'>Cancel</span>
        </button>
        <button
          className={`primary-btn${primaryBtnDisabled ? ' disabled' : ' '}`}
          onClick={() => onPrimaryBtnClick()}
        >
          <span className='btn-label'>Save</span>
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ManageChannelModel;
