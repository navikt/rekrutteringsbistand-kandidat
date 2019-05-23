import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { FETCH_CV, HENT_CV_STATUS } from '../sok/cv/cvReducer';
import VisKandidatPersonalia from '../../felles/result/visKandidat/VisKandidatPersonalia';
import VisKandidatCv from '../../felles/result/visKandidat/VisKandidatCv';
import VisKandidatJobbprofil from '../../felles/result/visKandidat/VisKandidatJobbprofil';
import Lenkeknapp from '../../felles/common/Lenkeknapp';
import { KandidatlisteDetaljer, KandidatlisteTypes } from './kandidatlisteReducer';
import '../../felles/common/ikoner/ikoner.less';
import SlettKandidaterModal from './SlettKandidaterModal';
import { CONTEXT_ROOT } from '../common/fasitProperties';
import VisKandidatForrigeNeste from '../../felles/result/visKandidat/VisKandidatForrigeNeste';
import { RemoteData, RemoteDataTypes } from '../../felles/common/remoteData';
import { useTimeoutState } from '../../felles/common/hooks/useTimeoutState';
import './VisKandidatFraLister.less';

interface Props {
    kandidatnummer: string,
    cv: any,
    hentStatus: string,
    kandidatlisteId: string,
    kandidatliste: KandidatlisteDetaljer,
    slettKandidat: () => void,
    sletteStatus: RemoteData<{ antallKandidaterSlettet: number }>;
    nullstillSletteStatus: () => void
}

const VisKandidatFraLister: FunctionComponent<Props> = ({ cv, kandidatnummer, kandidatlisteId, kandidatliste, sletteStatus, hentStatus, slettKandidat, nullstillSletteStatus }) => {
    const [slettKandidatModalOpen, setSlettKandidatModalOpen] = useState<boolean>(false);
    const [sletteModalFailureAlertStripeState, clearModalState, , setSletteModalFailureMelding] = useTimeoutState();

    useEffect(() => {
        if (sletteStatus.kind === RemoteDataTypes.FAILURE) {
            setSletteModalFailureMelding('Noe gikk galt under sletting av kandidaten');
            nullstillSletteStatus()
        }
    }, [sletteStatus]);

    useEffect(() => {
        return () => {
            clearModalState();
        }
    }, []);

    const gjeldendeKandidatIListen = (kandidatnummer) => {
        const gjeldendeIndex = kandidatliste.kandidater.findIndex((element) => (element.kandidatnr === kandidatnummer));
        if (gjeldendeIndex === -1) {
            return undefined;
        }
        return gjeldendeIndex + 1;
    };

    const forrigeKandidatnummerIListen = (kandidatnummer) => {
        const gjeldendeIndex = kandidatliste.kandidater.findIndex((element) => (element.kandidatnr === kandidatnummer));
        if (gjeldendeIndex === 0 || gjeldendeIndex === -1) {
            return undefined;
        }
        return kandidatliste.kandidater[gjeldendeIndex - 1].kandidatnr;
    };

    const nesteKandidatnummerIListen = (kandidatnummer) => {
        const gjeldendeIndex = kandidatliste.kandidater.findIndex((element) => (element.kandidatnr === kandidatnummer));
        if (gjeldendeIndex === (kandidatliste.kandidater.length - 1)) {
            return undefined;
        }
        return kandidatliste.kandidater[gjeldendeIndex + 1].kandidatnr;
    };

    const gjeldendeKandidat = gjeldendeKandidatIListen(kandidatnummer);
    const forrigeKandidat = forrigeKandidatnummerIListen(kandidatnummer);
    const nesteKandidat = nesteKandidatnummerIListen(kandidatnummer);
    const forrigeKandidatLink = forrigeKandidat ? `/${CONTEXT_ROOT}/lister/detaljer/${kandidatlisteId}/cv/${forrigeKandidat}` : undefined;
    const nesteKandidatLink = nesteKandidat ? `/${CONTEXT_ROOT}/lister/detaljer/${kandidatlisteId}/cv/${nesteKandidat}` : undefined;

    const Knapper = () => (
        <div className="viskandidat__knapperad">
            <Lenkeknapp onClick={() => setSlettKandidatModalOpen(true)} className="Delete" tittel="Slett kandidaten fra listen">
                Slett
                <i className="Delete__icon" />
            </Lenkeknapp>
        </div>
    );

    if (sletteStatus.kind === RemoteDataTypes.SUCCESS) {
        return <Redirect to={`/${CONTEXT_ROOT}/lister/detaljer/${kandidatlisteId}`} push />;
    }
    return (
        <div>
            <VisKandidatPersonalia
                cv={cv}
                appContext={'arbeidsgiver'}
                tilbakeLink={`/${CONTEXT_ROOT}/lister/detaljer/${kandidatlisteId}`}
                forrigeKandidat={forrigeKandidatLink}
                nesteKandidat={nesteKandidatLink}
                gjeldendeKandidat={gjeldendeKandidat}
                antallKandidater={kandidatliste.kandidater.length}
                fantCv={hentStatus === HENT_CV_STATUS.SUCCESS}
            />
            {hentStatus === HENT_CV_STATUS.FINNES_IKKE ? (
                <div className="cvIkkeFunnet">
                    <div className="content">
                        <Element tag="h2" className="blokk-s">Kandidaten kan ikke vises</Element>
                        <div>
                            <Normaltekst>Mulige årsaker:</Normaltekst>
                            <ul>
                                <li className="blokk-xxs"><Normaltekst>Kandidaten har skiftet status</Normaltekst></li>
                                <li><Normaltekst>Tekniske problemer</Normaltekst></li>
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="viskandidat-container">
                    <Knapper />
                    <VisKandidatJobbprofil cv={cv} />
                    <VisKandidatCv cv={cv} />
                    <div className="navigering-forrige-neste_wrapper">
                        <VisKandidatForrigeNeste
                            lenkeClass="VisKandidat__ForrigeNeste"
                            forrigeKandidat={forrigeKandidatLink}
                            nesteKandidat={nesteKandidatLink}
                            gjeldendeKandidat={gjeldendeKandidat}
                            antallKandidater={kandidatliste.kandidater.length}
                        />
                    </div>
                </div>
            )}
            <SlettKandidaterModal
                isOpen={slettKandidatModalOpen}
                alertState={sletteModalFailureAlertStripeState}
                sletterKandidater={sletteStatus.kind === RemoteDataTypes.LOADING}
                valgteKandidater={[cv]}
                onDeleteClick={slettKandidat}
                lukkModal={() => {
                    setSlettKandidatModalOpen(false);
                    clearModalState();
                }}
            />
        </div>
    );
};

