import React from 'react';
import { connect } from 'react-redux';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Bransje, Sok } from './Bransje';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import { SEARCH, SET_STATE, TOGGLE_VIKTIGE_YRKER_APEN } from '../../sok/searchReducer';
import { LUKK_ALLE_SOKEPANEL } from '../../sok/konstanter';

import './Bransjevelger.less';

interface BransjevelgerProps {
    bransje: Bransje;
    setQuery: (query) => void;
    search: () => void;
    toggleViktigeYrkerApen: () => void;
    lukkAlleSokepanel: () => void;
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

const linkurl = (sok: Sok) => {
    return '#sokekriterier';
};

const Bransjevelger = (props: BransjevelgerProps) => {
    const { bransje, setQuery, search, toggleViktigeYrkerApen, lukkAlleSokepanel } = props;

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
        toggleViktigeYrkerApen();
    };
    return (
        <div className="bransjevelger">
            <Ekspanderbartpanel border className="bransjevelger__bransje" tittel={bransje.navn}>
                <div className="bransjevelger__bransjer">
                    {bransje.yrker.map(bransje => (
                        <div key={bransje.tittel} className="bransjevelger__bransje__innhold">
                            <Element>{bransje.tittel}</Element>
                            <Normaltekst>Se kandidater som har:</Normaltekst>

                            {bransje.sok.map(url => (
                                <Lenke
                                    href={linkurl(url)}
                                    key={bransje.tittel}
                                    onClick={() => onLenkeKlikk(url)}
                                >
                                    {linktekst(url)}
                                </Lenke>
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
    toggleViktigeYrkerApen: () => dispatch({ type: TOGGLE_VIKTIGE_YRKER_APEN }),
    lukkAlleSokepanel: () => dispatch({ type: LUKK_ALLE_SOKEPANEL }),
});

const mapStateToProps = state => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Bransjevelger);
