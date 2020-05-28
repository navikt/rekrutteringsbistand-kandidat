import { SkjemaGruppe, Radio } from 'nav-frontend-skjema';
import { ChangeEvent, FunctionComponent } from 'react';
import React from 'react';
import './KandidatlisterFilter.less';
import { Undertittel } from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

interface Props {
    kandidatlisterSokeKriterier: any;
    onVisMineKandidatlister: () => void;
    onVisAlleKandidatlister: () => void;
    onFilterChange: (event: ChangeEvent<HTMLInputElement>) => void;
}
export const KandidatlisterFilter: FunctionComponent<Props> = ({
    kandidatlisterSokeKriterier,
    onVisMineKandidatlister,
    onVisAlleKandidatlister,
    onFilterChange,
}) => (
    <div className="kandidatlister-filter">
        <Ekspanderbartpanel apen tittel={<Undertittel>Kandidatlister</Undertittel>}>
            <SkjemaGruppe className="kandidatlister-filter__skjemagruppe">
                <Radio
                    label="Vis kun mine"
                    name="kandidatliste-filter-eierskap"
                    checked={kandidatlisterSokeKriterier.kunEgne}
                    onChange={() => onVisMineKandidatlister()}
                />
                <Radio
                    label="Vis alle sine"
                    name="kandidatliste-filter-eierskap"
                    checked={!kandidatlisterSokeKriterier.kunEgne}
                    onChange={() => onVisAlleKandidatlister()}
                />
            </SkjemaGruppe>
            <SkjemaGruppe className="kandidatlister-filter__skjemagruppe">
                <Radio
                    id="alle-kandidatlister-radio"
                    label="Alle kandidatlister"
                    name="kandidatlister-filter-stilling"
                    className="kandidatlister-filter__radio"
                    value=""
                    checked={kandidatlisterSokeKriterier.type === ''}
                    onChange={onFilterChange}
                />
                <Radio
                    id="kandidatlister-til-stilling-radio"
                    label="Kandidatlister knyttet til stilling"
                    name="kandidatlister-filter-stilling"
                    className="kandidatlister-filter__radio"
                    value="MED_STILLING"
                    checked={kandidatlisterSokeKriterier.type === 'MED_STILLING'}
                    onChange={onFilterChange}
                />
                <Radio
                    id="kandidatlister-uten-stilling-radio"
                    label="Kandidatlister uten stilling"
                    name="kandidatlister-filter-stilling"
                    className="kandidatlister-filter__radio"
                    value="UTEN_STILLING"
                    checked={kandidatlisterSokeKriterier.type === 'UTEN_STILLING'}
                    onChange={onFilterChange}
                />
            </SkjemaGruppe>
        </Ekspanderbartpanel>
    </div>
);
