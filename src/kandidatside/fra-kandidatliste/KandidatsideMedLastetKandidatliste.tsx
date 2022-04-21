import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';

import { CvAction } from '../cv/reducer/cvReducer';
import {
    erKobletTilStilling,
    Kandidatliste,
    Kandidatlistestatus,
} from '../../kandidatliste/domene/Kandidatliste';
import { filterTilQueryParams } from '../../kandidatliste/filter/filter-utils';
import { Kandidat, Kandidatstatus } from '../../kandidatliste/domene/Kandidat';
import { lenkeTilKandidatliste } from '../../app/paths';
import { Nettstatus } from '../../api/Nettressurs';
import AppState from '../../AppState';
import ForrigeNeste from '../header/forrige-neste/ForrigeNeste';
import Kandidatheader from '../header/Kandidatheader';
import KandidatlisteAction from '../../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import Kandidatmeny from '../meny/Kandidatmeny';
import MidlertidigUtilgjengelig, {
    tillatRegistreringAvMidlertidigUtilgjengelig,
} from '../midlertidig-utilgjengelig/MidlertidigUtilgjengelig';
import StatusOgHendelser from '../../kandidatliste/kandidatrad/status-og-hendelser/StatusOgHendelser';
import useMidlertidigUtilgjengelig from './useMidlertidigUtilgjengelig';
import useNavigerbareKandidater from './useNavigerbareKandidater';
import useHentForespørslerOmDelingAvCv from '../../kandidatliste/hooks/useHentForespørslerOmDelingAvCv';
import useForespørselOmDelingAvCv from '../../kandidatliste/hooks/useForespørselOmDelingAvCv';
import useHentSendteMeldinger from '../../kandidatliste/hooks/useHentSendteMeldinger';
import '../../common/ikoner.less';
import useSendtKandidatmelding from '../../kandidatliste/hooks/useSendtKandidatmelding';

type Props = {
    kandidat: Kandidat;
    kandidatliste: Kandidatliste;
};

const KandidatsideMedLastetKandidatliste: FunctionComponent<Props> = ({
    kandidat,
    kandidatliste,
    children,
}) => {
    const dispatch: Dispatch<KandidatlisteAction | CvAction> = useDispatch();

    useHentForespørslerOmDelingAvCv(kandidatliste.stillingId);
    useHentSendteMeldinger(kandidatliste.kandidatlisteId);

    const { cv } = useSelector((state: AppState) => state.cv);
    const { filter } = useSelector((state: AppState) => state.kandidatliste);
    const tilgjengelighet = useMidlertidigUtilgjengelig(kandidat.kandidatnr);
    const forespørselOmDelingAvCv = useForespørselOmDelingAvCv(kandidat.aktørid);
    const melding = useSendtKandidatmelding(kandidat.fodselsnr);

    const { aktivKandidat, lenkeTilForrige, lenkeTilNeste, antallKandidater } =
        useNavigerbareKandidater(kandidat.kandidatnr, kandidatliste);

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
            <Kandidatmeny cv={cv}>
                {tillatRegistreringAvMidlertidigUtilgjengelig && cv.kind === Nettstatus.Suksess && (
                    <MidlertidigUtilgjengelig
                        cv={cv.data}
                        midlertidigUtilgjengelig={tilgjengelighet}
                    />
                )}
                <div className="kandidatside__status-select">
                    <label htmlFor="cv-status-og-hendelse">
                        {erKobletTilStilling(kandidatliste) ? 'Status/hendelse:' : 'Status:'}
                    </label>
                    <StatusOgHendelser
                        id="cv-status-og-hendelse"
                        kanEditere={
                            kandidatliste.kanEditere &&
                            kandidatliste.status === Kandidatlistestatus.Åpen
                        }
                        kandidat={kandidat}
                        kandidatliste={kandidatliste}
                        forespørselOmDelingAvCv={forespørselOmDelingAvCv}
                        onStatusChange={onKandidatStatusChange}
                        sms={melding}
                    />
                </div>
            </Kandidatmeny>
            {children}
            <div className="kandidatside__forrige-neste-wrapper">
                <ForrigeNeste
                    lenkeClass="kandidatside__forrige-neste-lenke"
                    forrigeKandidat={lenkeTilForrige}
                    nesteKandidat={lenkeTilNeste}
                    gjeldendeKandidatIndex={aktivKandidat}
                    antallKandidater={antallKandidater}
                />
            </div>
        </div>
    );
};

export default KandidatsideMedLastetKandidatliste;
