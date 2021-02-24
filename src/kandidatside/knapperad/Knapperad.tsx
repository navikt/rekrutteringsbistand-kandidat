import React, { FunctionComponent } from 'react';
import './Knapperad.less';

import { LAST_NED_CV_URL } from '../../common/fasitProperties';
import { sendEvent } from '../../amplitude/amplitude';

interface Props {
    aktørId: string;
}

const Knapperad: FunctionComponent<Props> = ({ aktørId }) => {
    return (
        <div className="kandidat-knapperad">
            <div className="kandidat-knapperad__content">
                <div className="kandidat-knapperad__lenker">
                    <a
                        className="LastNed lenke"
                        href={`${LAST_NED_CV_URL}/${aktørId}`}
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

export default Knapperad;
