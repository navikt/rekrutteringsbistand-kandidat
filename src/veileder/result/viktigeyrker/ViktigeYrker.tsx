import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import './ViktigeYrker.less';
import ViktigeYrkerIkon from './ViktigeyrkerIkon';
import Bransjevelger from './Bransjevelger';
import { HENT_FERDIGUTFYLTE_STILLINGER } from '../../sok/searchReducer';
import { FerdigutfylteStillinger } from './Bransje';

interface ViktigeYrkerProps {
    hentFerdigutfylteStillinger: () => void;
    ferdigutfylteStillinger: FerdigutfylteStillinger;
}

const ViktigeYrker = (props: ViktigeYrkerProps) => {
    useEffect(() => {
        props.hentFerdigutfylteStillinger();
    }, []);
    const ferdigutfylteStillinger: FerdigutfylteStillinger = props.ferdigutfylteStillinger;

    return (
        <Ekspanderbartpanel
            className="viktigeYrker"
            tittel={
                <div className="viktigeYrker__tittel">
                    <div className="viktigeYrker__tittel--ikon">
                        <ViktigeYrkerIkon />
                    </div>
                    <div className="viktigeYrker__tittel--tekst">
                        <Element>Finn kandidater til viktige yrker</Element>
                        <Normaltekst>
                            Koronasituasjonen gjør at vi kan risikere mangel på arbeidskraft til 
                            viktige oppgave i samfunnet.
                        </Normaltekst>
                    </div>
                </div>
            }
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

export default connect(mapStateToProps, mapDispatchToProps)(ViktigeYrker);
