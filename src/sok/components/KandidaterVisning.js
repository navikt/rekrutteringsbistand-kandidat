import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Ingress, Systemtittel } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import KandidaterTableHeader from './KandidaterTableHeader';
import KandidaterTableRow from './KandidaterTableRow';

class KandidaterVisning extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let tittel = '';
        if (this.props.treff > 5) {
            tittel = 'Topp 5 kandidater';
        } else if (this.props.treff === 0) {
            tittel = 'Ingen direkte treff';
        } else if (this.props.treff === 1) {
            tittel = 'Beste kandidat';
        } else {
            tittel = `Topp ${this.props.treff} kandidater`;
        }
        return (
            <div>
                <Row className="panel resultatvisning">
                    <Column md="6">
                        <Ingress className="text--left"><strong>{this.props.treff}</strong> treff på aktuelle kandidater</Ingress>
                    </Column>
                    <Column md="6">
                        <a href="#" className="lenke lenke--lagre--sok">Lagre søk og liste over kandidater</a>
                    </Column>
                </Row>
                <div className="resultatvisning">
                    <Systemtittel>{tittel}</Systemtittel>
                    <KandidaterTableHeader />
                    {this.props.cver.slice(0, 5).map((cv, i) => (
                        <KandidaterTableRow
                            // TODO: Rewrite the next line after user-test
                            cv={i === 1 ? { ...cv, samtykkeStatus: 'N' } : cv}
                            // cv={cv}
                            key={cv.epostadresse}
                        />
                    ))}
                </div>
                {this.props.cver.length > 5 ? (
                    <div className="resultatvisning">
                        <Systemtittel>Andre aktuelle kandidater</Systemtittel>
                        <KandidaterTableHeader />
                        {this.props.cver.slice(5).map((cv) => (
                            <KandidaterTableRow
                                cv={cv}
                                key={cv.epostadresse}
                            />
                        ))}
                    </div>
                ) : <div />}
            </div>
        );
    }
}

KandidaterVisning.propTypes = {
    cver: PropTypes.arrayOf(PropTypes.object).isRequired,
    treff: PropTypes.number.isRequired
};

const mapStateToProps = (state) => ({
    cver: state.elasticSearchResultat.resultat.cver,
    treff: state.elasticSearchResultat.total
});

export default connect(mapStateToProps)(KandidaterVisning);
