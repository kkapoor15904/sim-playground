import { derive, type ReadonlySync } from '@kkapoor/sync/core';
import { useSyncedValue } from '@kkapoor/sync/react';
import { globalSimulationDataPointsState } from '../utils/state';

function getLastValue(arr: number[], fallback: number) {
    return arr.length > 0 ? arr[arr.length - 1] : fallback;
}

const derivedForce = derive((read) =>
    getLastValue(read(globalSimulationDataPointsState).force, 0)
);
const derivedAirGap = derive(
    (read) =>
        getLastValue(read(globalSimulationDataPointsState).airGap, 0.013) * 1000
);
const derivedTime = derive((read) =>
    getLastValue(read(globalSimulationDataPointsState).time, 0)
);

export default function SimValueDisplay() {
    return (
        <table className="min-w-max border-separate border-spacing-x-4 border-spacing-y-2">
            <tbody>
                <tr>
                    <td className="pr-4 text-right font-medium">Force</td>
                    <td>
                        <DataDisplay
                            label=""
                            derivedValueSync={derivedForce}
                            unit="N"
                        />
                    </td>
                </tr>
                <tr>
                    <td className="pr-4 text-right font-medium">Air Gap</td>
                    <td>
                        <DataDisplay
                            label=""
                            derivedValueSync={derivedAirGap}
                            unit="mm"
                        />
                    </td>
                </tr>
                <tr>
                    <td className="pr-4 text-right font-medium">Time</td>
                    <td>
                        <DataDisplay
                            label=""
                            derivedValueSync={derivedTime}
                            unit="s"
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

function DataDisplay(props: {
    label: string;
    derivedValueSync: ReadonlySync<number>;
    unit: string;
}) {
    const value = useSyncedValue(props.derivedValueSync);

    return (
        <div className="flex flex-row gap-2 items-center">
            <span className="font-medium">{props.label}</span>
            <code className="font-medium">{value.toFixed(2)}</code>
            <span className="font-medium">{props.unit}</span>
        </div>
    );
}
