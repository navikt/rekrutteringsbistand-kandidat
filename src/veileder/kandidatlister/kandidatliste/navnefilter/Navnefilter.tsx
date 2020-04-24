import React, { FunctionComponent } from 'react';
import Søkeikon from './Søkeikon';
import './Navnefilter.less';
import { Input } from 'nav-frontend-skjema';

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
            <Input
                className="navnefilter__input navnefilter__søkeikon"
                placeholder={tittel}
                label="Søk etter navn i listen"
                value={value}
                onChange={onChange}
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
