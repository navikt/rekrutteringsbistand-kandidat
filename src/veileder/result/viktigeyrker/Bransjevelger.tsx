import React from 'react';
import { connect } from 'react-redux';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Bransje, Sok, FerdigutfylteStillingerKlikk } from './Bransje';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import { SEARCH, SET_STATE, FERDIGUTFYLTESTILLINGER_KLIKK, LUKK_ALLE_SOKEPANEL } from '../../sok/searchReducer';

import './Bransjevelger.less';

interface BransjevelgerProps {
    bransje: Bransje;
    setQuery: (query) => void;
    search: () => void;
    lukkAlleSokepanel: () => void;
    ferdigutfylteStillingerKlikk: (
        FerdigutfylteStillingerKlikk: FerdigutfylteStillingerKlikk
    ) => void;
}

export const hentQueryUtenKriterier = () => ({
    fritekst: '',
    stillinger: [],
    arbeidserfaringer: [],
    utdanninger: [],
    kompetanser: [],
    geografiList: [],
    geografiListKomplett: [],
    totalErfaring: [],
    utdanningsniva: [],
    sprak: [],
    kvalifiseringsgruppeKoder: [],
    maaBoInnenforGeografi: false,
});

const linktekst = (sok: Sok) => {
    return `${sok.tittel} (${sok.antallTreff})`;
};

const linkurl = '#sokeresultat';

const Bransjevelger = (props: BransjevelgerProps) => {
    const { bransje, setQuery, search, lukkAlleSokepanel, ferdigutfylteStillingerKlikk } = props;

    const onBransjeKlikk = () => {
        props.ferdigutfylteStillingerKlikk({ bransje: bransje.navn, linktekst: '' });
    };

    const onLenkeKlikk = (sok: Sok) => {
        const query = {
            fritekst: '',
            stillinger: sok.jobbonsker,
            arbeidserfaringer: sok.yrkeserfaring,
            utdanninger: [],
            kompetanser: sok.kompetanser,
            forerkort: sok.forerkort,
            geografiList: [],
            geografiListKomplett: [],
            totalErfaring: [],
            utdanningsniva: [],
            sprak: [],
            kvalifiseringsgruppeKoder: [],
            maaBoInnenforGeografi: false,
            lokasjoner: [],
            navkontor: undefined,
            hovedmal: undefined,
            tilretteleggingsbehov: undefined,
            kategorier: undefined,
        };

        lukkAlleSokepanel();
        setQuery(query);
        search();

        ferdigutfylteStillingerKlikk({ bransje: bransje.navn, linktekst: sok.tittel });
    };
    return (
        <div className="bransjevelger">
            <Ekspanderbartpanel
                tag="h3"
                border
                className="bransjevelger__bransje"
                tittel={bransje.navn}
                onClick={onBransjeKlikk}
            >
                <div className="bransjevelger__bransjer">
                    {bransje.yrker.map(yrke => (
                        <div key={yrke.tittel} className="bransjevelger__yrke">
                            <Element tag="h4">{yrke.tittel}</Element>
                            <Normaltekst>Se kandidater som har:</Normaltekst>

                            {yrke.sok.map(sok => (
                                <div key={sok.tittel} className="bransjevelger__lenke">
                                    <Lenke href={linkurl} onClick={() => onLenkeKlikk(sok)}>
                                        {linktekst(sok)}
                                    </Lenke>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </Ekspanderbartpanel>
        </div>
    );
};

const mapDispatchToProps = dispatch => ({
    setQuery: query => dispatch({ type: SET_STATE, query }),
    search: () => dispatch({ type: SEARCH }),
    lukkAlleSokepanel: () => dispatch({ type: LUKK_ALLE_SOKEPANEL }),
    ferdigutfylteStillingerKlikk: (ferdigutfylteStillingerKlikk: FerdigutfylteStillingerKlikk) =>
        dispatch({ type: FERDIGUTFYLTESTILLINGER_KLIKK, ferdigutfylteStillingerKlikk }),
});

const mapStateToProps = state => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Bransjevelger);
