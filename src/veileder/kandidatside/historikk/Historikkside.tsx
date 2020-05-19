import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { KandidatlisterForKandidatActionType } from './historikkReducer';

interface Props {
    hentKandidatlisterForKandidat: (
        kandidatnr: string,
        inkluderSlettede?: boolean,
        filtrerPåStilling?: string
    ) => void;
}

const Historikkside: FunctionComponent<Props> = (props) => {
    return (
        <div>
            <h2>Historikk</h2>
            <button onClick={() => props.hentKandidatlisterForKandidat('CD430805')}>
                klikk meg
            </button>
        </div>
    );
};

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

export default connect(null, mapDispatchToProps)(Historikkside);
