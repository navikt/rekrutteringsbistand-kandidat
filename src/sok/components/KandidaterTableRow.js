import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';

export default function KandidaterTableRow({ kandidat, utdanning, arbeidserfaring, arbeidserfaringTid, cvLenke }) {
    return (
        <div className="panel border--bottom--thin">
            <Row>
                <Column md="2"><Normaltekst>{`Kandidat ${kandidat + 1}`}</Normaltekst></Column>
                <Column md="4"><Normaltekst>{utdanning}</Normaltekst></Column>
                <Column md="3"><Normaltekst>{arbeidserfaring}</Normaltekst></Column>
                <Column md="2" className="text-center"><Normaltekst>{arbeidserfaringTid}</Normaltekst></Column>
                <Column md="1"><a className="lenke" href={cvLenke}>CV</a></Column>
            </Row>
        </div>
    );
}

KandidaterTableRow.propTypes = {
    kandidat: PropTypes.number.isRequired,
    utdanning: PropTypes.string.isRequired,
    arbeidserfaring: PropTypes.string.isRequired,
    arbeidserfaringTid: PropTypes.string.isRequired,
    cvLenke: PropTypes.string.isRequired
};
