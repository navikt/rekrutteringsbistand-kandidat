import { Fieldset, Radio } from 'nav-frontend-skjema';
import { ChangeEvent, FunctionComponent } from 'react';
import React from 'react';
import './KandidatlisterFilter.less';

interface Props {
    kandidatlisterSokeKriterier: any;
    onFilterChange: (event: ChangeEvent<HTMLInputElement>) => void;
}
export const KandidatlisterFilter: FunctionComponent<Props> = ({
    kandidatlisterSokeKriterier,
    onFilterChange,
}) => (
    <div className="kandidatlister-filter">
        <Fieldset legend="Kandidatlister">
            <Radio
                id="alle-kandidatlister-radio"
                label="Alle kandidatlister"
                name="kandidatlisterFilter"
                className="kandidatlister-filter__radio"
                value=""
                checked={kandidatlisterSokeKriterier.type === ''}
                onChange={onFilterChange}
            />
            <Radio
                id="kandidatlister-til-stilling-radio"
                label="Kandidatlister knyttet til stilling"
                name="kandidatlisterFilter"
                className="kandidatlister-filter__radio"
                value="MED_STILLING"
                checked={kandidatlisterSokeKriterier.type === 'MED_STILLING'}
                onChange={onFilterChange}
            />
            <Radio
                id="kandidatlister-uten-stilling-radio"
                label="Kandidatlister uten stilling"
                name="kandidatlisterFilter"
                className="kandidatlister-filter__radio"
                value="UTEN_STILLING"
                checked={kandidatlisterSokeKriterier.type === 'UTEN_STILLING'}
                onChange={onFilterChange}
            />
        </Fieldset>
    </div>
);
