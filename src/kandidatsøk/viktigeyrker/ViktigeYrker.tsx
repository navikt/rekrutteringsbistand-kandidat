import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Systemtittel, Ingress } from 'nav-frontend-typografi';
import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel';
import './ViktigeYrker.less';
import ViktigeYrkerIkon from './ViktigeyrkerIkon';
import Bransjevelger from './Bransjevelger';
import { KandidatsøkActionType } from '../reducer/searchActions';
import { FerdigutfylteStillinger, FerdigutfylteStillingerKlikk } from './Bransje';
import AppState from '../../AppState';

interface ViktigeYrkerProps {
    hentFerdigutfylteStillinger: () => void;
    ferdigutfylteStillinger: FerdigutfylteStillinger;
    viktigeYrkerApen: boolean;
    toggleViktigeYrkerApen: () => void;
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

    return (
        <EkspanderbartpanelBase
            border
            apen={viktigeYrkerApen}
            className="viktige-yrker"
            onClick={onViktigeYrkerKlikk}
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
                    ferdigutfylteStillinger.bransjer.map((bransje) => (
                        <Bransjevelger key={bransje.navn} bransje={bransje} />
                    ))}
            </div>
        </EkspanderbartpanelBase>
    );
};

const mapDispatchToProps = (dispatch) => ({
    hentFerdigutfylteStillinger: () =>
        dispatch({ type: KandidatsøkActionType.HentFerdigutfylteStillinger }),
    toggleViktigeYrkerApen: () => dispatch({ type: KandidatsøkActionType.ToggleViktigeYrkerApen }),
    ferdigutfylteStillingerKlikk: (ferdigutfylteStillingerKlikk: FerdigutfylteStillingerKlikk) =>
        dispatch({
            type: KandidatsøkActionType.FerdigutfyltestillingerKlikk,
            ferdigutfylteStillingerKlikk,
        }),
});

const mapStateToProps = (state: AppState) => ({
    ferdigutfylteStillinger: state.søk.ferdigutfylteStillinger,
    viktigeYrkerApen: state.søk.viktigeYrkerApen,
});

export default connect(mapStateToProps, mapDispatchToProps)(ViktigeYrker);
