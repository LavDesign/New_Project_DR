import React, { useState, useEffect } from 'react';
import CustomModal from '../UI/CustomModal';
import { useTranslation } from 'react-i18next';
import styles from '../../_theme/modules/shared/RoasKpi.module.css';
import Select, {components} from 'react-select'
import { getReadbleFormula } from '_helpers/columns/cellFormatters';
import { getPlatformsInfoById } from '_helpers/Utils/availablePlatformsInfo'; 
import { getStandardKpiMetrics } from '_helpers/columns/cellFormatters';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import { trackButtonClick, getPageCategory, pageSubCategory } from '_helpers/Utils/segmentAnalyticsUtil';
import { getAdobeConversions } from '_services/adobeData';
import Spinner from 'common/Spinner';

const CustomFormula = props => {
    const { t } = useTranslation(['common']);

    const onCloseHandler = () => {
        props?.setOpenModal(false);
        props?.setClearCampaignId(true);  
        trackButtonClick(t('button_text.cancel'),`${getPageCategory()} ${pageSubCategory.customFormulaModal}`)
        
    }
    const checkIfFormulaValid = (value) => {
        value = value.replaceAll(" ", "");
        const startWithDigit = /^\d+/;
        const startsWithOp = /^[+-\/*]+/;
        const endsWithOp = /[+-\/*]+$/;
        const twoQuotes = /''+/;
        const numberWithOpPrefix = /[+-\/*]\d+/;
        const numberWithOpSuffix = /\d+[+-\/*]/;
        const containsDigits = /\d+/;
        const digitsAtTheEnd = /\d+$/;
        const quoteFollowedByDigit = /'\d+/;

        if(containsDigits.test(value) && !digitsAtTheEnd.test(value)){
            if(numberWithOpPrefix.test(value)){
                return numberWithOpSuffix.test(value) || startWithDigit.test(value) || startsWithOp.test(value) || endsWithOp.test(value) || twoQuotes.test(value) || quoteFollowedByDigit.test(value);
            }
        }
        
        if(startWithDigit.test(value) || startsWithOp.test(value) || endsWithOp.test(value) || twoQuotes.test(value) || quoteFollowedByDigit.test(value))
            return false;
        
        return true;
    }
    const { Option } = components;
    const platform = getPlatformsInfoById(props.params.cell.row.original.platform).platform;
    const [formulaText, setFormulaText] = useState("");
    const [formulaName, setFormulaName] = useState("");
    const [options, setOptions] = useState(getStandardKpiMetrics(platform));
    const [kpiKey, setKpiKey] = useState("");
    const [isName, setIsName] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const isFormulaValid = checkIfFormulaValid(formulaText);
    const [formulaFormat, setFormulaFormat] = useState("integer");
    const tooltipText = `(1) ${t('validation_messages.kpi_custom_format_perc_note')}` + '\n' +
                        `(2) ${t('validation_messages.kpi_custom_format_currency_perc_note')}` +  '\n' +
                        `(3) ${t('validation_messages.kpi_custom_format_note')}`

    useEffect(() => {
        const kpiLabel = props.params.cell.getValue();
        updateOptions(kpiLabel);
        setKpiKey(props.params.cell.column.id);
      }, []);
     
      const updateOptions = async (kpiLabel) => {
        var adobeMetrics = await getAdobeConversions({ campaignKey: props.params.campaignKey }) || [];
        if (adobeMetrics?.length > 0) 
            setOptions([...getStandardKpiMetrics(platform), ...adobeMetrics]);
        if(platform !== undefined && kpiLabel?.length > 0 && kpiLabel.includes("=")){
            setFormulaName(getReadbleFormula({ kpiLabel: kpiLabel.split("=")[0], metrics: options }));
            setFormulaText(getReadbleFormula({ kpiLabel: kpiLabel.split("=")[1], metrics:  [...options, ...adobeMetrics]}));
            setFormulaFormat(kpiLabel.split("=")[2]);
        }
        setIsLoading(false);
    }

    const OptionComp = props => (
       <Option {...props}>
          <label>{props.data.label}</label>
        </Option>
      );
    const onChangeHandler = (option) => {
        trackButtonClick(option.label,`${getPageCategory()} ${pageSubCategory.customFormulaModal}`, 'Dropdown')
        setFormulaText(formulaText + option.label);
    }

    const onTextChangeHandler = (e) => setFormulaText(e.target.value);

    const onNameTextChangeHandler = (e) => {
        setFormulaName(e.target.value);
        if(e.target.value.length === 0)
            setIsName(false);
        else
            setIsName(true);
        
    }

    const onFormatChangeHandler = (e) =>  {
        trackButtonClick(t(`site_texts.${e.target.value}`),`${getPageCategory()} ${pageSubCategory.customFormulaModal}`, 'Radio Button')
        setFormulaFormat(e.target.value);
    }

    const onAcceptHandler = () => {
        trackButtonClick(t('button_text.ok'),`${getPageCategory()} ${pageSubCategory.customFormulaModal}`)
        let tempFormulaText = formulaText;
        const formula = tempFormulaText.split("'").filter((element, index) => index % 2)

        options?.map(exp => 
            {   
                if (formula.includes(exp.label.replaceAll("'", ""))) {
                    tempFormulaText = tempFormulaText.replaceAll(exp.label, exp.value);
                }
            });
        let formulaNameField = `formula_name_${kpiKey}`;
        const value = {};
        value['value'] = tempFormulaText;
        value['formulaNameKey'] = formulaNameField;
        value['formulaNameValue'] = formulaName.length === 0 ? tempFormulaText : formulaName;
        value['formatKey'] = `format_${kpiKey}`;
        value['formatValue'] = formulaFormat.length > 0 ? formulaFormat : 'integer';
        if(formulaText?.length > 0 && isFormulaValid === true){
            props.handleSave(value);
            props.setOpenModal(false);
        }
    }
 
    return (
        <>
            {
                props.modalOpen &&
                <CustomModal
                    open={props.modalOpen}
                    onClose={onCloseHandler}
                    onAccept={onAcceptHandler}
                    modalWidth={'16rem'}
                    title={t('site_titles.custom_formula')}
                    onSaveText={t('button_text.save')}
                    onCloseText={t('button_text.cancel')}
                >
                    <div>
                        {isLoading ? (
                            <Spinner />
                        ) : (
                        <>
                            <div>
                                <label className={`${styles['label']}`}>
                                    {t('site_texts.name')}
                                </label>
                                <input className={`${styles['text_name']}`} type="text" name="name" value={isName === false && formulaName.length === 0 ? formulaText : formulaName} onChange={(e) => onNameTextChangeHandler(e)} />
                            </div>
                        
                            <div>
                                <label className={`${styles['label']}`}>
                                    {t('site_texts.units_delivered_formula')}
                                </label>
                                <div role={"select"}>
                                    <Select 
                                        id='kpiSelector'  
                                        defaultValue={""}
                                        onChange={onChangeHandler}
                                        options={new Array(options)[0]}
                                        components={{ Option: OptionComp }}
                                    />
                                </div>
                                <input type="text" role={"input"} value={formulaText} onChange={(e) => onTextChangeHandler(e)} className={`${styles['text_revenue_custom_formula']} ${isFormulaValid ? '' : 'is-invalid'}`}  />
                                {formulaText?.length > 0 && !isFormulaValid && <div id="validationFormula" className="invalid-feedback">{t('validation_messages.kpi_custom_formula')}</div>}
                            </div>
                            
                            <div style={{marginTop: '3%'}} >
                                <label className={`${styles['label']}`}>
                                    {t('site_texts.select_format')}
                                </label><br/>
                                <input role={"radio"} style={{marginRight: '1%'}}  type='radio' name='format' value={'integer'} checked={formulaFormat === 'integer'} onChange={(e) => onFormatChangeHandler(e)}/>
                                    {t('site_texts.integer')}
                                <input role={"radio"} style={{marginRight: '1%', marginLeft: '3%'}} type='radio' name='format' value={'decimal'} checked={formulaFormat === 'decimal'} onChange={(e) => onFormatChangeHandler(e)} />
                                    {t('site_texts.decimal')}
                                <input role={"radio"} style={{marginRight: '1%', marginLeft: '3%'}} type='radio' name='format' value={'currency'} checked={formulaFormat === 'currency'} onChange={(e) => onFormatChangeHandler(e)}/>
                                    {t('site_texts.currency')}
                            </div> <br/>
                            <p className={`${styles['p']}`}>
                                {t('validation_messages.custom_validation')}
                                <b>{t('validation_messages.custom_validation_note')}</b>
                                <Tooltip title= {tooltipText}><InfoOutlinedIcon style={{width: '3%'}}></InfoOutlinedIcon></Tooltip>
                            </p>
                        </>)} 
                    </div>
                </CustomModal >
            }
        </>
    )
}
export default CustomFormula;
