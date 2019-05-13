import * as React from 'react';
import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Flatknapp, Hovedknapp, Knapp } from 'pam-frontend-knapper';
import { Element, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Textarea } from 'nav-frontend-skjema';
import NavFrontendModal from 'nav-frontend-modal';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { RemoteData, RemoteDataTypes } from '../../felles/common/remoteData';
import { EndreType, KandidatlisteTypes, Notat, Notater } from './kandidatlisteReducer';
import { formatterDato, formatterTid } from '../../felles/common/dateUtils';
import Lenkeknapp from '../../felles/common/Lenkeknapp';
import './Notater.less';

const NotatVisning : FunctionComponent<{ notat: Notat }> = ({ notat }) => (
    <div className="NotatVisning">
        <span className="typo-undertekst">{`${formatterDato(new Date(notat.lagtTilTidspunkt))} kl. ${formatterTid(new Date(notat.lagtTilTidspunkt))}`}</span>
        { notat.notatEndret && <span className="typo-undertekst"> - </span>}
        { notat.notatEndret && <span className="NotatVisning-redigert-tag typo-undertekst">redigert</span>}
        <Normaltekst className="NotatVisning-tekst">{notat.tekst}</Normaltekst>
    </div>
);

const NotatRad: FunctionComponent<{ notat: Notat, setModalState: (ModalState) => void }> = ({ notat, setModalState }) => (
    <div className="NotatRad">
        <NotatVisning notat={notat} />
        <div className="NotatRad-knapper">
            <Lenkeknapp className="Edit " onClick={() => { setModalState(redigereModalState(notat, notat.tekst))}}>
                <i className="Edit__icon" />
            </Lenkeknapp>
            <Lenkeknapp className="Delete" onClick={() => { setModalState(sletteModalState(notat))}}>
                <i className="Delete__icon" />
            </Lenkeknapp>
        </div>
    </div>
);

const Notatliste: FunctionComponent<{ notater: RemoteData<Array<Notat>>, setModalState: (ModalState) => void, hentNotater: () => void, antallNotater: number}> = ({ notater, setModalState, hentNotater, antallNotater }) => {
    switch (notater.kind) {
        case RemoteDataTypes.SUCCESS:
            if (notater.data.length > 0) {
                return (
                    <div className="Notatliste Notatliste-top-border">
                        {notater.data.map(notat => <NotatRad key={`notat-${notat.notatId}`} notat={notat} setModalState={setModalState} />)}
                    </div>
                );
            }
            return null;

        case RemoteDataTypes.LOADING:
            if (antallNotater > 0) {
                return (
                    <div className="Notatliste Notatliste-spinner-wrapper">
                        <NavFrontendSpinner />
                    </div>
                );
            }
            return null;

        case RemoteDataTypes.FAILURE:
            // TODO: Endre design på feilmelding
            return (
                <div className="Notatliste">
                    <Normaltekst>
                        Beklager, notatene kan ikke vises. Trykk på knappen under for å prøve igjen.
                    </Normaltekst>
                    <Knapp onClick={hentNotater}>
                        Prøv igjen
                    </Knapp>
                </div>
            );

        default:
            return null;
    }
};

type NyttNotatState = { open: false } | { open: true, venterPaLagring: boolean, value: string }

const lukketNotatFelt: () => NyttNotatState = () => ({
    open: false
});

const apentNotatFelt: (string, boolean?) => NyttNotatState = (value: string, venterPaLagring = false) => ({
    open: true,
    venterPaLagring,
    value
});

const NyttNotat: FunctionComponent<{ opprettNotat: (string) => void, opprettState: RemoteData<undefined> }> = ({ opprettNotat, opprettState }) => {
    const [nyttNotatState, setNyttNotatState] = useState(lukketNotatFelt());
    useEffect(() => {
        if (opprettState.kind === RemoteDataTypes.SUCCESS && nyttNotatState.open && nyttNotatState.venterPaLagring) {
            setNyttNotatState(lukketNotatFelt());
        }
    }, [opprettState, nyttNotatState]);

    if (nyttNotatState.open) {
        const onLagreClick = () => {
            if (!nyttNotatState.venterPaLagring) {
                setNyttNotatState(apentNotatFelt(nyttNotatState.value, true));
                opprettNotat(nyttNotatState.value);
            }
        };
        return (
            <div className="RedigerNotat">
                <Textarea
                    label="Skriv inn notat"
                    value={nyttNotatState.value}
                    textareaClass="RedigerNotat-tekstfelt"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setNyttNotatState(apentNotatFelt(e.target.value))
                    }}
                />
                <Hovedknapp
                    mini
                    onClick={onLagreClick}
                    className="RedigerNotat-hovedknapp"
                    spinner={nyttNotatState.venterPaLagring}>
                    Lagre
                </Hovedknapp>
                <Flatknapp mini onClick={() => { setNyttNotatState(lukketNotatFelt()) }}>Avbryt</Flatknapp>
            </div>
        )
    }
    return <Hovedknapp mini onClick={() => { setNyttNotatState(apentNotatFelt(''))}}>Skriv notat</Hovedknapp>;
};


