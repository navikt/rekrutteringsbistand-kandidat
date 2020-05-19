import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { KandidatlisterForKandidatActionType } from './historikkReducer';
import { Nettstatus } from '../../../felles/common/remoteData';
import { useRouteMatch } from 'react-router-dom';
import AppState from '../../AppState';
import 'nav-frontend-tabell-style';
import './Historikkside.less';

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
            <h2>Historikk</h2>

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
                            <td>{liste.tittel}</td>
                            <td>{liste.organisasjonNavn}</td>
                            <td>
                                {liste.lagtTilAvNavn} ({liste.lagtTilAvIdent})
                            </td>
                            <td>{liste.status}</td>
                            <td>{liste.utfall}</td>
                            <td>{liste.stillingId}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ul>
                {kandidatlister.map((liste) => (
                    <li key={liste.uuid}>
                        <pre>{JSON.stringify(liste, null, 2)}</pre>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Historikkside;
