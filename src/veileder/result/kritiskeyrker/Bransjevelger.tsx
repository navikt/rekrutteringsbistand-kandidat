import React from 'react';
import { connect } from 'react-redux';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Bransje } from './Bransje';

interface BransjevelgerProps {
    bransje: Bransje,
}

const Bransjevelger = (props: BransjevelgerProps) => {
    const {bransje} = props;
    return <div>
    <Ekspanderbartpanel
     className="ekspanderbartPanel--bransje"
     tittel={bransje.navn}
    >
        content
    </Ekspanderbartpanel>
</div>
}


const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Bransjevelger);