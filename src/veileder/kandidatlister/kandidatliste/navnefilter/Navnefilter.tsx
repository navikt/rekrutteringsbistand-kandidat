import React, { FunctionComponent } from 'react';
import './Navnefilter.less';

interface Props {
    value: string;
    onChange: (e: any) => void;
    onReset: () => void;
}

const Navnefilter: FunctionComponent<Props> = ({ value, onChange, onReset }) => {
    const tittel = 'Søk etter navn i listen';
    const knappetekst = 'Fjern filter ';

    return (
        <>
            <input
                placeholder={tittel}
                value={value}
                onChange={onChange}
                className="navnefilter navnefilter__søkeikon"
            />
            {value.length > 0 && (
                <button
                    className="navnefilter__tilbakestill"
                    title={knappetekst}
                    onClick={onReset}
                />
            )}
        </>
    );
};

export default Navnefilter;
