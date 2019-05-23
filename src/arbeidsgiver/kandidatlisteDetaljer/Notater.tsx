import * as React from 'react';
import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Flatknapp, Hovedknapp, Knapp } from 'pam-frontend-knapper';
import { Element, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Textarea } from 'nav-frontend-skjema';
import NavFrontendModal from 'nav-frontend-modal';
import NavFrontendSpinner from 'nav-frontend-spinner';
import AlertStripe from 'nav-frontend-alertstriper';
import { RemoteData, RemoteDataTypes } from '../../felles/common/remoteData';
import { EndreType, KandidatlisteTypes, Notat, Notater } from './kandidatlisteReducer';
import { formatterDato, formatterTid } from '../../felles/common/dateUtils';
import Lenkeknapp from '../../felles/common/Lenkeknapp';
import { AlertStripeState, useTimeoutState } from '../../felles/common/hooks/useTimeoutState';
import { FadingAlertStripeLiten } from '../../felles/common/HjelpetekstFading';
import './Notater.less';

const NotatVisning: FunctionComponent<{ notat: Notat }> = ({ notat }) => (
    <div className="NotatVisning">
        <span className="typo-undertekst">{`${formatterDato(new Date(notat.lagtTilTidspunkt))} kl. ${formatterTid(new Date(notat.lagtTilTidspunkt))}`}</span>
        {notat.notatEndret && <span className="typo-undertekst"> - </span>}
        {notat.notatEndret && <span className="NotatVisning-redigert-tag typo-undertekst">redigert</span>}
        <Normaltekst className="NotatVisning-tekst">{notat.tekst}</Normaltekst>
    </div>
);

const NotatRad: FunctionComponent<{ notat: Notat, setModalState: (ModalState) => void }> = ({ notat, setModalState }) => (
    <div className="NotatRad">
        <NotatVisning notat={notat} />
        <div className="NotatRad-knapper">
            <Lenkeknapp className="Edit " onClick={() => { setModalState(redigereModalState(notat, notat.tekst))}} tittel="Rediger notat">
                <i className="Edit__icon" />
            </Lenkeknapp>
            <Lenkeknapp className="Delete" onClick={() => { setModalState(sletteModalState(notat))}} tittel="Slett notat">
                <i className="Delete__icon" />
            </Lenkeknapp>
        </div>
    </div>
);

const Notatliste: FunctionComponent<{ notater: RemoteData<Array<Notat>>, setModalState: (ModalState) => void, hentNotater: () => void, antallNotater: number }> = ({ notater, setModalState, hentNotater, antallNotater }) => {
    switch (notater.kind) {
        case RemoteDataTypes.SUCCESS:
            if (notater.data.length > 0) {
                return (
                    <div className="Notatliste Notatliste-top-border">
                        {notater.data.map(notat => (
                            <NotatRad
                                key={`notat-${notat.notatId}`}
                                notat={notat}
                                setModalState={setModalState}
                            />
                        ))}
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
            return (
                <div className="Notatliste">
                    <AlertStripe type="feil" solid>
                        <div className="AlertStripe__med-knapp">
                            <span>Beklager, notatene kan ikke vises</span>
                            <Hovedknapp onClick={hentNotater} mini>Prøv på nytt</Hovedknapp>
                        </div>
                    </AlertStripe>
                </div>
            );

        default:
            return null;
    }
};

type NyttNotatState = { open: false } | { open: true, value: string, feil?: { feilmelding: string } }

const lukketNotatFelt: () => NyttNotatState = () => ({
    open: false
});

const apentNotatFelt: (string) => NyttNotatState = (value: string) => ({
    open: true,
    value,
    feil: value.length > 3000 ? { feilmelding: 'Notatet er for langt' } : undefined
});

interface NyttNotatProps {
    opprettNotat: (string) => void,
    opprettState: RemoteData<undefined>,
    setFailureMelding: (string) => void,
    resetEndreNotatState: (endreType: EndreType) => void
}

const NyttNotat: FunctionComponent<NyttNotatProps> = ({ opprettNotat, opprettState, setFailureMelding, resetEndreNotatState }) => {
    const [nyttNotatState, setNyttNotatState] = useState(lukketNotatFelt());
    useEffect(() => {
        if (opprettState.kind === RemoteDataTypes.SUCCESS && nyttNotatState.open) {
            setNyttNotatState(lukketNotatFelt());
            resetEndreNotatState(EndreType.OPPRETT);
        } else if (opprettState.kind === RemoteDataTypes.FAILURE && nyttNotatState.open) {
            setFailureMelding('Det skjedde en feil ved lagring av notatet');
            resetEndreNotatState(EndreType.OPPRETT);
        }
    }, [opprettState, nyttNotatState]);

    if (nyttNotatState.open) {
        const onLagreClick = () => {
            if (opprettState.kind !== RemoteDataTypes.LOADING && !nyttNotatState.feil) {
                opprettNotat(nyttNotatState.value);
            }
        };
        return (
            <div className="RedigerNotat">
                <Textarea
                    label="Skriv inn notat"
                    value={nyttNotatState.value}
                    feil={nyttNotatState.feil}
                    maxLength={3000}
                    textareaClass="RedigerNotat-tekstfelt"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setNyttNotatState(apentNotatFelt(e.target.value))
                    }}
                />
                <Hovedknapp
                    mini
                    onClick={onLagreClick}
                    className="RedigerNotat-hovedknapp"
                    spinner={opprettState.kind === RemoteDataTypes.LOADING}
                >
                    Lagre
                </Hovedknapp>
                <Flatknapp mini onClick={() => { setNyttNotatState(lukketNotatFelt()) }}>Avbryt</Flatknapp>
            </div>
        )
    }
    return <Knapp mini onClick={() => { setNyttNotatState(apentNotatFelt(''))}}>Skriv notat</Knapp>;
};

