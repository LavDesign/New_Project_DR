import 'views/MediaConsole/Campaigns/CreateEditCampaign/CreateEditCampaignMainContainer.scss';
import 'views/MediaConsole/Campaigns/CreateEditCampaign/GeneralConfiguration.scss'
import 'views/MediaConsole/Campaigns/CreateEditCampaign/CreateAd.scss'
import 'views/MediaConsole/Campaigns/CreateEditCampaign/BussinessInformation';
import styles from '_theme/modules/BudgetGrouping/CreateEditBudgetGroup/CreateEditMainContainer.module.css';
import InputFieldWithLabel from 'views/MediaConsole/Common/FormComponents/InputFieldWithLabel';
import UploadFileContainer from 'views/MediaConsole/Common/FormComponents/UploadFileContainer';
import DropdownFieldWithLabel from 'views/MediaConsole/Common/FormComponents/DropdownFieldWithLabel';
import { PUBLICURL } from '_helpers/Utils/dashboardUtil';

const CreateAd = () => {
    return (
        <div className={styles['ce__section']}>
            <div className={'ce__panels_container'}>
                <div className={'ce__title-container'}>
                    <div className={'ce__title-container-sub-label'}>
                        URLs
                    </div>
                </div>
                <br />
                <div className={styles['field-container']}>
                    <InputFieldWithLabel
                        label='Enter the main URL'
                        value={''}
                        placeholder='https://example.com'
                    />
                </div>
                <br />
                <div className={styles['field-container']}>
                    <InputFieldWithLabel
                        label='Site Links'
                        value={''}
                        placeholder='https://example.com'
                    />
                </div>
                <br />
                <div className="icon-text-container">
                    <img src={`${window.location.origin}${PUBLICURL}/assets/icons/plus-gray.svg`} alt="icono" />
                    <label className='basic-label'>Add Site Link</label>
                </div>
                <br />
                <div className={'ce__title-container-sub-label'}>
                    Media
                </div>
                <br />
                <label className='label-title'>
                    Images
                </label>
                <UploadFileContainer LimitText={'Add a maximum of 20 images'}/>
                <br />
                <label className='label-title'>
                    Logos
                </label>
                <UploadFileContainer LimitText={'Add a maximum of 5 logos'}/>
                <br />
                <label className='label-title'>
                    Videos
                </label>
                <UploadFileContainer LimitText={'Add a maximum of 5 videos'}/>
                <br />
                <div className={'ce__title-container-sub-label'}>
                    Text Fields
                </div>
                <br />
                <div className='gf__container'>
                    <div className='left-content'>
                        <div className={styles['field-container']}>
                            <InputFieldWithLabel
                                label='Titles'
                                value={''}
                                placeholder='Type Title'
                            />
                        </div>
                        <br />
                        <div className="icon-text-container">
                            <img src={`${window.location.origin}${PUBLICURL}/assets/icons/plus-gray.svg`} alt="plus" />
                            <label className='basic-label'>Add Title</label>
                        </div>
                    </div>
                    <div className='right-content'>
                        <div className={styles['field-container']}>
                            <DropdownFieldWithLabel
                                label='CTA Button'
                                optionsArray={[]}
                                placeholder='Select CTA'
                            />
                        </div>
                    </div>
                </div>
                <br />
                <div className={styles['field-container']}>
                    <InputFieldWithLabel
                        label='Long Title'
                        value={''}
                        placeholder='Type Long Title'
                    />
                </div>
                <br />
                <div className="icon-text-container">
                    <img src={`${window.location.origin}${PUBLICURL}/assets/icons/plus-gray.svg`} alt="plus" />
                    <label className='basic-label'>Add Long Title</label>
                </div>
                <br />
                <label className='label-title'>
                    Description
                </label>
                <div className={'key-words-field'}>
                    <span>Description</span>
                </div>
                <br />
                <div className="icon-text-container">
                    <img src={`${window.location.origin}${PUBLICURL}/assets/icons/plus-gray.svg`} alt="plus" />
                    <label className='basic-label'>Add Description</label>
                </div>
            </div>
        </div>
    );
}

export default CreateAd;