import { useState, useEffect } from 'react';
import { PUBLICURL } from '_helpers/Utils/dashboardUtil';
import './ChannelComponent.scss';
import SkeletonLoaderComponent from 'views/MediaConsole/Common/SkeletonLoaderComponent';

const ChannelComponent = ({
  channelList = [],
  onChannelSelection,
  checkboxState,
  disabledField = false,
}) => {
  const [aggrementCheck, setAggrementCheck] = useState(undefined);

  useEffect(() => {
    const showHelperTextAvailable = channelList?.filter(
      (channel) => channel.showHelperText !== undefined
    );
    if (showHelperTextAvailable.length) {
      if (channelList?.filter((channel) => channel.showHelperText)?.length) {
        setAggrementCheck((prevState) => {
          return { ...prevState, show: true };
        });
      } else {
        setAggrementCheck({
          show: false,
          checked: false,
        });
      }
    }
  }, [channelList]);

  useEffect(() => {
    if (aggrementCheck) {
      aggrementCheck.show
        ? checkboxState?.(
            aggrementCheck.checked !== undefined
              ? !aggrementCheck.checked
              : true
          )
        : checkboxState?.(false);
    }
  }, [aggrementCheck]);

  return channelList.length ? (
    <>
      <div className='channel-container'>
        {channelList.map((channel, index) => {
          return (
            <div
              className={`channel-item ${disabledField ? 'disabled-item' : ''}`}
              key={`channel_${index}`}
            >
              <div
                className='checkbox-container'
                onClick={() => onChannelSelection(channel)}
              >
                <div
                  className={`checkbox ${channel.checked ? 'checked' : ''} ${
                    disabledField ? 'disabled' : ''
                  }`}
                  tabIndex={0}
                >
                  {channel.checked ? (
                    disabledField ? (
                      <img
                        src={`${window.location.origin}${PUBLICURL}/assets/icons/checked-tick-disabled.svg`}
                        alt='checked-tick-disabled'
                      />
                    ) : (
                      <img
                        src={`${window.location.origin}${PUBLICURL}/assets/icons/checked-tick.svg`}
                        alt='checked-tick'
                      />
                    )
                  ) : null}
                </div>
                <span>{channel.platformName}</span>
              </div>
            </div>
          );
        })}
      </div>
      {aggrementCheck?.show ? (
        <div
          className='agreement-container'
          onClick={() =>
            setAggrementCheck((prevState) => {
              return { show: true, checked: !prevState.checked };
            })
          }
        >
          <div
            className={`agreement-checkbox ${
              aggrementCheck.checked ? 'checked' : ''
            }`}
          >
            {aggrementCheck.checked ? (
              <img
                src={`${window.location.origin}${PUBLICURL}/assets/icons/checked-tick.svg`}
                alt='checked-tick'
              />
            ) : null}
          </div>
          <span>
            I understand that by unselecting a a channel that had campaigns
            associated to it, this campaigns will no longer be part of the
            Budget Group.
          </span>
        </div>
      ) : null}
      {disabledField ? (
        <div className='disabled-helper-text-container'>
          This field can not longer be edited
        </div>
      ) : null}
    </>
  ) : (
    <SkeletonLoaderComponent count={3} />
  );
};

export default ChannelComponent;
