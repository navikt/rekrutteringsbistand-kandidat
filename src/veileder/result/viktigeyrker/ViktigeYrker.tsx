import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import { EkspanderbartpanelPure } from 'nav-frontend-ekspanderbartpanel';
import './ViktigeYrker.less';
import ViktigeYrkerIkon from './ViktigeyrkerIkon';
import Bransjevelger from './Bransjevelger';
import { HENT_FERDIGUTFYLTE_STILLINGER, TOGGLE_VIKTIGE_YRKER_APEN } from '../../sok/searchReducer';
import { FerdigutfylteStillinger } from './Bransje';

interface ViktigeYrkerProps {
    hentFerdigutfylteStillinger: () => void;
    ferdigutfylteStillinger: FerdigutfylteStillinger;
    viktigeYrkerApen: boolean;
    toggleViktigeYrkerApen: () => void;
    visViktigeYrker: boolean;
}

const ViktigeYrker = (props: ViktigeYrkerProps) => {
    const {
        hentFerdigutfylteStillinger,
        ferdigutfylteStillinger,
        viktigeYrkerApen,
        toggleViktigeYrkerApen,
        visViktigeYrker,
    } = props;

    useEffect(() => {
        hentFerdigutfylteStillinger();
    }, [hentFerdigutfylteStillinger]);

    if (!visViktigeYrker) return <div />;

    return (
        <EkspanderbartpanelPure
            border
            apen={viktigeYrkerApen}
            className="viktigeYrker"
            onClick={toggleViktigeYrkerApen}
            // @ts-ignore
            tittel={
                <div className="viktigeYrker__tittel">
                    <div className="viktigeYrker__tittel--ikon">
                        <ViktigeYrkerIkon />
                    </div>
                    <div className="viktigeYrker__tittel--tekst">
                        <Element>Finn kandidater til viktige yrker</Element>
                        <Normaltekst>
                            Koronasituasjonen gjør at vi kan risikere mangel på arbeidskraft til
                            viktige oppgaver i samfunnet.
                        </Normaltekst>
                    </div>
                </div>
            }
        >
            {ferdigutfylteStillinger &&
                ferdigutfylteStillinger.bransjer.map(bransje => (
                    <Bransjevelger key={bransje.navn} bransje={bransje} />
                ))}
        </EkspanderbartpanelPure>
    );
};

const mapDispatchToProps = dispatch => ({
    hentFerdigutfylteStillinger: () => dispatch({ type: HENT_FERDIGUTFYLTE_STILLINGER }),
    toggleViktigeYrkerApen: () => dispatch({ type: TOGGLE_VIKTIGE_YRKER_APEN }),
});

const mapStateToProps = state => ({
    ferdigutfylteStillinger: state.search.ferdigutfylteStillinger,
    viktigeYrkerApen: state.search.viktigeYrkerApen,
    visViktigeYrker: state.search.featureToggles['vis-viktige-yrker-lenker'],
});

export default connect(mapStateToProps, mapDispatchToProps)(ViktigeYrker);
