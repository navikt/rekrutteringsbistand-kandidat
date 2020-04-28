import React, { FunctionComponent } from 'react';
import './CVMeny.less';

interface Props {
    fødselsnummer: string;
}

const CVMeny: FunctionComponent<Props> = (props) => {
    return (
        <div className="cv-meny">
            <a
                className="frittstaende-lenke ForlateSiden link"
                href={`https://app.adeo.no/veilarbpersonflatefs/${props.fødselsnummer}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                <i className="ForlateSiden__icon" />
                <span className="cv-meny__se-aktivitetsplan">Se aktivitetsplan</span>
            </a>
            <div className="cv-meny__children">{props.children}</div>
        </div>
    );
};

export default CVMeny;
