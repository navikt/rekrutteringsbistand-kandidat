import React from 'react';
import { Row, Column } from 'nav-frontend-grid';
import './Toppmeny.less';
import { LOGOUT_URL } from '../fasitProperties';

const Toppmeny = () => (
    <div className="header">
        <span className="pilot typo-element">Tidlig versjon</span>
        <Row className="header__row">
            <Column xs="3" sm="1">
                <div className="header__logo">
                    <a id="goto-forsiden" href="/" title="Gå til forsiden" className="logo" >
                        Tjeneste
                    </a>
                </div>
            </Column>
            <Column xs="12" sm="11">
                <div className="pull">
                    <a id="logg-ut" href={LOGOUT_URL} className="knapp knapp--mini knapp--loggut">
                        Logg ut
                    </a>
                </div>
            </Column>
        </Row>
    </div>
);

export default Toppmeny;
