import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Spinner from './Spinner';

/**
 * Renders child if isTrue equals TRUE, otherwise renders self FallbackDefault component or node passed at fallback param.
 * Optional can use timeoutSec to render self TimeoutFallbackDefault component or node passed at timeoutFallback param after certain seconds if isTrue is not satisfied.
 *
 * @summary Conditionally renders child
 * @author Kevin Vega <kevin.vega@accenture.com>
 *
 * Created at     : 2022-08-09 20:41:45
 * Last modified  : 2022-08-09 23:42:09
 */

const ShouldRender = props => {
    const { t } = useTranslation(['common']);

    const FallbackDefault = () => (
        <thead><tr><td> <Spinner /></td></tr></thead>
    )

    const TimeoutFallbackDefault = () => (
        <div className="p-3 text-center alert-danger">
            <h4 className="alert-heading">{t('template.error.title')}</h4>
            <p>{t('template.error.comment')}</p>
        </div>
    )

    const { ifTrue, children } = props;
    const Fallback = (props.fallback) ? () => <>{props.fallback}</> : FallbackDefault;
    const TimeoutFallback = (props.timeoutFallback) ? () => <>{props.timeoutFallback}</> : TimeoutFallbackDefault;
    const [timeoutEnd, setTimeoutEnd] = useState(false);
    let timer = useRef(0);

    useEffect(() => {
        const startTimer = async () => {
          await new Promise(resolve => setTimeout(resolve, props.timeoutSec * 1000));
          setTimeoutEnd(true);
        };

        if (props.timeoutSec) {
          const intervalId = setInterval(startTimer, props.timeoutSec * 1000);
          return () => clearInterval(intervalId);
        }
      }, [props.timeoutSec]);

    useEffect(()=>{
        ifTrue && clearTimeout(timer.current);
    }, [ifTrue])

    return (
        timeoutEnd
            ? <TimeoutFallback />
            : ifTrue
                ? children
                : <Fallback />
    )

}

ShouldRender.propTypes = {
    ifTrue: PropTypes.any.isRequired,
    children: PropTypes.node.isRequired,
    fallback: PropTypes.any,
    timeoutSec: PropTypes.number,
    timeoutFallback: PropTypes.any,
};

export default ShouldRender;

