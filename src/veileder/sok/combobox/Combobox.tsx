import {
    Combobox as ReachCombobox,
    ComboboxInput,
    ComboboxList,
    ComboboxOption,
    ComboboxPopover,
} from '@reach/combobox';
import React, { FunctionComponent } from 'react';
import '@reach/combobox/styles.css';

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
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
            <ComboboxPopover>
                <ComboboxList persistSelection>
                    {suggestions.map((geografi) => (
                        <ComboboxOption key={geografi} value={geografi} />
                    ))}
                </ComboboxList>
            </ComboboxPopover>
        </ReachCombobox>
    );
};

export default Combobox;
