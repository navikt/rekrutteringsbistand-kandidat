import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { sendEvent } from '../../amplitude/amplitude';
import { Nettstatus } from '../../api/Nettressurs';
import KandidatlisteAction from '../../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import { KandidatsøkAction } from '../../kandidatsøk/reducer/searchReducer';
import { CvAction, CvActionType } from '../cv/reducer/cvReducer';
import { Søkekontekst } from '../søkekontekst';
import KandidatsideFraSøkInner from './KandidatsideFraSøkInner';

type Props = {
    kandidatnr: string;
    kontekst: Søkekontekst;
};

const KandidatsideFraSøk: FunctionComponent<Props> = ({ kandidatnr, kontekst, children }) => {
    const dispatch: Dispatch<KandidatlisteAction | KandidatsøkAction | CvAction> = useDispatch();

    const scrollTilToppen = () => {
        window.scrollTo(0, 0);
    };

    const onNavigeringTilKandidat = () => {
        const hentKandidatensCv = () => {
            dispatch({ type: CvActionType.FetchCv, arenaKandidatnr: kandidatnr });
        };

        scrollTilToppen();
        hentKandidatensCv();
        sendEvent('cv', 'visning');
    };

    const synkroniserKandidatlistestate = (kontekst: Søkekontekst) => {
        const hentKandidatlisteMedKandidatlisteId = (kandidatlisteId: string) => {
            dispatch({
                type: KandidatlisteActionType.HentKandidatlisteMedKandidatlisteId,
                kandidatlisteId,
            });
        };

        const nullstillKandidatliste = () => {
            dispatch({
                type: KandidatlisteActionType.NullstillKandidatliste,
            });
        };

        if (kontekst.kontekst === 'fraNyttKandidatsøk') {
            nullstillKandidatliste();
        } else if (kontekst.kontekst === 'finnKandidaterTilKandidatlisteFraNyttKandidatsøk') {
            const kandidatlisteErIkkeLastet = kontekst.kandidatliste.kind === Nettstatus.IkkeLastet;
            const harEndretKandidatliste =
                kontekst.kandidatliste.kind === Nettstatus.Suksess &&
                kontekst.kandidatliste.data.kandidatlisteId !== kontekst.kandidatlisteId;

            if (kandidatlisteErIkkeLastet || harEndretKandidatliste) {
                hentKandidatlisteMedKandidatlisteId(kontekst.kandidatlisteId);
            }
        }
    };

    useEffect(onNavigeringTilKandidat, [dispatch, kandidatnr]);

    const kandidatlisteIdFraKontekst =
        kontekst.kontekst === 'finnKandidaterTilKandidatlisteFraNyttKandidatsøk'
            ? kontekst.kandidatlisteId
            : null;

    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    useEffect(() => synkroniserKandidatlistestate(kontekst), [kandidatlisteIdFraKontekst]);

    return (
        <KandidatsideFraSøkInner kandidatnr={kandidatnr} kontekst={kontekst}>
            {children}
        </KandidatsideFraSøkInner>
    );
};

export default KandidatsideFraSøk;
