import { SkjemaGruppe, Radio, Checkbox } from 'nav-frontend-skjema';
import { ChangeEvent, FunctionComponent, useState, useEffect } from 'react';
import React from 'react';
import './KandidatlisterFilter.less';
import { Undertittel } from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

enum Stillingsfilter {
    MedStilling = 'MED_STILLING',
    UtenStilling = 'UTEN_STILLING',
    Ingen = '',
}

interface Props {
    kandidatlisterSokeKriterier: any;
    onVisMineKandidatlister: () => void;
    onVisAlleKandidatlister: () => void;
    onFilterChange: (verdi: string) => void;
}

export const KandidatlisterFilter: FunctionComponent<Props> = ({
    kandidatlisterSokeKriterier,
    onVisMineKandidatlister,
    onVisAlleKandidatlister,
    onFilterChange,
}) => {
    const [utenStilling, setUtenStilling] = useState<boolean>(false);
    const [medStilling, setMedStilling] = useState<boolean>(false);

    const onStillingsfilterCheck = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === Stillingsfilter.MedStilling) {
            setMedStilling(!medStilling);
        } else if (e.target.value === Stillingsfilter.UtenStilling) {
            setUtenStilling(!utenStilling);
        }
    };

    useEffect(() => {
        if (medStilling === utenStilling) {
            onFilterChange(Stillingsfilter.Ingen);
        } else {
            onFilterChange(
                medStilling ? Stillingsfilter.MedStilling : Stillingsfilter.UtenStilling
            );
        }
    }, [medStilling, utenStilling, onFilterChange]);

    return (
        <div className="kandidatlister-filter">
            <Ekspanderbartpanel apen tittel={<Undertittel>Kandidatlister</Undertittel>}>
                <div className="kandidatlister-filter__innhold">
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
                        <Checkbox
                            label="Med stilling"
                            name="kandidatlister-filter-stilling"
                            className="kandidatlister-filter__radio"
                            value="MED_STILLING"
                            checked={medStilling}
                            onChange={onStillingsfilterCheck}
                        />
                        <Checkbox
                            label="Uten stilling"
                            name="kandidatlister-filter-stilling"
                            className="kandidatlister-filter__radio"
                            value="UTEN_STILLING"
                            checked={utenStilling}
                            onChange={onStillingsfilterCheck}
                        />
                    </SkjemaGruppe>
                </div>
            </Ekspanderbartpanel>
        </div>
    );
};
