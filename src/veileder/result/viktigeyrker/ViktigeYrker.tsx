import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Normaltekst, Systemtittel, Ingress } from 'nav-frontend-typografi';
import { EkspanderbartpanelPure } from 'nav-frontend-ekspanderbartpanel';
import './ViktigeYrker.less';
import ViktigeYrkerIkon from './ViktigeyrkerIkon';
import Bransjevelger from './Bransjevelger';
import {
    HENT_FERDIGUTFYLTE_STILLINGER,
    TOGGLE_VIKTIGE_YRKER_APEN,
    FERDIGUTFYLTESTILLINGER_KLIKK,
} from '../../sok/searchReducer';
import { FerdigutfylteStillinger, FerdigutfylteStillingerKlikk } from './Bransje';

interface ViktigeYrkerProps {
    hentFerdigutfylteStillinger: () => void;
    ferdigutfylteStillinger: FerdigutfylteStillinger;
    viktigeYrkerApen: boolean;
    toggleViktigeYrkerApen: () => void;
    visViktigeYrker: boolean;
    ferdigutfylteStillingerKlikk: (
        FerdigutfylteStillingerKlikk: FerdigutfylteStillingerKlikk
    ) => void;
}

const ViktigeYrker = (props: ViktigeYrkerProps) => {
    const {
        hentFerdigutfylteStillinger,
        ferdigutfylteStillinger,
        viktigeYrkerApen,
        toggleViktigeYrkerApen,
        visViktigeYrker,
        ferdigutfylteStillingerKlikk,
    } = props;

    useEffect(() => {
        hentFerdigutfylteStillinger();
    }, [hentFerdigutfylteStillinger]);

    const onViktigeYrkerKlikk = () => {
        if (!viktigeYrkerApen) {
            ferdigutfylteStillingerKlikk({ bransje: '', linktekst: '' });
        }
        toggleViktigeYrkerApen();
    };

    if (!visViktigeYrker) return <div />;

    return (
        <EkspanderbartpanelPure
            border
            tag="section"
            apen={viktigeYrkerApen}
            className="viktigeYrker"
            onClick={onViktigeYrkerKlikk}
            // @ts-ignore
            tittel={
                <div className="viktige-yrker__tittel-og-ikon">
                    <div className="viktige-yrker__ikon">
                        <ViktigeYrkerIkon />
                    </div>
                    <div className="viktige-yrker__tittel">
                        <Systemtittel>Finn kandidater til viktige yrker</Systemtittel>
                        <Ingress>
                            Koronasituasjonen gjør at vi kan risikere mangel på arbeidskraft til
                            viktige oppgaver i samfunnet.
                        </Ingress>
                    </div>
                </div>
            }
        >
            <div className="viktige-yrker__innhold">
                {ferdigutfylteStillinger &&
                    ferdigutfylteStillinger.bransjer.map(bransje => (
                        <Bransjevelger key={bransje.navn} bransje={bransje} />
                    ))}
            </div>
        </EkspanderbartpanelPure>
    );
};

const mapDispatchToProps = dispatch => ({
    hentFerdigutfylteStillinger: () => dispatch({ type: HENT_FERDIGUTFYLTE_STILLINGER }),
    toggleViktigeYrkerApen: () => dispatch({ type: TOGGLE_VIKTIGE_YRKER_APEN }),
    ferdigutfylteStillingerKlikk: (ferdigutfylteStillingerKlikk: FerdigutfylteStillingerKlikk) =>
        dispatch({ type: FERDIGUTFYLTESTILLINGER_KLIKK, ferdigutfylteStillingerKlikk }),
});

const mapStateToProps = state => ({
    ferdigutfylteStillinger: state.search.ferdigutfylteStillinger,
    viktigeYrkerApen: state.search.viktigeYrkerApen,
    visViktigeYrker: state.search.featureToggles['vis-viktige-yrker-lenker'],
});

export default connect(mapStateToProps, mapDispatchToProps)(ViktigeYrker);
