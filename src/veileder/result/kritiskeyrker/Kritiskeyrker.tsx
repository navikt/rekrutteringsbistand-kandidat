import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import './Kritiskeyrker.less';
import KritiskeyrkerIkon from './Kritiskeyrkerikon';
import Bransjevelger from './Bransjevelger';
import { HENT_FERDIGUTFYLTE_STILLINGER } from '../../sok/searchReducer';
import { FerdigutfylteStillinger } from './Bransje';

interface KritiskeyrkerProps {
    hentFerdigutfylteStillinger: () => void;
    ferdigutfylteStillinger: FerdigutfylteStillinger;
}

const Kritiskeyrker = (props: KritiskeyrkerProps) => {
    useEffect(() => {
        props.hentFerdigutfylteStillinger();
    }, []);
    const ferdigutfylteStillinger: FerdigutfylteStillinger = props.ferdigutfylteStillinger;

    return (
        <Ekspanderbartpanel
            className="kritiskeyrker"
            tittel={
                <div className="kritiskeyrker__tittel">
                    <div className="kritiskeyrker__tittel--ikon">
                        <KritiskeyrkerIkon />
                    </div>
                    <div className="kritiskeyrker__tittel--tekst">
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
            <div>
            {ferdigutfylteStillinger &&
                ferdigutfylteStillinger.bransjer.map(_ => (
                    <Bransjevelger key={_.navn} bransje={_} />
                ))}
            </div>
        </Ekspanderbartpanel>
    );
};

const mapDispatchToProps = dispatch => ({
    hentFerdigutfylteStillinger: () => dispatch({ type: HENT_FERDIGUTFYLTE_STILLINGER }),
});

const mapStateToProps = state => ({
    ferdigutfylteStillinger: state.search.ferdigutfylteStillinger,
});

export default connect(mapStateToProps, mapDispatchToProps)(Kritiskeyrker);
