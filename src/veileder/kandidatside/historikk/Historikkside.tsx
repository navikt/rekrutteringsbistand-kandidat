import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { KandidatlisterForKandidatActionType } from './historikkReducer';
import { Nettstatus } from '../../../felles/common/remoteData';
import { Link, useRouteMatch } from 'react-router-dom';
import AppState from '../../AppState';
import 'nav-frontend-tabell-style';
import './Historikkside.less';
import { capitalizeFirstLetter } from '../../../felles/sok/utils';
import { Ingress } from 'nav-frontend-typografi';
import { lenkeTilKandidatliste, lenkeTilStilling } from '../../application/paths';
import Lenke from 'nav-frontend-lenker';
import {
    Status,
    Statusvisning,
} from '../../kandidatlister/kandidatliste/kandidatrad/statusSelect/StatusSelect';

const Historikkside: FunctionComponent = () => {
    const { params } = useRouteMatch<{ kandidatnr: string }>();
    const kandidatnr = params.kandidatnr;
    const historikk = useSelector((state: AppState) => state.historikk);
    const cv = useSelector((state: AppState) => state.cv);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: KandidatlisterForKandidatActionType.Fetch,
            kandidatnr,
        });
    }, [kandidatnr, dispatch]);

    if (
        historikk.kandidatlisterForKandidat.kind !== Nettstatus.Suksess ||
        cv.hentStatus !== 'SUCCESS'
    ) {
        return null;
    }

    const kandidatlister = historikk.kandidatlisterForKandidat.data;
    return (
        <div className="historikkside">
            <Ingress className="blokk-m">
                <b>
                    {capitalizeFirstLetter(cv.cv.fornavn)} {capitalizeFirstLetter(cv.cv.etternavn)}
                </b>{' '}
                er lagt til i <b>{kandidatlister.length}</b> kandidatlister
            </Ingress>
            <table className="tabell tabell--stripet">
                <thead>
                    <th>Lagt i listen</th>
                    <th>Navn på kandidatliste</th>
                    <th>Arbeidsgiver</th>
                    <th>Lagt til av</th>
                    <th>Status</th>
                    <th>Utfall</th>
                    <th>Stilling</th>
                </thead>
                <tbody>
                    {kandidatlister.map((liste) => (
                        <tr>
                            <td>{liste.lagtTilTidspunkt}</td>
                            <td>
                                <Link className="lenke" to={lenkeTilKandidatliste(liste.uuid)}>
                                    {liste.tittel}
                                </Link>
                            </td>
                            <td>{liste.organisasjonNavn}</td>
                            <td>
                                {liste.lagtTilAvNavn} ({liste.lagtTilAvIdent})
                            </td>
                            <td>
                                <Statusvisning status={liste.status} />
                            </td>
                            <td>{liste.utfall}</td>
                            <td>
                                {liste.stillingId && (
                                    <Lenke href={lenkeTilStilling(liste.stillingId)}>
                                        Se stilling
                                    </Lenke>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Historikkside;
