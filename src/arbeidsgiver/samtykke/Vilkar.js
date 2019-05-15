import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import { Column, Row } from 'nav-frontend-grid';
import './SamtykkeSide.less';

const Vilkar = ({ samtykkeTekst }) => (
    <div>
        <Row>
            <Column xs="12">
                <div className="vilkar-text">
                    {ReactHtmlParser(samtykkeTekst)}
                </div>
            </Column>
        </Row>
    </div>
);

Vilkar.propTypes = {
    samtykkeTekst: PropTypes.string.isRequired
};

export default Vilkar;
