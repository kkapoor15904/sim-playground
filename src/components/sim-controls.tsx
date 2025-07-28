import { useSync, useUpdateSyncedValue } from '@kkapoor/sync/react';
import {
    globalSimulationDataPointsState,
    globalSimulationPauseState,
} from '../utils/state';

export default function SimControls(props: {
    intervalRef: React.RefObject<NodeJS.Timeout | null>;
    counterRef: React.RefObject<number>;
}) {
    const [paused, setPaused] = useSync(globalSimulationPauseState);
    const setDataPoints = useUpdateSyncedValue(globalSimulationDataPointsState);

    return (
        <div>
            <button onClick={() => setPaused(false)} disabled={!paused}>
                Start
            </button>
            <button onClick={() => setPaused(true)} disabled={paused}>
                Pause
            </button>
            <button
                onClick={() => {
                    setPaused(true);
                    setDataPoints({ force: [], time: [], airGap: [] });
                    if (props.intervalRef.current)
                        clearInterval(props.intervalRef.current);
                    if (props.counterRef.current !== undefined)
                        props.counterRef.current = 0;
                }}
                disabled={paused}
            >
                Reset
            </button>
        </div>
    );
}
