import {
    useSync,
    useSyncedValue,
    useUpdateSyncedValue,
} from '@kkapoor/sync/react';
import { useEffect, useMemo, useRef } from 'react';
import usePIDController from '../hooks/usePIDController';
import { System } from '../utils/controller';
import {
    globalSimulationDataPointsState,
    globalSimulationParams,
    globalSimulationPauseState,
} from '../utils/state';

export default function SimControls() {
    const [paused, setPaused] = useSync(globalSimulationPauseState);
    const params = useSyncedValue(globalSimulationParams);
    const setDataPoints = useUpdateSyncedValue(globalSimulationDataPointsState);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const frameCounterRef = useRef(0);

    const controller = usePIDController(params);
    const system = useMemo(() => new System(params.dt), [params.dt]);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            if (paused) return;

            const output = controller.compute(system.airGap);
            const forceOutput = Math.min(Math.max(output, 0), 6000);

            system.update(forceOutput);

            setDataPoints((prev) => ({
                time: [...prev.time, frameCounterRef.current * params.dt],
                force: [...prev.force, forceOutput],
                airGap: [...prev.airGap, system.airGap],
            }));

            frameCounterRef.current += 1;
        }, params.dt * 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [params, setDataPoints, paused, controller, system]);

    return (
        <div className="flex gap-2">
            <button
                className="bg-success"
                onClick={() => setPaused(false)}
                disabled={!paused}
            >
                Start
            </button>
            <button
                className="bg-primary"
                onClick={() => setPaused(true)}
                disabled={paused}
            >
                Pause
            </button>
            <button
                className="bg-error"
                onClick={() => {
                    setPaused(true);
                    setDataPoints({
                        time: [],
                        force: [],
                        airGap: [],
                    });
                    controller.reset();
                    system.reset();
                    frameCounterRef.current = 0;
                }}
            >
                Reset
            </button>
        </div>
    );
}
