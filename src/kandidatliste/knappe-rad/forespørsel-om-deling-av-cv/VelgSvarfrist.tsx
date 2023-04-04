import React, { ChangeEvent, FunctionComponent } from 'react';
import css from './ForespørselOmDelingAvCv.module.css';
import moment from 'moment';
import {
    BodyShort,
    DateValidationT,
    Label,
    Radio,
    RadioGroup,
    UNSAFE_useDatepicker as useDatepicker,
} from '@navikt/ds-react';
import { UNSAFE_DatePicker as DatePicker } from '@navikt/ds-react';

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
    egenvalgtFrist?: Date;
    egenvalgtFristFeilmelding?: string;
    onEgenvalgtFristChange: (dato?: Date) => void;
    onEgenvalgtFristFeilmeldingChange: (feilmelding?: string) => void;
};

const VelgSvarfrist: FunctionComponent<Props> = ({
    tittel,
    svarfrist,
    onSvarfristChange,
    egenvalgtFristFeilmelding,
    onEgenvalgtFristChange,
    onEgenvalgtFristFeilmeldingChange,
}) => {
    const onEgenvalgtChange = (dato?: Date) => {
        if (egenvalgtFristFeilmelding) {
            onEgenvalgtFristFeilmeldingChange(undefined);
        }
        if (dato) {
            onEgenvalgtFristChange(dato);
        } else {
            onEgenvalgtFristChange(undefined);
        }
    };

    const onEgenvalgValidation = (datoValidation: DateValidationT) => {
        if (datoValidation.isBefore) {
            onEgenvalgtFristFeilmeldingChange('Svarfristen må settes minst to dager frem i tid.');
        } else if (datoValidation.isAfter) {
            onEgenvalgtFristFeilmeldingChange(`Svarfristen må være senest ${sisteGyldigeMaksDato}`);
        } else if (datoValidation.isEmpty) {
            onEgenvalgtFristFeilmeldingChange(undefined);
        }
    };

    const { datepickerProps, inputProps } = useDatepicker({
        fromDate: moment().add(2, 'days').toDate(),
        toDate: moment().add(1, 'month').toDate(),
        onDateChange: onEgenvalgtChange,
        onValidate: onEgenvalgValidation,
        openOnFocus: false,
        inputFormat: 'dd.MM.yyyy',
        allowTwoDigitYear: false,
    });

    return (
        <>
            <RadioGroup
                size="small"
                legend={
                    <>
                        <Label as="span" size="small">
                            {tittel || 'Frist for svar'}
                        </Label>
                        <BodyShort as="span"> (må fylles ut)</BodyShort>
                    </>
                }
                description="Kandidatene kan ikke svare etter denne fristen"
                defaultValue={Svarfrist.ToDager}
            >
                {Object.values(Svarfrist).map((value) => (
                    <Radio key={value} name="svarfrist" value={value} onChange={onSvarfristChange}>
                        <span id={`svarfrist-label_${value}`}>
                            {`${svarfristLabels[value]} ${lagBeskrivelseAvSvarfrist(value)}`}
                        </span>
                    </Radio>
                ))}
            </RadioGroup>
            {svarfrist === Svarfrist.Egenvalgt && (
                <div className={css.datepicker}>
                    <DatePicker {...datepickerProps}>
                        <DatePicker.Input
                            {...inputProps}
                            error={egenvalgtFristFeilmelding}
                            label="Velg frist for svar (Frist ut valgt dato)"
                            placeholder="dd.mm.yyyy"
                            size="small"
                        />
                    </DatePicker>
                </div>
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

export const lagSvarfristPåSekundet = (svarfrist: Svarfrist, egenvalgtFrist?: Date) => {
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

export default VelgSvarfrist;
