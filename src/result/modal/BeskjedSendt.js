import React from 'react';
import PropTypes from 'prop-types';
import { Undertittel } from 'nav-frontend-typografi';
import './Modal.less';

export default function BeskjedSendt({ toggleModalOpen }) {
    return (
        <div className="panel panel--padding">
            <Undertittel className="undertittel--beskjed--sendt">Beskjeden til kandidaten er sendt</Undertittel>
            <button className="lenke" onClick={toggleModalOpen}>Gå tilbake til søkeresultat</button>
        </div>
    );
}

BeskjedSendt.propTypes = {
    toggleModalOpen: PropTypes.func.isRequired
};
