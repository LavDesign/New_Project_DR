import 'views/MediaConsole/Campaigns/CreateEditCampaign/CreateEditCampaignMainContainer.scss';

const CampaignChannels = ({
}) => {
    return (
        <div className={'ce__container'}>
            <div className={'ce__title-container'}>
                <div className={'ce__title-container-label'}>
                    New Campaign
                </div>
            </div>
            <div className={'ce__panel'} style={{display: 'block'}}>
                <div className={'ce__title-underline'}></div> {/* Added this line */}

                <div className={'ce__main-panel-container'}>
                    <div className={'ce__title-container-sub-label'} style={{marginTop: '24px'}}>
                        Choose the channels you want to create a campaign for
                    </div>
                    <div className='ce__channel-checkboxes-container' >
                        <div>
                            <input className='ce__channel_box' type="checkbox" id="googleAds" name="googleAds"/>
                            <label className='ce__checkbox-label' htmlFor="googleAds">Google Ads</label>
                        </div>
                        <div >
                            <input className='ce__channel_box' type="checkbox" id="msAds" name="msAds" />
                            <label className='ce__checkbox-label' htmlFor="msAds">Microsoft Ads</label>
                        </div>
                        <div >
                            <input className='ce__channel_box' type="checkbox" id="meta" name="meta" />
                            <label className='ce__checkbox-label' htmlFor="meta">Meta</label>
                        </div>
                        <div >
                            <input className='ce__channel_box' type="checkbox" id="dv360" name="dv360" />
                            <label className='ce__checkbox-label' htmlFor="dv360">DV360</label>
                        </div>
                    </div>
                    <div className='ce__channel-checkboxes-container' >
                        <div>
                            <input className='ce__channel_box' type="checkbox" id="cm360" name="cm360" />
                            <label className='ce__checkbox-label' htmlFor="cm360">CM360</label>
                        </div>
                        <div >
                            <input className='ce__channel_box' type="checkbox" id="tiktok" name="tiktok" />
                            <label className='ce__checkbox-label' htmlFor="tiktok">TikTok</label>
                        </div>
                        <div >
                            <input className='ce__channel_box' type="checkbox" id="tripAdvisor" name="tripAdvisor" />
                            <label className='ce__checkbox-label' htmlFor="tripAdvisor">Trip Advisor</label>
                        </div>
                        <div >
                            <input className='ce__channel_box' type="checkbox" id="trivago" name="trivago" />
                            <label className='ce__checkbox-label' htmlFor="trivago">Trivago</label>
                        </div>
                    </div>
                    <div className='ce__channel-checkboxes-container' >
                        <div>
                            <input className='ce__channel_box' type="checkbox" id="kayak" name="kayak" />
                            <label className='ce__checkbox-label' htmlFor="kayak">Kayak</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CampaignChannels;