import React, { FunctionComponent, useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import NavFrontendSpinner from 'nav-frontend-spinner';

import { LAGRE_STATUS } from '../../../felles/konstanter';
import { RemoteDataTypes, RemoteData } from '../../../felles/common/remoteData';
import { Status } from './kandidatrad/statusSelect/StatusSelect';
import { Visningsstatus } from './Kandidatliste';
import HjelpetekstFading from '../../../felles/common/HjelpetekstFading';
import Kandidatliste from './Kandidatliste';
import KopierEpostModal from './KopierEpostModal';
import LeggTilKandidatModal from './LeggTilKandidatModal';
import PresenterKandidaterModal from './PresenterKandidaterModal';
import KandidatlisteActionType from '../reducer/KandidatlisteActionType';
import KandidatlisteAction from '../reducer/KandidatlisteAction';
import {
    KandidatIKandidatliste,
    Delestatus,
    Kandidatliste as Kandidatlistetype,
    Kandidat,
} from '../kandidatlistetyper';
import './Kandidatliste.less';

const initialKandidatTilstand = () => ({
    markert: false,
    visningsstatus: Visningsstatus.SkjulPanel,
});

const trekkUtKandidatTilstander = (kandidater = []) =>
    kandidater.reduce(
        (tilstand: any, kandidat: KandidatIKandidatliste) => ({
            ...tilstand,
            [kandidat.kandidatnr]: {
                markert: kandidat.markert,
                visningsstatus: kandidat.visningsstatus,
            },
        }),
        {}
    );

type Props = {
    kandidatliste: RemoteData<Kandidatlistetype>;
    endreStatusKandidat: any;
    presenterKandidater: any;
    resetDeleStatus: any;
    deleStatus: string;
    leggTilStatus: string;
    fodselsnummer?: string;
    kandidat: {
        fornavn?: string;
        etternavn?: string;
    };
    hentNotater: any;
    opprettNotat: any;
    endreNotat: any;
    slettNotat: any;
    toggleErSlettet: any;
};

type Suksessmelding = {
    vis: boolean;
    tekst: string;
};

const initialiserKandidater = (kandidatliste: RemoteData<Kandidatlistetype>) => {
    return kandidatliste.kind !== RemoteDataTypes.SUCCESS
        ? undefined
        : kandidatliste.data.kandidater.map((kandidat: Kandidat) => ({
              ...kandidat,
              ...initialKandidatTilstand(),
          }));
};

const Kandidatlisteside: FunctionComponent<Props> = props => {
    const {
        kandidat = {
            fornavn: '',
            etternavn: '',
        },
        deleStatus,
        resetDeleStatus,
        leggTilStatus,
        fodselsnummer,
        kandidatliste,
    } = props;

    const [alleMarkert, setAlleMarkert] = useState<boolean>(false);

    const [deleSuksessMeldingCallbackId, setDeleSuksessMeldingCallbackId] = useState<any>();
    const [kandidater, setKandidater] = useState<any>(initialiserKandidater(props.kandidatliste));
    const [deleModalOpen, setDeleModalOpen] = useState<boolean>(false);
    const [leggTilModalOpen, setLeggTilModalOpen] = useState<boolean>(false);
    const [kopierEpostModalOpen, setKopierEpostModalOpen] = useState<boolean>(false);
    const [suksessMelding, setSuksessMelding] = useState<Suksessmelding>({
        vis: false,
        tekst: '',
    });

    const visSuccessMelding = useCallback(
        (tekst: string) => {
            if (deleSuksessMeldingCallbackId) {
                clearTimeout(deleSuksessMeldingCallbackId);
            }

            setSuksessMelding({
                vis: true,
                tekst,
            });

            const timeout = setTimeout(() => {
                setSuksessMelding({
                    vis: false,
                    tekst: '',
                });
            }, 5000);

            setDeleSuksessMeldingCallbackId(timeout);
        },
        [deleSuksessMeldingCallbackId]
    );

    const vedDelteKandidater = useCallback(() => {
        resetDeleStatus();

        const antallMarkerteKandidater = kandidater.filter(kandidat => kandidat.markert).length;

        visSuccessMelding(
            `${
                antallMarkerteKandidater > 1 ? 'Kandidatene' : 'Kandidaten'
            } er delt med arbeidsgiver`
        );
    }, [resetDeleStatus, visSuccessMelding, kandidater]);

    const vedLagtTilKandidat = useCallback(() => {
        visSuccessMelding(
            `Kandidat ${kandidat.fornavn} ${kandidat.etternavn} (${fodselsnummer}) er lagt til`
        );
    }, [kandidat, fodselsnummer, visSuccessMelding]);

    const vedKandidatlisteSuccess = useCallback(
        (kandidatliste: any) => {
            const kandidatTilstander = trekkUtKandidatTilstander(kandidater);
            const nyeKandidater = kandidatliste.data.kandidater.map(kandidat => {
                const kandidatTilstand =
                    kandidatTilstander[kandidat.kandidatnr] || initialKandidatTilstand();
                return {
                    ...kandidat,
                    ...kandidatTilstand,
                };
            });

            setKandidater(nyeKandidater);
            setAlleMarkert(nyeKandidater.filter(k => !k.markert).length === 0);
        },
        [kandidater]
    );

    useEffect(() => {
        if (deleStatus === Delestatus.Success) {
            vedDelteKandidater();
        }
    }, [deleStatus, vedDelteKandidater]);

    useEffect(() => {
        if (leggTilStatus === LAGRE_STATUS.SUCCESS) {
            vedLagtTilKandidat();
        }
    }, [leggTilStatus, vedLagtTilKandidat]);

    const kandidaterFraListe =
        kandidatliste.kind !== RemoteDataTypes.SUCCESS ? undefined : kandidatliste.data.kandidater;

    useEffect(() => {
        if (kandidatliste.kind === RemoteDataTypes.SUCCESS) {
            vedKandidatlisteSuccess(kandidatliste);
        }
    }, [kandidatliste, kandidaterFraListe, vedKandidatlisteSuccess]);

    useEffect(() => {
        return () => {
            if (deleSuksessMeldingCallbackId) {
                clearTimeout(deleSuksessMeldingCallbackId);
            }
        };
    });

    const onCheckAlleKandidater = markert => {
        setAlleMarkert(markert);
        setKandidater(
            kandidater.map(kandidat => ({
                ...kandidat,
                markert,
            }))
        );
    };

    const onToggleKandidat = (kandidatnr: string) => {
        const nyeKandidater = kandidater.map(kandidat => {
            if (kandidat.kandidatnr === kandidatnr) {
                return {
                    ...kandidat,
                    markert: !kandidat.markert,
                };
            }
            return kandidat;
        });

        setKandidater(nyeKandidater);
        setAlleMarkert(kandidater.filter(k => !k.markert).length === 0);
    };

    const onToggleDeleModal = () => {
        setDeleModalOpen(!deleModalOpen);
    };

    const onToggleLeggTilKandidatModal = () => {
        setLeggTilModalOpen(!leggTilModalOpen);
    };

    const onToggleKopierEpostModal = () => {
        setKopierEpostModalOpen(!kopierEpostModalOpen);
    };

    const onDelMedArbeidsgiver = (beskjed, mailadresser) => {
        if (props.kandidatliste.kind === RemoteDataTypes.SUCCESS) {
            props.presenterKandidater(
                beskjed,
                mailadresser,
                props.kandidatliste.data.kandidatlisteId,
                kandidater.filter(kandidat => kandidat.markert).map(kandidat => kandidat.kandidatnr)
            );

            setDeleModalOpen(false);
        }
    };

    const onVisningChange = (visningsstatus, kandidatlisteId, kandidatnr) => {
        if (visningsstatus === Visningsstatus.VisNotater) {
            props.hentNotater(kandidatlisteId, kandidatnr);
        }

        const nyeKandidater = kandidater.map(kandidat => {
            if (kandidat.kandidatnr === kandidatnr) {
                return {
                    ...kandidat,
                    visningsstatus,
                };
            }
            return {
                ...kandidat,
                visningsstatus: Visningsstatus.SkjulPanel,
            };
        });

        setKandidater(nyeKandidater);
    };

    const onEmailKandidater = () => {
        setKopierEpostModalOpen(true);
    };

    if (kandidatliste.kind === RemoteDataTypes.LOADING || !kandidater) {
        return (
            <div className="fullscreen-spinner">
                <NavFrontendSpinner type="L" />
            </div>
        );
    } else if (kandidatliste.kind !== RemoteDataTypes.SUCCESS) {
        return null;
    }

    const {
        tittel,
        organisasjonNavn,
        opprettetAv,
        kandidatlisteId,
        stillingId,
        kanEditere,
        beskrivelse,
    } = kandidatliste.data;

    return (
        <div>
            {deleModalOpen && (
                <PresenterKandidaterModal
                    vis={deleModalOpen}
                    onClose={onToggleDeleModal}
                    onSubmit={onDelMedArbeidsgiver}
                    antallKandidater={kandidater.filter(kandidat => kandidat.markert).length}
                />
            )}
            {leggTilModalOpen && (
                <LeggTilKandidatModal
                    vis={leggTilModalOpen}
                    onClose={onToggleLeggTilKandidatModal}
                    stillingsId={stillingId}
                    kandidatliste={kandidatliste.data}
                />
            )}
            <KopierEpostModal
                vis={kopierEpostModalOpen}
                onClose={onToggleKopierEpostModal}
                kandidater={kandidater.filter(kandidat => kandidat.markert)}
            />
            <HjelpetekstFading
                synlig={suksessMelding.vis}
                type="suksess"
                innhold={suksessMelding.tekst}
            />
            <Kandidatliste
                tittel={tittel}
                arbeidsgiver={organisasjonNavn}
                opprettetAv={opprettetAv}
                kandidatlisteId={kandidatlisteId}
                stillingsId={stillingId}
                kanEditere={kanEditere}
                kandidater={kandidater}
                alleMarkert={alleMarkert}
                onToggleKandidat={onToggleKandidat}
                onCheckAlleKandidater={() => {
                    onCheckAlleKandidater(!alleMarkert);
                }}
                onKandidatStatusChange={props.endreStatusKandidat}
                onKandidatShare={onToggleDeleModal}
                onEmailKandidater={onEmailKandidater}
                onLeggTilKandidat={onToggleLeggTilKandidatModal}
                onVisningChange={onVisningChange}
                opprettNotat={props.opprettNotat}
                endreNotat={props.endreNotat}
                slettNotat={props.slettNotat}
                toggleErSlettet={props.toggleErSlettet}
                beskrivelse={beskrivelse}
            />
        </div>
    );
};

const mapStateToProps = (state: any) => ({
    deleStatus: state.kandidatlister.detaljer.deleStatus,
    leggTilStatus: state.kandidatlister.leggTilKandidater.lagreStatus,
    fodselsnummer: state.kandidatlister.fodselsnummer,
    kandidat: state.kandidatlister.kandidat,
});

const mapDispatchToProps = (dispatch: (action: KandidatlisteAction) => void) => ({
    endreStatusKandidat: (status: Status, kandidatlisteId: string, kandidatnr: string) => {
        dispatch({
            type: KandidatlisteActionType.ENDRE_STATUS_KANDIDAT,
            status,
            kandidatlisteId,
            kandidatnr,
        });
    },
    presenterKandidater: (
        beskjed: string,
        mailadresser: Array<string>,
        kandidatlisteId: string,
        kandidatnummerListe: Array<string>
    ) => {
        dispatch({
            type: KandidatlisteActionType.PRESENTER_KANDIDATER,
            beskjed,
            mailadresser,
            kandidatlisteId,
            kandidatnummerListe,
        });
    },
    resetDeleStatus: () => {
        dispatch({ type: KandidatlisteActionType.RESET_Delestatus });
    },
    hentNotater: (kandidatlisteId, kandidatnr) => {
        dispatch({ type: KandidatlisteActionType.HENT_NOTATER, kandidatlisteId, kandidatnr });
    },
    opprettNotat: (kandidatlisteId, kandidatnr, tekst) => {
        dispatch({
            type: KandidatlisteActionType.OPPRETT_NOTAT,
            kandidatlisteId,
            kandidatnr,
            tekst,
        });
    },
    endreNotat: (kandidatlisteId, kandidatnr, notatId, tekst) => {
        dispatch({
            type: KandidatlisteActionType.ENDRE_NOTAT,
            kandidatlisteId,
            kandidatnr,
            notatId,
            tekst,
        });
    },
    slettNotat: (kandidatlisteId, kandidatnr, notatId) => {
        dispatch({
            type: KandidatlisteActionType.SLETT_NOTAT,
            kandidatlisteId,
            kandidatnr,
            notatId,
        });
    },
    toggleErSlettet: (kandidatlisteId, kandidatnr, erSlettet) => {
        dispatch({
            type: KandidatlisteActionType.TOGGLE_ER_SLETTET,
            kandidatlisteId,
            kandidatnr,
            erSlettet,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Kandidatlisteside);
