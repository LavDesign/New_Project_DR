import React, {useEffect, useState} from 'react';
import DatePicker from "react-datepicker";
import moment from 'moment';
import CustomButton from '../UI/CustomButton';
import Backdrop from '../UI/Backdrop';
import styles from '../../_theme/modules/shared/DateRangeSelector.module.css'
import { trackButtonClick, getPageCategory,pageSubCategory } from '_helpers/Utils/segmentAnalyticsUtil';
import { useTranslation } from 'react-i18next';


const PRESET_RANGES = [
  {value: 1, label: 'Today'},
  {value: -1, label: 'Yesterday'},
  {value: 7, label: 'Last 7 Days'},
  {value: 30, label: 'Last 30 Days'},
  {value: 0, label: 'Custom'},
];

const DateRangeSelector = props => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDateRange,setSelectedDateRange]=useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());
  const [minDate, setMinDate] = useState(new Date());
  const [isShowError, setIsShowError] = useState(false);
  const [prevSelectedDateRange, setPrevSelectedDateRange] = useState(1);
  const { t } = useTranslation(['common']);

  const selectorButtonClickHandler = () =>  {
    setSelectedDateRange(prevSelectedDateRange);
    setIsOpen(true);
  }

  const onCloseHandler = () => {
    setPrevSelectedDateRange(1);
    setStartDate(null);
    setEndDate(null);
    setIsShowError(false);
    setIsOpen(false);
  };

  const updateDateState = (params) =>{
    setStartDate(params.startDate);
    setEndDate(params.endDate);
    setMinDate(params.minDate);
    setMaxDate(params.maxDate);
  }

  const onDateRangeSelectionHandler = params => {
    trackButtonClick(params.label, `${getPageCategory()} ${pageSubCategory.dateSelectorModal}`)
    updateDateState({startDate:null,endDate:null,minDate:null,maxDate:null})
    setIsShowError(false);
    setSelectedDateRange(params.value); 
  }

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleOkClick = () => {
    trackButtonClick(t('button_text.ok'), `${getPageCategory()} ${pageSubCategory.dateSelectorModal}`)
    setPrevSelectedDateRange(selectedDateRange);
    if(selectedDateRange === 0
      && (startDate === null
      || endDate === null 
      || moment(endDate).isSame(moment(startDate))))
        setIsShowError(true);
     else {
      setIsShowError(false);
      props.handleOkClick({startDate:startDate,endDate:endDate});
      setIsOpen(false);
     }
  }
  
  const handleCancelClick = () => {
    trackButtonClick(t('button_text.cancel'), `${getPageCategory()} ${pageSubCategory.dateSelectorModal}`)
    onCloseHandler();
    setStartDate(new Date());
    setEndDate(new Date());
  }
  
  const updateDate = (value) => {
    if(value === 1)
      updateDateState({startDate:new Date(),endDate:new Date(),minDate:new Date(),maxDate:new Date()})
    else if (value === -1) {
      let date = new Date(moment().subtract(1,'d').format('MM/DD/YYYY'));
      updateDateState({startDate:date,endDate:date,minDate:date,maxDate:date})
    } 
    else if (value === 7) {
      let date = new Date(moment().subtract(7,'d').format('MM/DD/YYYY'));
      updateDateState({startDate:date,endDate:new Date(),minDate:date,maxDate:new Date()})
    } 
    else if (value === 30) {
      let date = new Date(moment().subtract(30,'d').format('MM/DD/YYYY'));
      updateDateState({startDate:date,endDate:new Date(),minDate:date,maxDate:new Date()})
    }
    else {
      updateDateState({startDate:new Date(),endDate:new Date(),minDate:null,maxDate:null})
    }
  } 

  useEffect(() => {
    updateDate(selectedDateRange);
  },[selectedDateRange])

  return (
    <React.Fragment>
      <div>
        <CustomButton 
          className={"btn-light"}
          onClick={selectorButtonClickHandler}
          style={{ height: '100%' }} >
            {`${moment(startDate).format('MM/DD/YYYY')} - ${moment(endDate).format('MM/DD/YYYY')}`}
        </CustomButton>
        {isOpen && <Backdrop onClick={onCloseHandler}/>}
        <div className={`dropdown-menu${isOpen? ' show' : ''}`} style={{position: 'absolute', right: '0', minWidth: '600px'}}>
          <div className='row'>
            <div className='col col-sm-2 btn-group-vertical'>
              {PRESET_RANGES.map((elem, i) => (
                <button 
                  className={`btn btn-light ${styles['dr-type']} ${selectedDateRange === elem.value? styles.selected : ''}`}
                  style={{ borderRadius: '0rem'}} 
                  key={i} 
                  onClick={() => {onDateRangeSelectionHandler(elem)}}
                  >{elem.label}</button>))}
            </div>
            <div className='col col-sm-10'>
                <DatePicker 
                  inline
                  selectsRange
                  required ={selectedDateRange === 0}
                  selected={startDate}
                  startDate={startDate}
                  endDate={endDate}
                  maxDate={maxDate}
                  minDate={minDate}
                  monthsShown={2}
                  onChange={onChange}
                  /> 
            </div>
          </div> 
          
          <div className="row">
            { isShowError 
              ? <div className={`col-sm-6 offset-sm-2 ${styles['errorText']}`}>End date should be greater than start date.</div>
              : <div className='col-sm-6 offset-sm-2'></div>  
            }
            <div className='col-sm-4'>
              <button type="button" className={`btn btn-primary text-white ${styles.okButtonMargin}`}
                onClick={handleOkClick}>Ok</button>

              <button type="button" className={`btn btn-light ${styles.cancelButtonMargin}`} 
                onClick={handleCancelClick}>Cancel</button>
              </div>
          </div>
          
        </div>
      </div>
    </React.Fragment>
  );
};

export default DateRangeSelector;
