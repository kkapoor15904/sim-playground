import { sync } from '@kkapoor/sync/core';

export const globalSimulationParams = sync({
    key: 'simulation-params',
    initial: {
        kp: 0,
        ki: 0,
        kd: 0,
        setpoint: 0,
        dt: 0.01,
        invert: false,
    },
});

export const globalSimulationPauseState = sync({
    key: 'simulation-state',
    initial: true,
});

export const globalSimulationDataPointsState = sync({
    key: 'simulation-data-points',
    initial: {
        time: [] as number[],
        force: [] as number[],
        airGap: [] as number[],
    },
});
