import React from 'react';
import { connect } from 'react-redux';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Bransje, Sok } from './Bransje';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import './Bransjevelger.less';

interface BransjevelgerProps {
    bransje: Bransje;
}

const linktekst = (sok: Sok) => {
    return `${sok.tittel} (${sok.antallTreff})`;
};

const Bransjevelger = (props: BransjevelgerProps) => {
    const { bransje } = props;
    return (
        <div className="bransjevelger">
            <Ekspanderbartpanel className="bransjevelger__bransje" tittel={bransje.navn}>
                <div className="bransjevelger__bransjer">
                    {bransje.yrker.map(_ => (
                        <div key={_.tittel} className="bransjevelger__bransje__innhold">
                            <Element>{_.tittel}</Element>
                            <Normaltekst>Se kandidater som har:</Normaltekst>
                            {_.sok.map(_ => (
                                <Normaltekst className="bransjevelger__linktekst" key={_.tittel}>
                                    {linktekst(_)}
                                </Normaltekst>
                            ))}
                            <div></div>
                        </div>
                    ))}
                </div>
            </Ekspanderbartpanel>
        </div>
    );
};

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Bransjevelger);