interface WrapperProps {
    kandidatnr: string,
    sistHentetKandidatnr?: string,
    cv: any,
    hentStatus: string,
    kandidatlisteId: string,
    kandidatliste: RemoteData<KandidatlisteDetaljer>,
    hentKandidatliste: () => void,
    hentCv: () => void,
    slettKandidat: () => void,
    sletteStatus: RemoteData<{ antallKandidaterSlettet: number }>;
    nullstillSletteStatus: () => void
}

const VisKandidatFraListerWrapper : FunctionComponent<WrapperProps> = ({ kandidatlisteId, kandidatliste, hentKandidatliste, kandidatnr, hentStatus, cv, hentCv, slettKandidat, sletteStatus, sistHentetKandidatnr, nullstillSletteStatus }) => {
    useEffect(() => {
        if ( kandidatliste.kind === RemoteDataTypes.NOT_ASKED || (kandidatliste.kind === RemoteDataTypes.SUCCESS && kandidatliste.data.kandidatlisteId !== kandidatlisteId)) {
            hentKandidatliste();
        }
    }, [kandidatlisteId, kandidatliste]);
    useEffect(() => {
        if (hentStatus === HENT_CV_STATUS.IKKE_HENTET) {
            hentCv();
        } else if (sistHentetKandidatnr && sistHentetKandidatnr !== kandidatnr && (hentStatus === HENT_CV_STATUS.SUCCESS || hentStatus === HENT_CV_STATUS.FAILURE || hentStatus === HENT_CV_STATUS.FINNES_IKKE)) {
            hentCv();
        }
    }, [kandidatnr, hentStatus, cv]);
    if (kandidatliste.kind === RemoteDataTypes.SUCCESS && (hentStatus === HENT_CV_STATUS.SUCCESS || hentStatus === HENT_CV_STATUS.FINNES_IKKE)) {
        return <VisKandidatFraLister
                    cv={cv}
                    kandidatliste={kandidatliste.data}
                    kandidatnummer={kandidatnr}
                    kandidatlisteId={kandidatlisteId}
                    slettKandidat={slettKandidat}
                    sletteStatus={sletteStatus}
                    hentStatus={hentStatus}
                    nullstillSletteStatus={nullstillSletteStatus}
            />
    } else if (kandidatliste.kind === RemoteDataTypes.LOADING || hentStatus === HENT_CV_STATUS.LOADING) {
        return (
            <div className="text-center">
                <NavFrontendSpinner type="L" />
            </div>
        );
    }
    return null;
};

const mapStateToProps = (state, props) => ({
    kandidatnr: props.match.params.kandidatnr,
    sistHentetKandidatnr: state.cvReducer.sistHentetKandidatnr,
    kandidatlisteId: props.match.params.listeid,
    kandidatliste: state.kandidatlisteDetaljer.kandidatliste,
    cv: state.cvReducer.cv,
    hentStatus: state.cvReducer.hentStatus,
    sletteStatus: state.kandidatlisteDetaljer.sletteStatus
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    hentCv: () => dispatch({ type: FETCH_CV, arenaKandidatnr: ownProps.match.params.kandidatnr }),
    hentKandidatliste: () => dispatch({ type: KandidatlisteTypes.HENT_KANDIDATLISTE, kandidatlisteId: ownProps.match.params.listeid }),
    slettKandidat: () => dispatch({ type: KandidatlisteTypes.SLETT_KANDIDATER, kandidatlisteId: ownProps.match.params.listeid, kandidater: [{ kandidatnr: ownProps.match.params.kandidatnr }] }),
    nullstillSletteStatus: () => dispatch({ type: KandidatlisteTypes.SLETT_KANDIDATER_RESET_STATUS }),
});

export default connect(mapStateToProps, mapDispatchToProps)(VisKandidatFraListerWrapper);
