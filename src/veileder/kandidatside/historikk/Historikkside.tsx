import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { KandidatlisterForKandidatActionType } from './historikkReducer';
import { Nettstatus } from '../../../felles/common/remoteData';
import { useRouteMatch } from 'react-router-dom';
import AppState from '../../AppState';

const Historikkside: FunctionComponent = () => {
    const { params } = useRouteMatch<{ kandidatnr: string }>();
    const kandidatnr = params.kandidatnr;
    const historikk = useSelector((state: AppState) => state.historikk);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: KandidatlisterForKandidatActionType.Fetch,
            kandidatnr,
        });
    }, [kandidatnr, dispatch]);

    if (historikk.kandidatlisterForKandidat.kind !== Nettstatus.Suksess) {
        return null;
    }

    const kandidatlister = historikk.kandidatlisterForKandidat.data;
    return (
        <div>
            <h2>Historikk</h2>
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
