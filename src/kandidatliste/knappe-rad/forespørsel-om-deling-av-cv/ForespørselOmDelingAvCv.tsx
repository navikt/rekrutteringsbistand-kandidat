import React, { ChangeEvent, FunctionComponent, MouseEvent, useState } from 'react';
import moment from 'moment';
import { Datovelger } from 'nav-datovelger';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Element, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Radio, RadioGruppe, SkjemaGruppe } from 'nav-frontend-skjema';
import AlertStripe from 'nav-frontend-alertstriper';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';

import { ForespørselOutboundDto } from './Forespørsel';
import Lenkeknapp from '../../../common/lenkeknapp/Lenkeknapp';
import ModalMedKandidatScope from '../../../common/ModalMedKandidatScope';
import useMinstEnKandidatErMarkert from '../useMinstEnKandidatErMarkert';
import './ForespørselOmDelingAvCv.less';
import { KandidatIKandidatliste } from '../../kandidatlistetyper';

enum Svarfrist {
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
    stillingsId: string;
    markerteKandidater: KandidatIKandidatliste[];
};

const ForespørselOmDelingAvCv: FunctionComponent<Props> = ({ stillingsId, markerteKandidater }) => {
    const [modalErÅpen, setModalErÅpen] = useState<boolean>(false);

    const antallMarkerteKandidater = markerteKandidater.length;

    const [svarfrist, setSvarfrist] = useState<Svarfrist>(Svarfrist.ToDager);
    const [egenvalgtFrist, setEgenvalgtFrist] = useState<string | undefined>();
    const [egenvalgtFristFeilmelding, setEgenvalgtFristFeilmelding] = useState<
        string | undefined
    >();

    const minstEnKandidatErMarkert = useMinstEnKandidatErMarkert();
    const [ingenMarkertPopover, setIngenMarkertPopover] = useState<HTMLElement | undefined>(
        undefined
    );

    const onSvarfristChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSvarfrist(event.target.value as Svarfrist);
    };

    const onEgenvalgtFristChange = (dato?: string) => {
        if (!dato || dato === 'Invalid date') {
            setEgenvalgtFristFeilmelding('Feil datoformat, skriv inn dd.mm.åååå');
        } else {
            setEgenvalgtFristFeilmelding(undefined);
        }

        setEgenvalgtFrist(dato);
    };

    const toggleIngenMarkertPopover = (event: MouseEvent<HTMLElement>) => {
        setIngenMarkertPopover(ingenMarkertPopover ? undefined : event.currentTarget);
    };

    const lukkIngenMarkertPopover = () => {
        setIngenMarkertPopover(undefined);
    };

    const åpneModal = () => {
        setModalErÅpen(true);
    };

    const lukkModal = () => {
        setModalErÅpen(false);
    };

    const onDelStillingClick = () => {
        if (egenvalgtFristFeilmelding) {
            return;
        }

        const forespørselOmDelingAvCv: ForespørselOutboundDto = {
            aktorIder: markerteKandidater.map((kandidat) => kandidat.aktørid!),
            stillingsId,
            svarfrist: lagSvarfristPåSekundet(svarfrist, egenvalgtFrist),
        };

        return forespørselOmDelingAvCv;
    };

    return (
        <div className="foresporsel-om-deling-av-cv">
            <Lenkeknapp
                tittel="Del stillingen med de markerte kandidatene"
                onClick={minstEnKandidatErMarkert ? åpneModal : toggleIngenMarkertPopover}
                className="kandidatlisteknapper__knapp DelMedKandidat"
            >
                <i className="DelMedKandidat__icon" />
                Del med kandidat
            </Lenkeknapp>
            <ModalMedKandidatScope
                isOpen={modalErÅpen}
                contentLabel="Del stillingen med de markerte kandidatene"
                onRequestClose={lukkModal}
                className="foresporsel-om-deling-av-cv__modal"
            >
                <Systemtittel className="blokk-s">
                    Del med {antallMarkerteKandidater}{' '}
                    {antallMarkerteKandidater === 1 ? 'kandidat' : 'kandidater'} i aktivitetsplanen
                </Systemtittel>
                <Normaltekst className="blokk-s">
                    Det opprettes et stillingskort i Aktivitetsplanen. Kandidatene vil bli varlset
                    på SMS, og kan svare "ja" eller "nei" til at CV-en skal bli delt med
                    arbeidsgiver. Du vil se svaret i kandidatlisten.
                </Normaltekst>
                <AlertStripe type="info" form="inline" className="blokk-m">
                    <Element>
                        Stillingsannonsen vil bli delt med kandidaten. Det er viktig at
                        annonseteksten er informativ og lett å forstå.
                    </Element>
                </AlertStripe>
                <RadioGruppe
                    className="foresporsel-om-deling-av-cv__radiogruppe"
                    legend={
                        <>
                            <Element tag="span">Frist for svar</Element>{' '}
                            <Normaltekst tag="span">(må fylles ut)</Normaltekst>
                        </>
                    }
                    description="Kandidatene kan ikke svare etter denne fristen"
                >
                    {Object.values(Svarfrist).map((value) => (
                        <Radio
                            key={value}
                            label={
                                <span id={`svarfrist-label_${value}`}>
                                    {`${svarfristLabels[value]} ${lagBeskrivelseAvSvarfrist(
                                        value
                                    )}`}
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
                        <Datovelger
                            input={{
                                placeholder: 'dd.mm.åååå',
                            }}
                            locale="nb"
                            datoErGyldig={egenvalgtFristFeilmelding === undefined}
                            avgrensninger={{
                                minDato: minDatoForEgenvalgtFrist,
                                maksDato: maksDatoForEgenvalgtFrist,
                            }}
                            onChange={onEgenvalgtFristChange}
                            valgtDato={egenvalgtFrist}
                            kalender={{
                                plassering: 'fullskjerm',
                            }}
                        />
                    </SkjemaGruppe>
                )}
                <div className="foresporsel-om-deling-av-cv__knapper">
                    <Hovedknapp
                        className="foresporsel-om-deling-av-cv__del-stilling-knapp"
                        mini
                        onClick={onDelStillingClick}
                    >
                        Del stilling
                    </Hovedknapp>
                    <Knapp mini onClick={lukkModal}>
                        Avbryt
                    </Knapp>
                </div>
            </ModalMedKandidatScope>
            <Popover
                ankerEl={ingenMarkertPopover}
                onRequestClose={lukkIngenMarkertPopover}
                orientering={PopoverOrientering.Under}
            >
                <Normaltekst className="foresporsel-om-deling-av-cv__ingen-valgt-popover">
                    Du må huke av for kandidatene du ønsker å dele stillingen med.
                </Normaltekst>
            </Popover>
        </div>
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

    const frist = idag.toDate().toLocaleString('no-NB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    return `(Frist ut ${frist})`;
};

const lagSvarfristPåSekundet = (svarfrist: Svarfrist, egenvalgtFrist?: string) => {
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

const minDatoForEgenvalgtFrist = moment().add(2, 'days').format('YYYY-MM-DD');
const maksDatoForEgenvalgtFrist = moment().add(1, 'month').format('YYYY-MM-DD');

export default ForespørselOmDelingAvCv;
