import React, { FunctionComponent } from 'react';
import Søkeikon from './Søkeikon';
import './Navnefilter.less';

interface Props {
    value: string;
    onChange: (e: any) => void;
    onReset: () => void;
}

const Navnefilter: FunctionComponent<Props> = ({ value, onChange, onReset }) => {
    const tittel = 'Søk etter navn i listen';
    const knappetekst = 'Fjern filter';

    return (
        <div className="navnefilter">
            <Søkeikon />
            <label className="navnefilter__label">Søk etter navn i listen</label>
            <input
                placeholder={tittel}
                value={value}
                onChange={onChange}
                className="navnefilter__input navnefilter__søkeikon"
            />
            {value.length > 0 && (
                <button
                    className="navnefilter__tilbakestill"
                    title={knappetekst}
                    onClick={onReset}
                />
            )}
        </div>
    );
};

export default Navnefilter;
