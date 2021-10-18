import React, { ChangeEvent, FunctionComponent } from 'react';
import moment from 'moment';
import { Datepicker } from 'nav-datovelger';
import { RadioGruppe, Radio, SkjemaGruppe } from 'nav-frontend-skjema';
import { Normaltekst, Element } from 'nav-frontend-typografi';

export enum Svarfrist {
    ToDager = 'TO_DAGER',
    TreDager = 'TRE_DAGER',
    SyvDager = 'SYV_DAGER',
    Egenvalgt = 'EGENVALGT',
}

const svarfristLabels: Record<Svarfrist, string> = {
    [Svarfrist.ToDager]: '2 dager',
    [Svarfrist.TreDager]: '3 dager',
    [Svarfrist.SyvDager]: '7 dager',
    [Svarfrist.Egenvalgt]: 'Velg dato',
};

type Props = {
    tittel?: string;
    svarfrist: Svarfrist;
    onSvarfristChange: (event: ChangeEvent<HTMLInputElement>) => void;
    egenvalgtFrist?: string;
    egenvalgtFristFeilmelding?: string;
    onEgenvalgtFristChange: (dato?: string) => void;
    onEgenvalgtFristFeilmeldingChange: (feilmelding?: string) => void;
};

const VelgSvarfrist: FunctionComponent<Props> = ({
    tittel,
    svarfrist,
    onSvarfristChange,
    egenvalgtFrist,
    egenvalgtFristFeilmelding,
    onEgenvalgtFristChange,
    onEgenvalgtFristFeilmeldingChange,
}) => {
    const onEgenvalgtChange = (dato?: string) => {
        if (!dato || dato === 'Invalid date') {
            onEgenvalgtFristFeilmeldingChange('Feil datoformat, skriv inn dd.mm.åååå');
        } else if (moment(dato).isBefore(minDatoForEgenvalgtFrist)) {
            onEgenvalgtFristFeilmeldingChange('Svarfristen må settes minst to dager frem i tid.');
        } else if (moment(dato).isAfter(maksDatoForEgenvalgtFrist)) {
            onEgenvalgtFristFeilmeldingChange(`Svarfristen må være senest ${sisteGyldigeMaksDato}`);
        } else {
            onEgenvalgtFristFeilmeldingChange(undefined);
        }

        onEgenvalgtFristChange(dato);
    };

    return (
        <>
            <RadioGruppe
                className="foresporsel-om-deling-av-cv__radiogruppe"
                legend={
                    <>
                        <Element tag="span">{tittel || 'Frist for svar'}</Element>
                        <Normaltekst tag="span"> (må fylles ut)</Normaltekst>
                    </>
                }
                description="Kandidatene kan ikke svare etter denne fristen"
            >
                {Object.values(Svarfrist).map((value) => (
                    <Radio
                        key={value}
                        label={
                            <span id={`svarfrist-label_${value}`}>
                                {`${svarfristLabels[value]} ${lagBeskrivelseAvSvarfrist(value)}`}
                            </span>
                        }
                        name="svarfrist"
                        value={value}
                        checked={svarfrist === value}
                        onChange={onSvarfristChange}
                    />
                ))}
            </RadioGruppe>
            {svarfrist === Svarfrist.Egenvalgt && (
                <SkjemaGruppe
                    className="foresporsel-om-deling-av-cv__velg-svarfrist"
                    legend={<Element>Velg frist for svar (Frist ut valgt dato)</Element>}
                    feil={egenvalgtFristFeilmelding}
                >
                    <Datepicker
                        locale="nb"
                        inputProps={{
                            placeholder: 'dd.mm.åååå',
                            'aria-invalid': egenvalgtFristFeilmelding !== undefined,
                        }}
                        value={egenvalgtFrist}
                        limitations={{
                            minDate: minDatoForEgenvalgtFrist,
                            maxDate: maksDatoForEgenvalgtFrist,
                        }}
                        onChange={onEgenvalgtChange}
                        calendarSettings={{
                            showWeekNumbers: true,
                            position: 'fullscreen',
                        }}
                    />
                </SkjemaGruppe>
            )}
        </>
    );
};

const lagBeskrivelseAvSvarfrist = (svarfrist: Svarfrist): string => {
    const idag = moment();

    if (svarfrist === Svarfrist.ToDager) {
        idag.add(2, 'days');
    } else if (svarfrist === Svarfrist.TreDager) {
        idag.add(3, 'days');
    } else if (svarfrist === Svarfrist.SyvDager) {
        idag.add(7, 'days');
    } else {
        return '';
    }

    const frist = idag.toDate().toLocaleString('nb-NO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    return `(Frist ut ${frist})`;
};

export const lagSvarfristPåSekundet = (svarfrist: Svarfrist, egenvalgtFrist?: string) => {
    switch (svarfrist) {
        case Svarfrist.ToDager:
            return moment().add(3, 'days').startOf('day').toDate();
        case Svarfrist.TreDager:
            return moment().add(4, 'days').startOf('day').toDate();
        case Svarfrist.SyvDager:
            return moment().add(8, 'days').startOf('day').toDate();
        case Svarfrist.Egenvalgt:
            return moment(egenvalgtFrist).startOf('day').add(1, 'day').toDate();
    }
};

const sisteGyldigeMaksDato = moment().add(1, 'month').format('DD.MM.YYYY');
const minDatoForEgenvalgtFrist = moment().add(2, 'days').format('YYYY-MM-DD');
const maksDatoForEgenvalgtFrist = moment().add(1, 'month').format('YYYY-MM-DD');

export default VelgSvarfrist;
