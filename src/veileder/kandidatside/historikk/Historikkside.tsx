import React, { FunctionComponent, useEffect } from 'react';
import { connect } from 'react-redux';
import { HistorikkState, KandidatlisterForKandidatActionType } from './historikkReducer';
import { Nettstatus } from '../../../felles/common/remoteData';
import { useRouteMatch } from 'react-router-dom';

interface Props {
    hentKandidatlisterForKandidat: (
        kandidatnr: string,
        inkluderSlettede?: boolean,
        filtrerPåStilling?: string
    ) => void;
    historikk: HistorikkState;
}

const Historikkside: FunctionComponent<Props> = ({ hentKandidatlisterForKandidat, historikk }) => {
    const { params } = useRouteMatch<{ kandidatnr: string }>();
    const kandidatnr = params.kandidatnr;

    useEffect(() => {
        hentKandidatlisterForKandidat(kandidatnr);
    }, [kandidatnr, hentKandidatlisterForKandidat]);

    if (historikk.kandidatlisterForKandidat.kind !== Nettstatus.Suksess) {
        return null;
    }

    const kandidatlister = historikk.kandidatlisterForKandidat.data;
    return (
        <div>
            <h2>Historikk</h2>
            <ul>
                {kandidatlister.map((liste) => (
                    <li key={liste.uuid}>{JSON.stringify(liste)}</li>
                ))}
            </ul>
        </div>
    );
};

const mapStateToProps = (state) => ({
    historikk: state.historikk,
});

const mapDispatchToProps = (dispatch) => ({
    hentKandidatlisterForKandidat: (
        kandidatnr: string,
        inkluderSlettede?: boolean,
        filtrerPåStilling?: string
    ) =>
        dispatch({
            type: KandidatlisterForKandidatActionType.Fetch,
            kandidatnr,
            inkluderSlettede,
            filtrerPåStilling,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Historikkside);
