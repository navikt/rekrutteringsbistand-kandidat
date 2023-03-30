import React, { FunctionComponent, useState } from 'react';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { Button, TextField } from '@navikt/ds-react';
import css from './Navnefilter.module.css';

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
            console.log('ref', inputRef);
            inputRef.focus();
        }
    };

    return (
        <div className={css.navnefilter}>
            <MagnifyingGlassIcon className={css.search} fontSize="1.5rem" />
            <TextField
                ref={(e) => setInputRef(e)}
                className="navnfilter-textfield"
                label={tittel}
                value={value}
                onChange={onChange}
                placeholder={tittel}
            />
            {value.length > 0 && (
                <Button
                    aria-live="polite"
                    className={css.tilbakestill}
                    title={knappetekst}
                    onClick={settFokusOgReset}
                    variant="tertiary"
                />
            )}
        </div>
    );
};

export default Navnefilter;
