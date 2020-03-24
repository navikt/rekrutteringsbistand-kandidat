import React from 'react';
import { connect } from 'react-redux';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Bransje, Sok } from './Bransje';
import { Normaltekst, Element } from 'nav-frontend-typografi';

interface BransjevelgerProps {
    bransje: Bransje;
}

const linktekst = (sok: Sok) => {
    return ;
};

const Bransjevelger = (props: BransjevelgerProps) => {
    const { bransje } = props;
    return (
        <div>
            <Ekspanderbartpanel className="ekspanderbartPanel--bransje" tittel={bransje.navn}>
                <div>
                    {bransje.yrker.map(_ => (
                        <div key={_.tittel}>
                            <Element>{_.tittel}</Element>
                            <Normaltekst>Se kandidater som har:</Normaltekst>
                            {_.sok.map(_ => <Normaltekst key={_.tittel}>{_.tittel}</Normaltekst>)}
                            <div></div>
                        </div>
                    ))}
                    w
                </div>
            </Ekspanderbartpanel>
        </div>
    );
};

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Bransjevelger);
