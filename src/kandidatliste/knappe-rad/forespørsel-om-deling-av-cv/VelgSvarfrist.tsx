import moment from 'moment';
import { Datepicker } from 'nav-datovelger';
import { RadioGruppe, Radio, SkjemaGruppe } from 'nav-frontend-skjema';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import React, { ChangeEvent, FunctionComponent } from 'react';

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
    svarfrist: Svarfrist;
    onSvarfristChange: (event: ChangeEvent<HTMLInputElement>) => void;
    egenvalgtFrist?: string;
    egenvalgtFristFeilmelding?: string;
    onEgenvalgtFristChange: (dato?: string) => void;
    onEgenvalgtFristFeilmeldingChange: (feilmelding?: string) => void;
};

const VelgSvarfrist: FunctionComponent<Props> = ({
    svarfrist,
    onSvarfristChange,
    egenvalgtFrist,
    egenvalgtFristFeilmelding,
    onEgenvalgtFristChange,
    onEgenvalgtFristFeilmeldingChange,
}) => {
    const onEgenvalgtFristChange2 = (dato?: string) => {
        if (!dato || dato === 'Invalid date') {
            onEgenvalgtFristFeilmeldingChange('Feil datoformat, skriv inn dd.mm.åååå');
        } else if (moment(dato).isBefore(minDatoForEgenvalgtFrist)) {
            onEgenvalgtFristFeilmeldingChange('Svarfristen må settes minst to dager frem i tid.');
        } else if (moment(dato).isAfter(maksDatoForEgenvalgtFrist)) {
            onEgenvalgtFristFeilmeldingChange(`Svarfristen må være før ${førsteUgyldigeMaksDato}`);
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
                        <Element tag="span">Frist for svar</Element>
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
                        onChange={onEgenvalgtFristChange}
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

const minDatoForEgenvalgtFrist = moment().add(2, 'days').format('YYYY-MM-DD');
const maksDatoForEgenvalgtFrist = moment().add(1, 'month').format('YYYY-MM-DD');

export default VelgSvarfrist;
