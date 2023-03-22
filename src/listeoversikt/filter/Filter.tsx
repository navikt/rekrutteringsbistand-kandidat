import React from 'react';
import { useState, useEffect } from 'react';
import { Accordion, Checkbox, CheckboxGroup, Radio, RadioGroup } from '@navikt/ds-react';
import css from './Filter.module.css';

enum Eierskapsfilter {
    KunMine = 'KUN_MINE',
    AlleSine = 'ALLE_SINE',
}

enum Stillingsfilter {
    MedStilling = 'MED_STILLING',
    UtenStilling = 'UTEN_STILLING',
    Ingen = '',
}

type Props = {
    kandidatlisterSokeKriterier: any;
    onVisMineKandidatlister: () => void;
    onVisAlleKandidatlister: () => void;
    onFilterChange: (verdi: string) => void;
};

const Filter = ({
    kandidatlisterSokeKriterier,
    onVisMineKandidatlister,
    onVisAlleKandidatlister,
    onFilterChange,
}: Props) => {
    const [utenStilling, setUtenStilling] = useState<boolean>(
        kandidatlisterSokeKriterier.type === Stillingsfilter.UtenStilling
    );

    const [medStilling, setMedStilling] = useState<boolean>(
        kandidatlisterSokeKriterier.type === Stillingsfilter.MedStilling
    );

    const handleEierskapsfilterChange = (eierskap: Eierskapsfilter) => {
        if (eierskap === Eierskapsfilter.KunMine) {
            onVisMineKandidatlister();
        } else {
            onVisAlleKandidatlister();
        }
    };

    const handleStillingsfilterChange = (type: Stillingsfilter[]) => {
        setMedStilling(type.includes(Stillingsfilter.MedStilling));
        setUtenStilling(type.includes(Stillingsfilter.UtenStilling));
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

    const eierskapsfilter: Eierskapsfilter = kandidatlisterSokeKriterier.kunEgne
        ? Eierskapsfilter.KunMine
        : Eierskapsfilter.AlleSine;

    const stillingsfilter: Stillingsfilter[] = [];
    if (utenStilling) stillingsfilter.push(Stillingsfilter.UtenStilling);
    if (medStilling) stillingsfilter.push(Stillingsfilter.MedStilling);

    return (
        <div className="kandidatlister-filter">
            <Accordion>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Kandidatlister</Accordion.Header>
                    <Accordion.Content className={css.innhold}>
                        <RadioGroup
                            hideLegend
                            legend="Eierskap"
                            className={css.eierskap}
                            onChange={handleEierskapsfilterChange}
                            value={eierskapsfilter}
                        >
                            <Radio value={Eierskapsfilter.KunMine}>Vis kun mine</Radio>
                            <Radio value={Eierskapsfilter.AlleSine}>Vis alle sine</Radio>
                        </RadioGroup>

                        <CheckboxGroup
                            hideLegend
                            legend="Stilling"
                            onChange={handleStillingsfilterChange}
                            value={stillingsfilter}
                        >
                            <Checkbox value={Stillingsfilter.MedStilling}>Med stilling</Checkbox>
                            <Checkbox value={Stillingsfilter.UtenStilling}>Uten stilling</Checkbox>
                        </CheckboxGroup>
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion>
        </div>
    );
};

export default Filter;
