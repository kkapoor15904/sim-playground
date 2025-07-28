import { useSync, useSyncedValue } from '@kkapoor/sync/react';
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { PIDController, System } from '../utils/controller';
import {
    globalSimulationDataPointsState,
    globalSimulationParams,
    globalSimulationPauseState,
} from '../utils/state';
import SimControls from './sim-controls';

ChartJS.register(
    CategoryScale,
    PointElement,
    LinearScale,
    LineElement,
    Title,
    Legend,
    zoomPlugin
);

export default function SimChart() {
    const params = useSyncedValue(globalSimulationParams);
    const [{ force, time, airGap }, setDataPoints] = useSync(
        globalSimulationDataPointsState
    );
    const paused = useSyncedValue(globalSimulationPauseState);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const counterRef = useRef(0);

    useEffect(() => {
        const controller = new PIDController(params);
        const system = new System(params.dt);

        intervalRef.current = setInterval(() => {
            if (paused) return;

            const output = controller.compute(system.airGap);
            const forceOutput = Math.min(Math.max(output, 0), 6000);

            system.update(forceOutput);

            setDataPoints((prev) => ({
                time: [...prev.time, counterRef.current * params.dt],
                force: [...prev.force, forceOutput],
                airGap: [...prev.airGap, system.airGap],
            }));

            console.log(forceOutput, system.airGap);

            counterRef.current += 1;
        }, params.dt * 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [params, setDataPoints, paused]);

    return (
        <div>
            <div style={{ width: '1000px', height: '600px' }}>
                <Line
                    options={{
                        animation: false,
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top' as const,
                            },
                            title: {
                                display: true,
                                text: 'PID Controller Simulation',
                            },
                            zoom: {
                                pan: {
                                    enabled: true,
                                    mode: 'x',
                                },
                                zoom: {
                                    wheel: {
                                        enabled: true,
                                    },
                                    pinch: {
                                        enabled: true,
                                    },
                                    mode: 'x',
                                },
                            },
                        },
                        interaction: { mode: 'index', intersect: false },
                        scales: {
                            x: {
                                type: 'linear',
                                display: true,
                                title: {
                                    display: true,
                                    text: 'Time [s]',
                                },
                                min: Math.max(
                                    0,
                                    (time.length > 0
                                        ? time[time.length - 1]
                                        : 0) - 5
                                ),
                                max:
                                    time.length > 0 ? time[time.length - 1] : 5,
                                ticks: {
                                    stepSize: 1,
                                },
                            },
                            y: {
                                min: 0,
                                max: 13,
                                position: 'left',
                                display: true,
                                title: {
                                    display: true,
                                    text: 'Air Gap [mm]',
                                },
                            },
                            y1: {
                                min: 0,
                                max: 6000,
                                position: 'right',
                                display: true,
                                title: {
                                    display: true,
                                    text: 'Force [N]',
                                },
                                grid: {
                                    drawOnChartArea: false,
                                },
                            },
                        },
                    }}
                    data={{
                        labels: time.map((t) => t.toFixed(3)),
                        datasets: [
                            {
                                label: 'Force',
                                data: time.map((t, i) => ({
                                    x: t,
                                    y: force[i],
                                })),
                                borderColor: 'red',
                                pointRadius: 0,
                                yAxisID: 'y1',
                            },
                            {
                                label: 'Air Gap [mm]',
                                data: time.map((t, i) => ({
                                    x: t,
                                    y: airGap[i] * 1000,
                                })),
                                borderColor: 'blue',
                                pointRadius: 0,
                                yAxisID: 'y',
                            },
                        ],
                    }}
                />
            </div>
            <SimControls intervalRef={intervalRef} counterRef={counterRef} />
        </div>
    );
}
