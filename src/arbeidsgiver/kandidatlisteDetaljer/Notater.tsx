import * as React from 'react';
import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Hovedknapp, Knapp, Flatknapp } from 'pam-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { RemoteData, RemoteDataTypes } from '../../felles/common/remoteData';
import { EndreType, KandidatlisteTypes, Notat, Notater } from './kandidatlisteReducer';
import './Notater.less';
import { Textarea } from 'nav-frontend-skjema';

const NotatRad: FunctionComponent<{ notat: Notat }> = ({ notat }) => (
    <p>notat</p>
);

const Notatliste: FunctionComponent<{ notater: RemoteData<Array<Notat>> }> = ({ notater }) => {
    switch (notater.kind) {
        case RemoteDataTypes.SUCCESS:
            return (
                <div>
                    {notater.data.map(notat => <NotatRad notat={notat} />)}
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
            <div className="NyttNotat">
                <Textarea
                    label="Skriv inn notat"
                    value={nyttNotatState.value}
                    textareaClass="NyttNotat-tekstfelt"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setNyttNotatState(apentNotatFelt(e.target.value))
                    }}
                />
                <Hovedknapp mini onClick={() => { opprettNotat(nyttNotatState.value) }} className="NyttNotat-hovedknapp">Lagre</Hovedknapp>
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
    <div>
        <h2>Modal</h2>
        <textarea
            value={tekst}
            onChange={(e) => { setModalState(redigereModalState(notat, e.target.value))}} />
        <Hovedknapp onClick={() => {redigerNotat(notat.notatId, tekst) }}>Lagre</Hovedknapp>
        <Knapp onClick={() => { setModalState(lukketModalState()) }}>Avbryt</Knapp>
    </div>
);

interface ModalerProps {
    kandidatnr: string,
    kandidatlisteId: string,
    modalState: ModalState,
    setModalState: (ModalState) => void
    redigerNotat: (notatId: string, tekst: string) => void,
    slettNotat: (notatId: string) => void,
}

const Modaler: FunctionComponent<ModalerProps> = ({ kandidatnr, kandidatlisteId, modalState, redigerNotat, slettNotat, setModalState  }) => {
    if (modalState.kind === ModalStateType.REDIGERE_MODAL_AAPEN) {
        // return <RedigerNotatModal />;
        return null;
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
        <div>
            <Modaler
                kandidatlisteId={kandidatlisteId}
                kandidatnr={kandidatnr}
                modalState={modalState}
                setModalState={setModalState}
                redigerNotat={redigerNotat}
                slettNotat={slettNotat}
            />
            <div className="Notater">
                <Element className="Notater-overskrift">Notater ({antallNotater})</Element>

                <Normaltekst className="Notater-beskrivelse">
                    Her skal du kun skrive korte meldinger og statusoppdateringer.
                    Sensitive opplysninger skrives <strong>ikke</strong> her.
                </Normaltekst>
                <Normaltekst className="Notater-beskrivelse">Notatene blir automatisk slettet etter 3 måneder.</Normaltekst>

                <NyttNotat opprettNotat={opprettNotat} opprettState={notater.opprettState} />
                <Notatliste notater={notater.notater} />
            </div>
        </div>
    );
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    hentNotater: () => {
        dispatch({ type: KandidatlisteTypes.HENT_NOTATER, kandidatlisteId: ownProps.kandidatlisteId, kandidatnr: ownProps.kandidatnr });
    },
    opprettNotat: (tekst: string) => dispatch({ type: 'OPPRETT_NOTAT', kandidatlisteId: ownProps.kandidatlisteId, kandidatnr: ownProps.kandidatnr, tekst}),
    redigerNotat: (notatId: string, tekst: string) => dispatch({ type: 'REDIGER_NOTAT', kandidatlisteId: ownProps.kandidatlisteId, kandidatnr: ownProps.kandidatnr, notatId, tekst}),
    slettNotat: (notatId: string) => dispatch({ type: 'SLETT_NOTAT', kandidatlisteId: ownProps.kandidatlisteId, kandidatnr: ownProps.kandidatnr, notatId}),
    resetEndreNotatState: (endreType: EndreType) => dispatch({ type: 'RESET_ENDRE_NOTAT_STATE', kandidatlisteId: ownProps.kandidatlisteId, kandidatnr: ownProps.kandidatnr, endreType })
});

export default connect(null, mapDispatchToProps)(Notater);
