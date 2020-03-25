import React from 'react';
import { connect } from 'react-redux';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Bransje, Sok } from './Bransje';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import './Bransjevelger.less';
import { SEARCH, SET_STATE, TOGGLE_VIKTIGE_YRKER_APEN } from '../../sok/searchReducer';
interface BransjevelgerProps {
    bransje: Bransje;
    setQuery: () => void;
    search: () => void;
    toggleViktigeYrkerApen: () => void;
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
    return '#';
};

const Bransjevelger = (props: BransjevelgerProps) => {
    const { bransje, setQuery, search, toggleViktigeYrkerApen } = props;

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

        setQuery(query);
        search();
        toggleViktigeYrkerApen();
    };
    return (
        <div className="bransjevelger">
            <Ekspanderbartpanel className="bransjevelger__bransje" tittel={bransje.navn}>
                <div className="bransjevelger__bransjer">
                    {bransje.yrker.map(_ => (
                        <div key={_.tittel} className="bransjevelger__bransje__innhold">
                            <Element>{_.tittel}</Element>
                            <Normaltekst>Se kandidater som har:</Normaltekst>

                            {_.sok.map(_ => (
                                <Lenke
                                    href={linkurl(_)}
                                    key={_.tittel}
                                    onClick={() => onLenkeKlikk(_)}
                                >
                                    {linktekst(_)}
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
    setQuery: (query) => dispatch({ type: SET_STATE, query }),
    search: () => dispatch({ type: SEARCH }),
    toggleViktigeYrkerApen: () => dispatch({ type: TOGGLE_VIKTIGE_YRKER_APEN }),
});

const mapStateToProps = state => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Bransjevelger);