enum ModalStateType {
    LUKKET = 'LUKKET',
    REDIGERE_MODAL_AAPEN = 'REDIGERE_MODAL_AAPEN',
    SLETTE_MODAL_AAPEN = 'SLETTE_MODAL_AAPEN'
}

interface LukketModalState {
    kind: ModalStateType.LUKKET
}

interface RedigereModalState {
    kind: ModalStateType.REDIGERE_MODAL_AAPEN,
    notat: Notat,
    tekst: string,
    feil?: {
        feilmelding: string
    }
}

interface SletteModalState {
    kind: ModalStateType.SLETTE_MODAL_AAPEN,
    notat: Notat
}

const lukketModalState: () => ModalState = () => ({
    kind: ModalStateType.LUKKET
});

const redigereModalState: (Notat, string) => ModalState = (notat, tekst) => ({
    kind: ModalStateType.REDIGERE_MODAL_AAPEN,
    notat,
    tekst,
    feil: tekst.length > 3000 ? { feilmelding: 'Notatet er for langt' } : undefined
});

const sletteModalState: (Notat) => ModalState = (notat) => ({
    kind: ModalStateType.SLETTE_MODAL_AAPEN,
    notat
});

type ModalState = LukketModalState | RedigereModalState | SletteModalState

interface RedigerNotatModalProps {
    notat: Notat,
    tekst: string,
    feil?: {
        feilmelding: string
    }
    loading: boolean,
    setModalState: (ModalState) => void,
    redigerNotat: (notat: Notat, tekst: string) => void,
    alertState: AlertStripeState
}

const RedigerNotatModal: FunctionComponent<RedigerNotatModalProps> = ({ notat, tekst, feil, loading, setModalState, redigerNotat, alertState }) => {
    const onLagreClick = () => {
        if (!loading && !feil) {
            redigerNotat(notat, tekst);
        }
    };
    return (
        <NavFrontendModal className="NotatModal" contentLabel="Test" isOpen onRequestClose={() => {setModalState(lukketModalState())}}>
            <div className="RedigerNotat">
                <FadingAlertStripeLiten alertStripeState={alertState} />
                <Systemtittel className="NotatModal-tittel">Rediger notat</Systemtittel>
                <Textarea
                    label="Skriv inn notat"
                    value={tekst}
                    feil={feil}
                    maxLength={3000}
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
    setModalState: (ModalState) => void,
    slettNotat: (notat: Notat) => void,
    alertState: AlertStripeState
}

const SlettNotatModal: FunctionComponent<SlettNotatModalProps> = ({ notat, loading, setModalState, slettNotat, alertState }) => {
    const onLagreClick = () => {
        if (!loading) {
            slettNotat(notat);
        }
    };
    return (
        <NavFrontendModal  className="NotatModal" contentLabel="Test" isOpen  onRequestClose={() => {setModalState(lukketModalState())}}>
            <FadingAlertStripeLiten alertStripeState={alertState} />
            <Systemtittel className="NotatModal-tittel">Slett notat</Systemtittel>
            <Normaltekst className="NotatModal-beskrivelse">Er du sikker på at du ønsker å slette notatet?</Normaltekst>
            <NotatVisning notat={notat}/>
            <Hovedknapp onClick={onLagreClick} className="RedigerNotat-hovedknapp" spinner={loading}>Slett</Hovedknapp>
            <Knapp onClick={() => { setModalState(lukketModalState()) }}>Avbryt</Knapp>
        </NavFrontendModal>
    );
};

interface ModalerProps {
    modalState: ModalState,
    setModalState: (ModalState) => void
    redigerNotat: (notat: Notat, tekst: string) => void,
    slettNotat: (notat: Notat) => void,
    resetEndreNotatState: (endreType: EndreType) => void,
    notater: Notater
}

const Modaler: FunctionComponent<ModalerProps> = ({ modalState, setModalState, redigerNotat, slettNotat, notater, resetEndreNotatState }) => {
    const [redigereAlertState, clearRedigerTimouts, , setRedigerFailureMelding] = useTimeoutState();
    const [sletteAlertState, clearSletteTimouts, , setSletteFailureMelding] = useTimeoutState();
    useEffect(() => {
        if (modalState.kind === ModalStateType.REDIGERE_MODAL_AAPEN) {
            if (notater.redigerState.kind === RemoteDataTypes.SUCCESS) {
                setModalState(lukketModalState());
                resetEndreNotatState(EndreType.REDIGER);
            } else if (notater.redigerState.kind === RemoteDataTypes.FAILURE) {
                setRedigerFailureMelding('Det skjedde en feil ved lagring av notatet');
                resetEndreNotatState(EndreType.REDIGER);
            }
        }
        if (modalState.kind === ModalStateType.SLETTE_MODAL_AAPEN) {
            if (notater.slettState.kind === RemoteDataTypes.SUCCESS) {
                setModalState(lukketModalState());
                resetEndreNotatState(EndreType.SLETT);
            } else if (notater.slettState.kind === RemoteDataTypes.FAILURE) {
                setSletteFailureMelding('Det skjedde en feil ved sletting av notatet');
                resetEndreNotatState(EndreType.SLETT);
            }
        }
    }, [notater, modalState]);

    useEffect(() => {
        return () => {
            clearRedigerTimouts();
            clearSletteTimouts();
        };
    }, []);

    if (modalState.kind === ModalStateType.REDIGERE_MODAL_AAPEN) {
        return (
            <RedigerNotatModal
                notat={modalState.notat}
                tekst={modalState.tekst}
                feil={modalState.feil}
                loading={notater.redigerState.kind === RemoteDataTypes.LOADING}
                setModalState={setModalState}
                redigerNotat={redigerNotat}
                alertState={redigereAlertState}
            />
        );
    } else if (modalState.kind === ModalStateType.SLETTE_MODAL_AAPEN) {
        return (
            <SlettNotatModal
                notat={modalState.notat}
                loading={notater.slettState.kind === RemoteDataTypes.LOADING}
                setModalState={setModalState}
                slettNotat={slettNotat}
                alertState={sletteAlertState}
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
    resetEndreNotatState: (endreType: EndreType) => void,
    setFailureMelding: (innhold: string) => void
}

const Notater: FunctionComponent<Props> = ({ notater, antallNotater, hentNotater, opprettNotat, redigerNotat, slettNotat, setFailureMelding, resetEndreNotatState }) => {
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
                resetEndreNotatState={resetEndreNotatState}
            />
            <div>
                <Element className="Notater-overskrift">Notater ({antallNotater})</Element>

                <Normaltekst className="Notater-beskrivelse">
                    Her skal du kun skrive korte meldinger og statusoppdateringer.
                    Sensitive opplysninger skrives <strong>ikke</strong> her.
                </Normaltekst>
                <Normaltekst className="Notater-beskrivelse">Alle i bedriften din som har tilgang til tjenesten kan lese, endre og slette notatene.</Normaltekst>

                <NyttNotat opprettNotat={opprettNotat} opprettState={notater.opprettState} setFailureMelding={setFailureMelding} resetEndreNotatState={resetEndreNotatState} />
                <Notatliste notater={notater.notater} setModalState={setModalState} hentNotater={hentNotater} antallNotater={antallNotater} />
            </div>
        </div>
    );
};

const mapDispatchToProps = (dispatch, { kandidatlisteId, kandidatnr }) => ({
    hentNotater: () => dispatch({ type: KandidatlisteTypes.HENT_NOTATER, kandidatlisteId, kandidatnr }),
    opprettNotat: (tekst: string) => dispatch({ type: KandidatlisteTypes.OPPRETT_NOTAT, kandidatlisteId, kandidatnr, tekst }),
    redigerNotat: (notat: Notat, tekst: string) => dispatch({ type: KandidatlisteTypes.REDIGER_NOTAT, kandidatlisteId, kandidatnr, notat, tekst }),
    slettNotat: (notat: Notat) => dispatch({ type: KandidatlisteTypes.SLETT_NOTAT, kandidatlisteId, kandidatnr, notat }),
    resetEndreNotatState: (endreType: EndreType) => dispatch({ type: KandidatlisteTypes.RESET_ENDRE_NOTAT_STATE, kandidatlisteId, kandidatnr, endreType })
});

export default connect(null, mapDispatchToProps)(Notater);
