import type { InferSyncState } from '@kkapoor/sync/core';
import type { globalSimulationParams } from './state';

export class PIDController {
    private kp: number;
    private ki: number;
    private kd: number;
    private setpoint: number;
    private dt: number;
    private prev_error: number;
    private integral: number;
    private invert: boolean;

    constructor(params: InferSyncState<typeof globalSimulationParams>) {
        this.kp = params.kp;
        this.ki = params.ki;
        this.kd = params.kd;
        this.setpoint = params.setpoint;
        this.invert = params.invert;
        this.dt = params.dt;

        this.prev_error = 0;
        this.integral = 0;
    }

    compute(actual: number) {
        let error: number;

        if (this.invert) error = actual - this.setpoint;
        else error = this.setpoint - actual;

        this.integral += error * this.dt;
        const derivative = (error - this.prev_error) / this.dt;

        this.prev_error = error;

        return this.kp * error + this.ki * this.integral + this.kd * derivative;
    }
}

export class System {
    private mass: number;
    public airGap: number;
    private velocity: number;
    private dt: number;

    constructor(dt: number) {
        this.mass = 10;
        this.airGap = 0.013;
        this.velocity = 0;
        this.dt = dt;
    }

    update(force: number) {
        const acceleration = force / this.mass - 9.81;
        this.velocity += acceleration * this.dt;
        this.airGap -= this.velocity * this.dt;

        this.airGap = Math.max(Math.min(this.airGap, 0.013), 0);
    }
}
