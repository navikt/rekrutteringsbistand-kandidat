import AlertStripe from 'nav-frontend-alertstriper';
import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import AppState from '../../AppState';
import './Varsling.less';

const Varsling: FunctionComponent = () => {
    const { innhold, alertType } = useSelector((state: AppState) => state.varsling);

    if (innhold === null) {
        return null;
    }

    return (
        <AlertStripe className="varsling" type={alertType} aria-live="assertive">
            {innhold}
        </AlertStripe>
    );
};

export default Varsling;
