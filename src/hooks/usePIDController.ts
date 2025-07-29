import type { InferSyncState } from '@kkapoor/sync/core';
import { useCallback, useEffect, useState } from 'react';
import type { globalSimulationParams } from '../utils/state';

export default function usePIDController(
    options: InferSyncState<typeof globalSimulationParams>
) {
    const [prevError, setPrevError] = useState(0);
    const [integral, setIntegral] = useState(0);

    useEffect(() => {
        console.log(prevError);
    }, [prevError]);

    const compute = useCallback(
        (measurement: number) => {
            const error =
                (options.invert
                    ? measurement - options.setpoint
                    : options.setpoint - measurement) * 1000;

            setIntegral((prev) => prev + error * options.dt);

            const output =
                options.kp * error +
                options.ki * integral +
                (options.kd * (error - prevError)) / options.dt;

            setPrevError(error);

            return output;
        },
        [options, prevError, integral]
    );

    const reset = useCallback(() => {
        setPrevError(0);
        setIntegral(0);
    }, []);

    return {
        compute,
        reset,
    };
}
