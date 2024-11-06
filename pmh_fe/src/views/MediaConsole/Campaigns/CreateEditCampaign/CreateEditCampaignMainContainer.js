import React from 'react';
import CEFooter from 'views/MediaConsole/BudgetGrouping/CreateEditBudgetGroup/CEFooter.js';
import 'views/MediaConsole/Campaigns/CreateEditCampaign/CreateEditCampaignMainContainer.scss';
import { useState, useEffect } from 'react';
import CampaignChannels from './CampaignChannels';
import BusinessInformation from './BussinessInformation';
import GeneralConfiguration from './GeneralConfiguration';
import BudgetAndBidding from './BudgetAndBidding';
import Finish from './Finish';
import { PUBLICURL } from '_helpers/Utils/dashboardUtil';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CustomModal from 'views/UI/CustomModal';
import CreateAd from './CreateAd';

const FOOTER_BTNS = {
  cancel: {
    show: true,
    state: 'active',
    name: 'Cancel',
  },
  secondary: {
    show: true,
    state: 'active',
    name: 'Back',
  },
  primary: {
    show: true,
    state: 'active',
    name: 'Next',
  },
};

const STEPS = {
  CAMPAIGN_CHANNEL: 1,
  BUSSINES_INFORMATION: 2,
  GENERAL_CONFIGURATION: 3,
  CREATE_AD: 4,
  BUDGET_AND_BIDING: 5,
  FINISH: 6,
};

const SECTION = {
  CAMPAIGN_CHANNEL: 'campaign_channel',
  BUSSINES_INFORMATION: 'business_information',
  GENERAL_CONFIGURATION: 'general_configuration',
  CREATE_AD: 'create_ad',
  BUDGET_AND_BIDING: 'budget_and_biding',
  FINISH: 'finish',
};

const COMPLETION_STATE = {
  NOT_STARTED: 'not-started',
  PROGRESS: 'progress',
  FINISH: 'finish',
};

const PAGE_INFO = {
  CAMPAIGN_CHANNEL: {
    name: SECTION.CAMPAIGN_CHANNEL,
    state: COMPLETION_STATE.FINISH,
    //   data: FIELD_INFO.MANDATORY,
    active: true,
    label: 'Campaign Channels',
  },
  BUSSINES_INFORMATION: {
    name: SECTION.BUSSINES_INFORMATION,
    state: COMPLETION_STATE.PROGRESS,
    //   data: FIELD_INFO.OPTIONAL,
    active: false,
    label: 'Business Information',
  },
  GENERAL_CONFIGURATION: {
    name: SECTION.GENERAL_CONFIGURATION,
    state: COMPLETION_STATE.NOT_STARTED,
    // data: FIELD_INFO.OPTIONAL,
    active: false,
    label: 'General Configuration',
  },
  CREATE_AD: {
    name: SECTION.CREATE_AD,
    state: COMPLETION_STATE.NOT_STARTED,
    // data: FIELD_INFO.OPTIONAL,
    active: false,
    label: 'Create Ad',
  },
  BUDGET_AND_BIDING: {
    name: SECTION.BUDGET_AND_BIDING,
    state: COMPLETION_STATE.NOT_STARTED,
    // data: FIELD_INFO.OPTIONAL,
    active: false,
    label: 'Budget and Bidding',
  },
  FINISH: {
    name: SECTION.FINISH,
    state: COMPLETION_STATE.NOT_STARTED,
    //   data: FIELD_INFO.MANDATORY,
    active: false,
    label: 'Finish',
  },
};

