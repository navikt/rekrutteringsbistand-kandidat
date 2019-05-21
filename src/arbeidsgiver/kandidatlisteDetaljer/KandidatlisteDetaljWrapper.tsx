import * as React from 'react';
import { FunctionComponent, useEffect } from 'react';
import { KandidatlisteDetaljer, KandidatlisteTypes } from './kandidatlisteReducer';
import { connect } from 'react-redux';
import { RemoteData, RemoteDataTypes } from '../../felles/common/remoteData';
import NavFrontendSpinner from 'nav-frontend-spinner';
import KandidatlisteDetaljKomponent from './KandidatlisteDetalj';

interface Props {
    kandidatlisteId: string,
    kandidatliste: RemoteData<KandidatlisteDetaljer>
    hentKandidatliste: (string) => void,
}

const KandidatlisteDetaljerWrapper: FunctionComponent<Props> = ({ hentKandidatliste, kandidatlisteId, kandidatliste }) => {
    useEffect(() => {
        hentKandidatliste(kandidatlisteId);
    }, [kandidatlisteId]);

    switch (kandidatliste.kind) {
        case RemoteDataTypes.LOADING:
            return (
                <div className="KandidatlisteDetalj__spinner--wrapper">
                    <NavFrontendSpinner />
                </div>
            );
        case RemoteDataTypes.SUCCESS:
            return <KandidatlisteDetaljKomponent kandidatliste={kandidatliste.data} />;

        default:
            return null;

    }
};

const mapStateToProps = (state, props) => ({
    ...props,
    kandidatlisteId: props.match.params.listeid,
    kandidatliste: state.kandidatlisteDetaljer.kandidatliste
});

const mapDispatchToProps = (dispatch) => ({
    hentKandidatliste: (kandidatlisteId) => dispatch({ type: KandidatlisteTypes.HENT_KANDIDATLISTE, kandidatlisteId })
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidatlisteDetaljerWrapper);
