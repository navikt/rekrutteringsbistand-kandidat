import React, { FunctionComponent, createRef, useState } from 'react';
import { Input } from 'nav-frontend-skjema';

import Søkeikon from './Søkeikon';
import './Navnefilter.less';

interface Props {
    value: string;
    onChange: (e: any) => void;
    onReset: () => void;
}

const Navnefilter: FunctionComponent<Props> = ({ value, onChange, onReset }) => {
    const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);

    const tittel = 'Søk etter navn i listen';
    const knappetekst = 'Fjern filter';

    const settFokusOgReset = () => {
        onReset();
        if (inputRef) {
            inputRef.focus();
        }
    };

    return (
        <div className="navnefilter">
            <Søkeikon />
            <Input
                inputRef={(e) => setInputRef(e)}
                className="navnefilter__input navnefilter__søkeikon"
                placeholder={tittel}
                label="Søk etter navn i listen"
                value={value}
                onChange={onChange}
            />
            {value.length > 0 && (
                <button
                    aria-live="polite"
                    className="navnefilter__tilbakestill"
                    title={knappetekst}
                    onClick={settFokusOgReset}
                />
            )}
        </div>
    );
};

export default Navnefilter;
