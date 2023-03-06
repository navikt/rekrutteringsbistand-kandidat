import React, { FunctionComponent } from 'react';
import './LastNedCv.less';

import { sendEvent } from '../../../amplitude/amplitude';
import useMiljøvariabler from '../../../common/useMiljøvariabler';

interface Props {
    fodselsnummer: string;
}

const LastNedCv: FunctionComponent<Props> = ({ fodselsnummer }) => {
    const { lastNedCvUrl } = useMiljøvariabler();

    return (
        <div className="kandidat-last-ned-cv">
            <div className="kandidat-last-ned-cv__content">
                <div className="kandidat-last-ned-cv__lenker">
                    <a
                        className="LastNed lenke"
                        href={`${lastNedCvUrl}${fodselsnummer}`}
                        target="_blank"
                        onClick={() => sendEvent('cv_last_ned', 'klikk')}
                        rel="noopener noreferrer"
                    >
                        <span>Last ned CV</span>
                        <i className="LastNed__icon" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LastNedCv;
