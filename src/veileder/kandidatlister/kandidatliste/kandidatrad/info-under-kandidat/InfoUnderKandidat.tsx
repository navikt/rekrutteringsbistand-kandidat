import React, { FunctionComponent } from 'react';
import './InfoUnderKandidat.less';

type Props = {
    className?: string;
};

const InfoUnderKandidat: FunctionComponent<Props> = ({ className, children }) => {
    return (
        <div className="info-under-kandidat">
            <div className={`info-under-kandidat__content${className ? ' ' + className : ''}`}>
                {children}
            </div>
        </div>
    );
};

export default InfoUnderKandidat;