const CreateEditCampaignMainContainer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['common']);
  const [showFooterBtns, setShowFooterBtns] = useState(FOOTER_BTNS);
  const [currentStep, setCurrentStep] = useState(STEPS.CAMPAIGN_CHANNEL);
  const [stepInfo, setStepInfo] = useState(
    JSON.parse(JSON.stringify(PAGE_INFO))
  );
  const [showCancelModal, setShowCancelModal] = useState(false);
  const getKeyByStepNumber = (stepNumber) => {
    // Inverting the STEPS object to map numbers to step names
    const invertedSteps = Object.entries(STEPS).reduce((acc, [key, value]) => {
      acc[value] = key;
      return acc;
    }, {});

    // Returning the step key by its number
    return invertedSteps[stepNumber] || 'Step not found';
  };
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const leftPanel = () => {
    return (
      <div className={'ce__left-panel-container'}>
        <div className={'ce__steps-title-container'}>
          <div className={'ce__steps-container-label-container'}>
            <img
              src={`${window.location.origin}${PUBLICURL}/assets/icons/steps.svg`}
              alt='Steps'
            />
            <span className={'ce__steps-container-label-title'}>Steps</span>
          </div>
        </div>
        <div className={'ce__steps-flow-container'}>
          {Object.entries(stepInfo)
            .filter((key) => key[0].toLowerCase() !== SECTION.FINISH)
            .map(([stepKey, stepValue]) => (
              <div key={stepKey} className={'ce__steps-item'}>
                <div
                  className={`${'ce__oval-icon'} ${stepValue.state === COMPLETION_STATE.PROGRESS
                      ? 'ce__blue-bg-color'
                      : stepValue.state === COMPLETION_STATE.NOT_STARTED
                        ? 'ce__gray-bg-color'
                        : 'ce__green-bg-color'
                    }`}
                >
                  {stepValue.state === COMPLETION_STATE.FINISH && (
                    <img
                      src={`${window.location.origin}${PUBLICURL}/assets/icons/checked-icon.svg`}
                      alt='Checked Icon'
                    />
                  )}
                  <span style={{ backgroundColor: 'inherit' }}></span>
                </div>
                <div className={'ce__steps-item-title'}>{stepValue.label}</div>
              </div>
            ))}
          <div className={'ce__steps-item'}>
            <div
              className={`${'ce__oval-icon'} ${currentStep === STEPS.FINISH
                  ? 'ce__green-bg-color'
                  : 'ce__gray-bg-color'
                }`}
            >
              <img
                src={`${window.location.origin}${PUBLICURL}/assets/icons/star-icon.svg`}
                alt='Finish'
              />
            </div>
            <div
              className={`${'ce__steps-item-title'}  ${currentStep === STEPS.FINISH
                  ? 'ce__green-color'
                  : 'ce__light-black-color'
                }`}
            >
              Finish
            </div>
          </div>
        </div>
      </div>
    );
  };

  const rightPanel = () => {
    return <div className={'ce__right-panel-container'}>{displayPage()}</div>;
  };

  const handleNext = () => {
    if (currentStep === STEPS.FINISH) return;
    setStepInfo((prevStepInfo) => {
      const updatedStepInfo = { ...prevStepInfo };
      updatedStepInfo[getKeyByStepNumber(currentStep)].state =
        COMPLETION_STATE.FINISH;
      updatedStepInfo[getKeyByStepNumber(currentStep + 1)].state =
        COMPLETION_STATE.PROGRESS;

      return updatedStepInfo;
    });

    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    if (currentStep === STEPS.CAMPAIGN_CHANNEL) return;
    setStepInfo((prevStepInfo) => {
      const updatedStepInfo = { ...prevStepInfo };
      updatedStepInfo[getKeyByStepNumber(currentStep)].state =
        COMPLETION_STATE.NOT_STARTED;
      updatedStepInfo[getKeyByStepNumber(currentStep - 1)].state =
        COMPLETION_STATE.PROGRESS;

      return updatedStepInfo;
    });
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const displayPage = () => {
    switch (currentStep) {
      case STEPS.BUSSINES_INFORMATION:
        return <BusinessInformation />;
      case STEPS.GENERAL_CONFIGURATION:
        return <GeneralConfiguration />;
      case STEPS.CREATE_AD:
        return <CreateAd />;
      case STEPS.BUDGET_AND_BIDING:
        return <BudgetAndBidding />;
      case STEPS.FINISH:
        return <Finish />;
      default:
        return null;
    }
  };

  return (
    <>
      <div>
        {currentStep === STEPS.CAMPAIGN_CHANNEL && <CampaignChannels />}
        {currentStep > STEPS.CAMPAIGN_CHANNEL && (
          <div className={'ce__panels_container'}>
            <div
              className={'ce__title-container'}
              style={{ marginBottom: '20px' }}
            >
              <div className={'ce__title-container-label'}>
                Google Ads Campaign
              </div>
            </div>
            <div className={'ce__panel'}>
              {leftPanel()}
              {rightPanel()}
            </div>
          </div>
        )}
      </div>
      <CEFooter
        onPrimaryBtnClick={handleNext}
        onSecondaryBtnClick={handleBack}
        onCancelBtnClick={() => {
          setShowCancelModal(true);
        }}
        showFooterBtns={showFooterBtns}
      />
      {showCancelModal && (
        <CustomModal
          open={true}
          onClose={() => setShowCancelModal(false)}
          onAccept={() => navigate('/campaigns')}
          title={t('site_titles.cancel_request')}
          onSaveText={t('button_text.yes_cancel')}
          onCloseText={t('button_text.no_back')}
          actionType={'cancel'}
          isGroove={true}
          isSmallModal={true}
        >
          <span>If you cancel the request for creating a new Campaign, the changes you have made will be discarded</span>
        </CustomModal>
      )}
    </>
  );
};

export default CreateEditCampaignMainContainer;
