import * as React from 'react';
import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Flatknapp, Hovedknapp, Knapp } from 'pam-frontend-knapper';
import { Element, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Textarea } from 'nav-frontend-skjema';
import NavFrontendModal from 'nav-frontend-modal';
import { RemoteData, RemoteDataTypes } from '../../felles/common/remoteData';
import { EndreType, KandidatlisteTypes, Notat, Notater } from './kandidatlisteReducer';
import './Notater.less';

const NotatRad: FunctionComponent<{ notat: Notat, setModalState: (ModalState) => void }> = ({ notat, setModalState }) => (
    <div>
        <p>{notat.tekst}</p>
        <button onClick={() => { setModalState(redigereModalState(notat, notat.tekst))}}>Rediger</button>
        <button onClick={() => { setModalState(sletteModalState(notat))}}>Slett</button>
    </div>
);

const Notatliste: FunctionComponent<{ notater: RemoteData<Array<Notat>>, setModalState: (ModalState) => void }> = ({ notater, setModalState}) => {
    switch (notater.kind) {
        case RemoteDataTypes.SUCCESS:
            return (
                <div>
                    {notater.data.map(notat => <NotatRad key={`notat-${notat.notatId}`} notat={notat} setModalState={setModalState} />)}
                </div>
            );

        case RemoteDataTypes.LOADING:
            return <p>spinner</p>;

        default:
            return null;
    }
};

type NyttNotatState = { open: false } | { open: true, value: string }

const lukketNotatFelt: () => NyttNotatState = () => ({
    open: false
});

const apentNotatFelt: (string) => NyttNotatState = (value: string) => ({
    open: true,
    value
});

