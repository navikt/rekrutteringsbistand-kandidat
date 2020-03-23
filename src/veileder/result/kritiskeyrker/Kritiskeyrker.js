import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import './Kritiskeyrker.less';
import KritiskeyrkerIkon from './Kritiskeyrkerikon';
import Bransjevelger from './Bransjevelger';

class Kritiskeyrker extends React.Component {
    
    render() {
        return (

                <Ekspanderbartpanel
                    className="ekspanderbartPanel--kritiskeyrker"
                    id="ekspanderbartpanel-kritiskeyrker"
                    tittel={
                        <div className="ekspanderbartpanel-kritiskeyrker-tittel">

                            <div className="ekspanderbartpanel-kritiskeyrker--sirkel">
                                <KritiskeyrkerIkon />
                            </div>
                            <div className="ekspanderbartpanel-kritiskeyrker--tekst">
                                <Element>Finn kandidater til kritiske yrker</Element>
                                <Normaltekst>
                                    På grunn av coronaviruset kan vi risikere at det blir mangel på
                                    arbeidskraft innenfor kritiske samfunnsfunksjoner
                                </Normaltekst>
                            </div>
                        </div>
                    }
                    apen
                >
                    <Bransjevelger bransje="Helse og omsorg"/>
                    <Bransjevelger bransje="Forsyningssikkerhet"/>
                    <Bransjevelger bransje="Transport"/>
                </Ekspanderbartpanel>
        );
    }
}

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Kritiskeyrker);