enum ModalStateType {
    LUKKET = 'LUKKET',
    REDIGERE_MODAL_AAPEN = 'REDIGERE_MODAL_AAPEN',
    SLETTE_MODAL_AAPEN = 'SLETTE_MODAL_AAPEN'
}

interface LukketModalState { kind : ModalStateType.LUKKET }
interface RedigereModalState { kind : ModalStateType.REDIGERE_MODAL_AAPEN, notat: Notat, tekst: string, venterPaLagring: boolean }
interface SletteModalState { kind : ModalStateType.SLETTE_MODAL_AAPEN, notat: Notat, venterPaLagring: boolean  }

const lukketModalState : () => ModalState = () => ({
    kind : ModalStateType.LUKKET
});

const redigereModalState : (Notat, string, boolean?) => ModalState = (notat, tekst, venterPaLagring = false) => ({
    kind : ModalStateType.REDIGERE_MODAL_AAPEN,
    notat,
    tekst,
    venterPaLagring
});

const sletteModalState : (Notat, boolean?) => ModalState = (notat, venterPaLagring = false) => ({
    kind : ModalStateType.SLETTE_MODAL_AAPEN,
    notat,
    venterPaLagring
});

type ModalState = LukketModalState | RedigereModalState | SletteModalState

interface RedigerNotatModalProps {
    notat: Notat,
    tekst: string,
    loading: boolean,
    setModalState : (ModalState) => void,
    redigerNotat: (notat: Notat, tekst: string) => void
}

const RedigerNotatModal : FunctionComponent<RedigerNotatModalProps> = ({ notat, tekst, loading, setModalState, redigerNotat }) => {
    const onLagreClick = () => {
        if (!loading) {
            setModalState(redigereModalState(notat, tekst, true));
            redigerNotat(notat, tekst);
        }
    };
    return (
        <NavFrontendModal contentLabel="Test" isOpen  onRequestClose={() => {setModalState(lukketModalState())}}>
            <div className="NotatModal RedigerNotat">
                <Systemtittel className="NotatModal-tittel">Rediger notat</Systemtittel>
                <Textarea
                    label="Skriv inn notat"
                    value={tekst}
                    textareaClass="RedigerNotat-tekstfelt"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => { setModalState(redigereModalState(notat, e.target.value))}}
                />
                <Hovedknapp onClick={onLagreClick} className="RedigerNotat-hovedknapp" spinner={loading}>Lagre</Hovedknapp>
                <Knapp onClick={() => { setModalState(lukketModalState()) }}>Avbryt</Knapp>
            </div>
        </NavFrontendModal>
    );
};

interface SlettNotatModalProps {
    notat: Notat,
    loading: boolean,
    setModalState : (ModalState) => void,
    slettNotat: (notat: Notat) => void
}

const SlettNotatModal : FunctionComponent<SlettNotatModalProps> = ({ notat, loading, setModalState, slettNotat }) => {
    const onLagreClick = () => {
        if (!loading) {
            setModalState(sletteModalState(notat, true));
            slettNotat(notat)
        }
    };
    return (
        <NavFrontendModal contentLabel="Test" isOpen  onRequestClose={() => {setModalState(lukketModalState())}}>
            <div className="NotatModal">
                <Systemtittel className="NotatModal-tittel">Slett notat</Systemtittel>
                <Normaltekst className="NotatModal-beskrivelse">Er du sikker på at du ønsker å slette notatet?</Normaltekst>
                <NotatVisning notat={notat}/>
                <Hovedknapp onClick={onLagreClick} className="RedigerNotat-hovedknapp" spinner={loading}>Slett</Hovedknapp>
                <Knapp onClick={() => { setModalState(lukketModalState()) }}>Avbryt</Knapp>
            </div>
        </NavFrontendModal>
    );
};

