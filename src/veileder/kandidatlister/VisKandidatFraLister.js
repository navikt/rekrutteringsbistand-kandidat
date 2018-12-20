import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Lenke from 'nav-frontend-lenker';
import { Undertittel } from 'nav-frontend-typografi';
import NavFrontendSpinner from 'nav-frontend-spinner';
import cvPropTypes from '../../felles/PropTypes';
import { FETCH_CV, HENT_CV_STATUS } from '../sok/cv/cvReducer';
import VisKandidatPersonalia from '../../felles/result/visKandidat/VisKandidatPersonalia';
import VisKandidatCv from '../../felles/result/visKandidat/VisKandidatCv';
import VisKandidatJobbprofil from '../../felles/result/visKandidat/VisKandidatJobbprofil';
import '../../felles/common/ikoner/ikoner.less';

class VisKandidatFraLister extends React.Component {
    componentDidMount() {
        this.props.hentCvForKandidat(this.props.match.params.kandidatNr, this.props.cv.profilId);
    }

    render() {
        const { cv, stillingsId, hentStatus } = this.props;
        if (hentStatus === HENT_CV_STATUS.LOADING) {
            return (
                <div className="text-center">
                    <NavFrontendSpinner type="L" />
                </div>
            );
        }
        return (
            <div>
                <VisKandidatPersonalia
                    cv={cv}
                    stillingsId={stillingsId}
                    contextRoot="kandidater/lister"
                    appContext="veileder"
                    fantCv={hentStatus === HENT_CV_STATUS.SUCCESS}
                />
                {hentStatus === HENT_CV_STATUS.FINNES_IKKE ? (
                    <div className="cvIkkeFunnet">
                        <div className="content">
                            <Undertittel className="tekst">
                                Du kan ikke se mer informasjon om kandidaten nå.
                                Årsaken kan være at kandidaten har skiftet status, eller tekniske problemer i søk.
                            </Undertittel>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="VisKandidat-knapperad">
                            <div className="content">
                                <Lenke className="frittstaende-lenke ForlateSiden" href={`https://app.adeo.no/veilarbpersonflatefs/${cv.fodselsnummer}`} target="_blank">
                                    <span className="lenke">Se aktivitetsplan</span>
                                    <i className="ForlateSiden__icon" />
                                </Lenke>
                            </div>
                        </div>
                        <div className="viskandidat-container">
                            <VisKandidatJobbprofil cv={cv} />
                            <VisKandidatCv cv={cv} />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

VisKandidatFraLister.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            kandidatNr: PropTypes.string
        })
    }).isRequired,
    cv: cvPropTypes.isRequired,
    hentStatus: PropTypes.string.isRequired,
    hentCvForKandidat: PropTypes.func.isRequired,
    stillingsId: PropTypes.string.isRequired
};

const mapStateToProps = (state, props) => ({
    stillingsId: props.match.params.listeid,
    hentStatus: state.cvReducer.hentStatus,
    cv: state.cvReducer.cv
});

const mapDispatchToProps = (dispatch) => ({
    hentCvForKandidat: (arenaKandidatnr, profilId) => dispatch({ type: FETCH_CV, arenaKandidatnr, profilId })
});


export default connect(mapStateToProps, mapDispatchToProps)(VisKandidatFraLister);