const NyttNotat: FunctionComponent<{ opprettNotat: (string) => void, opprettState: RemoteData<undefined> }> = ({ opprettNotat, opprettState }) => {
    const [nyttNotatState, setNyttNotatState] = useState(lukketNotatFelt());
    useEffect(() => {
        if (opprettState.kind === RemoteDataTypes.SUCCESS && nyttNotatState.open) {
            setNyttNotatState(lukketNotatFelt());
        }
    }, [opprettState, nyttNotatState]);

    if (nyttNotatState.open) {
        return (
            <div className="RedigerNotat">
                <Textarea
                    label="Skriv inn notat"
                    value={nyttNotatState.value}
                    textareaClass="NyttNotat-tekstfelt"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setNyttNotatState(apentNotatFelt(e.target.value))
                    }}
                />
                <Hovedknapp mini onClick={() => { opprettNotat(nyttNotatState.value) }} className="RedigerNotat-hovedknapp">Lagre</Hovedknapp>
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
interface RedigereModalState { kind : ModalStateType.REDIGERE_MODAL_AAPEN, notat: Notat, tekst: string }
interface SletteModalState { kind : ModalStateType.SLETTE_MODAL_AAPEN, notat: Notat }

const lukketModalState : () => ModalState = () => ({
    kind : ModalStateType.LUKKET
});

const redigereModalState : (Notat, string) => ModalState = (notat, tekst) => ({
    kind : ModalStateType.REDIGERE_MODAL_AAPEN,
    notat,
    tekst
});

const sletteModalState : (Notat) => ModalState = (notat) => ({
    kind : ModalStateType.SLETTE_MODAL_AAPEN,
    notat
});

type ModalState = LukketModalState | RedigereModalState | SletteModalState

interface RedigerNotatModalProps {
    notat: Notat,
    tekst: string,
    setModalState : (ModalState) => void,
    redigerNotat: (notatId: string, tekst: string) => void
}

const RedigerNotatModal : FunctionComponent<RedigerNotatModalProps> = ({ notat, tekst, setModalState, redigerNotat }) => (
    <NavFrontendModal contentLabel="Test" isOpen  onRequestClose={() => {setModalState(lukketModalState())}}>
        <div className="NotatModal RedigerNotat">
            <Systemtittel className="NotatModal-tittel">Rediger notat</Systemtittel>
            <Textarea
                label="Skriv inn notat"
                value={tekst}
                // className="NotatModal-tekstfelt-wrapper"
                textareaClass="NyttNotat-tekstfelt"
                onChange={(e: ChangeEvent<HTMLInputElement>) => { setModalState(redigereModalState(notat, e.target.value))}}
            />
            <Hovedknapp onClick={() => {redigerNotat(notat.notatId, tekst) }} className="RedigerNotat-hovedknapp">Lagre</Hovedknapp>
            <Knapp onClick={() => { setModalState(lukketModalState()) }}>Avbryt</Knapp>
        </div>
    </NavFrontendModal>
);

interface SlettNotatModalProps {
    notat: Notat,
    setModalState : (ModalState) => void,
    slettNotat: (notatId: string) => void
}

const SlettNotatModal : FunctionComponent<SlettNotatModalProps> = ({ notat, setModalState, slettNotat }) => (
    <NavFrontendModal contentLabel="Test" isOpen  onRequestClose={() => {setModalState(lukketModalState())}}>
        <div className="NotatModal">
            <Systemtittel className="NotatModal-tittel">Slett notat</Systemtittel>
            <Normaltekst>Er du sikker på at du ønsker å slette notatet?</Normaltekst>
            <Hovedknapp onClick={() => {slettNotat(notat.notatId) }} className="RedigerNotat-hovedknapp">Lagre</Hovedknapp>
            <Knapp onClick={() => { setModalState(lukketModalState()) }}>Avbryt</Knapp>
        </div>
    </NavFrontendModal>
);

interface ModalerProps {
    modalState: ModalState,
    setModalState: (ModalState) => void
    redigerNotat: (notatId: string, tekst: string) => void,
    slettNotat: (notatId: string) => void,
}

const Modaler: FunctionComponent<ModalerProps> = ({ modalState, setModalState, redigerNotat, slettNotat  }) => {
    if (modalState.kind === ModalStateType.REDIGERE_MODAL_AAPEN) {
        return (
            <RedigerNotatModal
                notat={modalState.notat}
                tekst={modalState.tekst}
                setModalState={setModalState}
                redigerNotat={redigerNotat}
            />
        );
    } else if (modalState.kind === ModalStateType.SLETTE_MODAL_AAPEN) {
        return (
            <SlettNotatModal
                notat={modalState.notat}
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
    redigerNotat: (notatId: string, tekst: string) => void,
    slettNotat: (notatId: string) => void,
    resetEndreNotatState: (endreType: EndreType) => void
}

const Notater : FunctionComponent<Props> = ({ notater, antallNotater, kandidatlisteId, kandidatnr, hentNotater, opprettNotat, redigerNotat, slettNotat }) => {
    useEffect(() => {
        if (notater.notater.kind === RemoteDataTypes.NOT_ASKED) {
            hentNotater()
        }
    }, [kandidatlisteId, kandidatnr, notater]);
    const [ modalState, setModalState ] = useState(lukketModalState());

    return (
        <div className="Notater">
            <Modaler
                modalState={modalState}
                setModalState={setModalState}
                redigerNotat={redigerNotat}
                slettNotat={slettNotat}
            />
            <div>
                <Element className="Notater-overskrift">Notater ({antallNotater})</Element>

                <Normaltekst className="Notater-beskrivelse">
                    Her skal du kun skrive korte meldinger og statusoppdateringer.
                    Sensitive opplysninger skrives <strong>ikke</strong> her.
                </Normaltekst>
                <Normaltekst className="Notater-beskrivelse">Notatene blir automatisk slettet etter 3 måneder.</Normaltekst>

                <NyttNotat opprettNotat={opprettNotat} opprettState={notater.opprettState} />
                <Notatliste notater={notater.notater} setModalState={setModalState} />
            </div>
        </div>
    );
};

const mapDispatchToProps = (dispatch, { kandidatlisteId, kandidatnr }) => ({
    hentNotater: () => dispatch({ type: KandidatlisteTypes.HENT_NOTATER, kandidatlisteId, kandidatnr }),
    opprettNotat: (tekst: string) => dispatch({ type: KandidatlisteTypes.OPPRETT_NOTAT, kandidatlisteId, kandidatnr, tekst}),
    redigerNotat: (notatId: string, tekst: string) => dispatch({ type: KandidatlisteTypes.REDIGER_NOTAT, kandidatlisteId, kandidatnr, notatId, tekst}),
    slettNotat: (notatId: string) => dispatch({ type: KandidatlisteTypes.SLETT_NOTAT, kandidatlisteId, kandidatnr, notatId}),
    resetEndreNotatState: (endreType: EndreType) => dispatch({ type: 'RESET_ENDRE_NOTAT_STATE', kandidatlisteId, kandidatnr, endreType })
});

export default connect(null, mapDispatchToProps)(Notater);
