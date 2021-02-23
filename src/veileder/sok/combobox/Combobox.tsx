import {
    Combobox as ReachCombobox,
    ComboboxInput,
    ComboboxList,
    ComboboxOption,
    ComboboxPopover,
    ComboboxOptionText,
} from '@reach/combobox';
import React, { FunctionComponent } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { cssScopeForApp } from '../../../index';
import '@reach/combobox/styles.css';
import './Combobox.less';

type Props = {
    label: string;
    name: string;
    onSelect: (verdi: string) => void;
    onChange: (verdi: string) => void;
    placeholder: string;
    suggestions: string[];
    value: string;
};

const Combobox: FunctionComponent<Props> = ({
    label,
    name,
    onSelect,
    onChange,
    placeholder,
    suggestions,
    value,
}) => {
    return (
        <ReachCombobox aria-label={label} onSelect={onSelect}>
            <ComboboxInput
                autoComplete="off"
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="combobox skjemaelement__input"
            />
            <ComboboxPopover className={cssScopeForApp}>
                <ComboboxList persistSelection>
                    <Normaltekst key="exact">
                        <ComboboxOption className="combobox__forslag" value={value}>
                            Bare "<ComboboxOptionText />"
                        </ComboboxOption>
                    </Normaltekst>
                    {suggestions.map((geografi) => (
                        <Normaltekst key={geografi}>
                            <ComboboxOption className="combobox__forslag" value={geografi} />
                        </Normaltekst>
                    ))}
                </ComboboxList>
            </ComboboxPopover>
        </ReachCombobox>
    );
};

export default Combobox;
