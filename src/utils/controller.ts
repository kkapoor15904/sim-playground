// export class PIDController {
//     private kp: number;
//     private ki: number;
//     private kd: number;
//     private setpoint: number;
//     private dt: number;
//     private prev_error: number;
//     private integral: number;
//     private invert: boolean;

//     constructor(params: InferSyncState<typeof globalSimulationParams>) {
//         this.kp = params.kp;
//         this.ki = params.ki;
//         this.kd = params.kd;
//         this.setpoint = params.setpoint;
//         this.invert = params.invert;
//         this.dt = params.dt;

//         this.prev_error = 0;
//         this.integral = 0;

//         console.log(
//             'New PID Controller Instance',
//             this.prev_error,
//             this.integral
//         );
//     }

//     compute(actual: number) {
//         let error: number;

//         if (this.invert) error = actual - this.setpoint;
//         else error = this.setpoint - actual;

//         this.integral += error * this.dt;
//         const derivative = (error - this.prev_error) / this.dt;

//         this.prev_error = error;

//         return this.kp * error + this.ki * this.integral + this.kd * derivative;
//     }

//     reset() {
//         this.prev_error = 0;
//         this.integral = 0;
//     }
// }

export class System {
    private mass: number;
    public airGap: number;
    private velocity: number;
    private dt: number;

    private AIR_GAP_MAX = 0.013;

    constructor(dt: number) {
        this.mass = 300;
        this.airGap = this.AIR_GAP_MAX;
        this.velocity = 0;
        this.dt = dt;

        console.log('New System Instance');
    }

    update(force: number) {
        const acceleration = force / this.mass - 9.81;
        this.velocity += acceleration * this.dt;
        this.airGap -= this.velocity * this.dt;

        this.airGap = Math.max(Math.min(this.airGap, this.AIR_GAP_MAX), 0);
    }

    reset() {
        this.airGap = this.AIR_GAP_MAX;
        this.velocity = 0;
    }
}
