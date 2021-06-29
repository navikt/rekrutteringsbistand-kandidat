import React, { ChangeEvent, FunctionComponent, MouseEvent, useState } from 'react';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import Lenkeknapp from '../../../common/lenkeknapp/Lenkeknapp';
import useMinstEnKandidatErMarkert from '../useMinstEnKandidatErMarkert';
import { Normaltekst, Systemtittel, Element } from 'nav-frontend-typografi';
import './ForespørselOmDelingAvCv.less';
import ModalMedKandidatScope from '../../../common/ModalMedKandidatScope';
import { useSelector } from 'react-redux';
import AppState from '../../../AppState';
import AlertStripe from 'nav-frontend-alertstriper';
import { Radio, RadioGruppe, SkjemaGruppe } from 'nav-frontend-skjema';
import { Datovelger } from 'nav-datovelger';

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

const ForespørselOmDelingAvCv: FunctionComponent = () => {
    const [modalErÅpen, setModalErÅpen] = useState<boolean>(true); // TODO: Sett til false

    const kandidattilstander = useSelector(
        (state: AppState) => state.kandidatliste.kandidattilstander
    );
    const antallMarkerteKandidater = Object.values(kandidattilstander).filter(
        (tilstand) => tilstand.markert
    ).length;

    const [svarfrist, setSvarfrist] = useState<Svarfrist>(Svarfrist.TreDager);

    const minstEnKandidatErMarkert = useMinstEnKandidatErMarkert();
    const [ingenMarkertPopover, setIngenMarkertPopover] = useState<HTMLElement | undefined>(
        undefined
    );

    const onSvarfristChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSvarfrist(event.target.value as Svarfrist);
    };

    const onEgenvalgtDatoChange = (dato?: string) => {
        console.log('Dato:', dato);
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
                                    {svarfristLabels[value]}
                                </span>
                            }
                            name="svarfrist"
                            value={value}
                            checked={svarfrist === value}
                            onChange={onSvarfristChange}
                        />
                    ))}
                </RadioGruppe>
                <SkjemaGruppe
                    className="foresporsel-om-deling-av-cv__velg-svarfrist"
                    legend={<Element>Velg frist for svar (dd.mm.åååå)</Element>}
                >
                    <Datovelger
                        locale="nb"
                        avgrensninger={undefined} // TODO: Ikke tillat dato tilbake i tid
                        onChange={onEgenvalgtDatoChange}
                        kalender={{
                            plassering: 'fullskjerm',
                        }}
                    />
                </SkjemaGruppe>
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

export default ForespørselOmDelingAvCv;