interface ModalerProps {
    modalState: ModalState,
    setModalState: (ModalState) => void
    redigerNotat: (notat: Notat, tekst: string) => void,
    slettNotat: (notat: Notat) => void,
    notater: Notater
}

const Modaler: FunctionComponent<ModalerProps> = ({ modalState, setModalState, redigerNotat, slettNotat, notater }) => {
    useEffect(() => {
        if ((modalState.kind === ModalStateType.REDIGERE_MODAL_AAPEN && modalState.venterPaLagring && notater.redigerState.kind === RemoteDataTypes.SUCCESS)
            || (modalState.kind === ModalStateType.SLETTE_MODAL_AAPEN && modalState.venterPaLagring && notater.slettState.kind === RemoteDataTypes.SUCCESS)) {
            setModalState(lukketModalState());
        }
    }, [notater, modalState]);

    if (modalState.kind === ModalStateType.REDIGERE_MODAL_AAPEN) {
        return (
            <RedigerNotatModal
                notat={modalState.notat}
                tekst={modalState.tekst}
                loading={modalState.venterPaLagring}
                setModalState={setModalState}
                redigerNotat={redigerNotat}
            />
        );
    } else if (modalState.kind === ModalStateType.SLETTE_MODAL_AAPEN) {
        return (
            <SlettNotatModal
                notat={modalState.notat}
                loading={modalState.venterPaLagring}
                setModalState={setModalState}
                slettNotat={slettNotat}
            />
        );
    }
    return null;
};

interface Props {
    notater: Notater,
    antallNotater: number,
    kandidatlisteId: string,
    kandidatnr: string,
    hentNotater: () => void,
    opprettNotat: (tekst: string) => void,
    redigerNotat: (notat: Notat, tekst: string) => void,
    slettNotat: (notat: Notat) => void,
    resetEndreNotatState: (endreType: EndreType) => void
}

const Notater : FunctionComponent<Props> = ({ notater, antallNotater, hentNotater, opprettNotat, redigerNotat, slettNotat }) => {
    useEffect(() => { hentNotater() }, []);
    const [ modalState, setModalState ] = useState(lukketModalState());

    return (
        <div className="Notater">
            <Modaler
                modalState={modalState}
                setModalState={setModalState}
                redigerNotat={redigerNotat}
                slettNotat={slettNotat}
                notater={notater}
            />
            <div>
                <Element className="Notater-overskrift">Notater ({antallNotater})</Element>

                <Normaltekst className="Notater-beskrivelse">
                    Her skal du kun skrive korte meldinger og statusoppdateringer.
                    Sensitive opplysninger skrives <strong>ikke</strong> her.
                </Normaltekst>
                <Normaltekst className="Notater-beskrivelse">Notatene blir automatisk slettet etter 3 måneder.</Normaltekst>

                <NyttNotat opprettNotat={opprettNotat} opprettState={notater.opprettState} />
                <Notatliste notater={notater.notater} setModalState={setModalState} hentNotater={hentNotater} antallNotater={antallNotater} />
            </div>
        </div>
    );
};

const mapDispatchToProps = (dispatch, { kandidatlisteId, kandidatnr }) => ({
    hentNotater: () => dispatch({ type: KandidatlisteTypes.HENT_NOTATER, kandidatlisteId, kandidatnr }),
    opprettNotat: (tekst: string) => dispatch({ type: KandidatlisteTypes.OPPRETT_NOTAT, kandidatlisteId, kandidatnr, tekst}),
    redigerNotat: (notat: Notat, tekst: string) => dispatch({ type: KandidatlisteTypes.REDIGER_NOTAT, kandidatlisteId, kandidatnr, notat, tekst}),
    slettNotat: (notat: Notat) => dispatch({ type: KandidatlisteTypes.SLETT_NOTAT, kandidatlisteId, kandidatnr, notat }),
    resetEndreNotatState: (endreType: EndreType) => dispatch({ type: 'RESET_ENDRE_NOTAT_STATE', kandidatlisteId, kandidatnr, endreType })
});

export default connect(null, mapDispatchToProps)(Notater);
