import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';

import { CvAction } from './cv/reducer/cvReducer';
import {
    erKobletTilStilling,
    Kandidatliste,
    Kandidatlistestatus,
} from '../kandidatliste/domene/Kandidatliste';
import { filterTilQueryParams } from '../kandidatliste/filter/filter-utils';
import { Kandidat, Kandidatstatus } from '../kandidatliste/domene/Kandidat';
import { lenkeTilKandidatliste } from '../app/paths';
import { Nettstatus } from '../api/Nettressurs';
import AppState from '../AppState';
import ForrigeNeste from './header/forrige-neste/ForrigeNeste';
import IkkeFunnet from './ikke-funnet/IkkeFunnet';
import Kandidatheader from './header/Kandidatheader';
import KandidatlisteAction from '../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../kandidatliste/reducer/KandidatlisteActionType';
import Kandidatmeny from './meny/Kandidatmeny';
import MidlertidigUtilgjengelig from './midlertidig-utilgjengelig/MidlertidigUtilgjengelig';
import StatusOgHendelser from '../kandidatliste/kandidatrad/status-og-hendelser/StatusOgHendelser';
import useMidlertidigUtilgjengelig from './useMidlertidigUtilgjengelig';
import useNavigerbareKandidater from './header/useNavigerbareKandidater';
import '../common/ikoner.less';

type Props = {
    kandidat: Kandidat;
    kandidatliste: Kandidatliste;
};

const VisKandidatFraLister: FunctionComponent<Props> = ({ kandidat, kandidatliste, children }) => {
    const dispatch: Dispatch<KandidatlisteAction | CvAction> = useDispatch();

    const { cv } = useSelector((state: AppState) => state.cv);
    const { filter } = useSelector((state: AppState) => state.kandidatliste);
    const tilgjengelighet = useMidlertidigUtilgjengelig(kandidat.kandidatnr);

    const {
        aktivKandidat,
        lenkeTilForrige,
        lenkeTilNeste,
        antallKandidater,
    } = useNavigerbareKandidater(kandidat.kandidatnr, kandidatliste);

    const onKandidatStatusChange = (status: Kandidatstatus) => {
        dispatch({
            type: KandidatlisteActionType.EndreStatusKandidat,
            status,
            kandidatlisteId: kandidatliste.kandidatlisteId,
            kandidatnr: kandidat.kandidatnr,
        });
    };

    return (
        <div>
            <Kandidatheader
                cv={cv}
                tilbakeLink={lenkeTilKandidatliste(
                    kandidatliste.kandidatlisteId,
                    filterTilQueryParams(filter)
                )}
                gjeldendeKandidatIndex={aktivKandidat}
                antallKandidater={antallKandidater}
                nesteKandidat={lenkeTilNeste}
                forrigeKandidat={lenkeTilForrige}
            />
            {cv.kind === Nettstatus.FinnesIkke ? (
                <IkkeFunnet />
            ) : (
                <>
                    <Kandidatmeny cv={cv}>
                        {cv.kind === Nettstatus.Suksess && (
                            <MidlertidigUtilgjengelig
                                cv={cv.data}
                                midlertidigUtilgjengelig={tilgjengelighet}
                            />
                        )}
                        <div className="vis-kandidat__status-select">
                            <label htmlFor="cv-status-og-hendelse">
                                {erKobletTilStilling(kandidatliste)
                                    ? 'Status/hendelse:'
                                    : 'Status:'}
                            </label>
                            <StatusOgHendelser
                                id="cv-status-og-hendelse"
                                kanEditere={
                                    kandidatliste.kanEditere &&
                                    kandidatliste.status === Kandidatlistestatus.Åpen
                                }
                                kandidat={kandidat}
                                kandidatlisteId={kandidatliste.kandidatlisteId}
                                onStatusChange={onKandidatStatusChange}
                                kandidatlistenErKobletTilStilling={erKobletTilStilling(
                                    kandidatliste
                                )}
                            />
                        </div>
                    </Kandidatmeny>
                    {children}
                    <div className="vis-kandidat__forrige-neste-wrapper">
                        <ForrigeNeste
                            lenkeClass="vis-kandidat__forrige-neste-lenke"
                            forrigeKandidat={lenkeTilForrige}
                            nesteKandidat={lenkeTilNeste}
                            gjeldendeKandidatIndex={aktivKandidat}
                            antallKandidater={antallKandidater}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default VisKandidatFraLister;
