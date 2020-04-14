import React, { FunctionComponent } from 'react';
import { FixedSizeList } from 'react-window';
import { Props as KandidatlisteProps } from './Kandidatliste';
import KandidatRad from './kandidatrad/KandidatRad';
import { KandidatIKandidatliste } from '../kandidatlistetyper';

type Props = KandidatlisteProps & {
    kandidater: KandidatIKandidatliste[];
    visArkiverte: boolean;
};

const Kandidater: FunctionComponent<Props> = ({ kandidater, visArkiverte, ...props }) => {
    if (kandidater.length <= 100) {
        return (
            <>
                {kandidater.map((kandidat) => (
                    <KandidatRad
                        key={kandidat.kandidatnr}
                        kandidat={kandidat}
                        visArkiveringskolonne={!!props.arkiveringErEnabled && !visArkiverte}
                        {...props}
                    />
                ))}
            </>
        );
    }

    return (
        <FixedSizeList height={808} itemCount={kandidater.length} itemSize={80} width={1184}>
            {({ index, style }) => (
                <div style={style}>
                    <KandidatRad
                        key={kandidater[index].kandidatnr}
                        kandidat={kandidater[index]}
                        visArkiveringskolonne={!!props.arkiveringErEnabled && !visArkiverte}
                        {...props}
                    />
                </div>
            )}
        </FixedSizeList>
    );
};

export default Kandidater;
