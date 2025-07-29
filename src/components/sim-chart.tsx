import { useSyncedValue } from '@kkapoor/sync/react';
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line } from 'react-chartjs-2';
import { globalSimulationDataPointsState } from '../utils/state';

ChartJS.register(
    CategoryScale,
    PointElement,
    LinearScale,
    LineElement,
    Title,
    Legend,
    Tooltip,
    zoomPlugin
);

export default function SimChart() {
    const { force, time, airGap } = useSyncedValue(
        globalSimulationDataPointsState
    );

    return (
        <div style={{ width: '1000px', height: '600px' }}>
            <Line
                options={{
                    animation: false,
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top' as const,
                            labels: {
                                color: 'var(--color-text-primary)',
                                font: {
                                    size: 12,
                                },
                            },
                        },
                        title: {
                            display: true,
                            text: 'PID Controller Simulation',
                            color: 'var(--color-text-primary)',
                            font: {
                                size: 16,
                                weight: 'bold',
                            },
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
                            limits: {
                                x: {
                                    min: 0,
                                    max: 300,
                                },
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
                                color: '#111827', // text-primary
                                font: {
                                    size: 14,
                                    weight: 'bold',
                                },
                            },
                            min: Math.max(
                                0,
                                (time.length > 0 ? time[time.length - 1] : 0) -
                                    5
                            ),
                            max: time.length > 0 ? time[time.length - 1] : 5,
                            ticks: {
                                stepSize: 1,
                                color: '#4b5563', // text-secondary
                            },
                            grid: {
                                color: '#e5e7eb', // gray-200
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
                                color: '#111827', // text-primary
                                font: {
                                    size: 14,
                                    weight: 'bold',
                                },
                            },
                            ticks: {
                                color: '#4b5563', // text-secondary
                            },
                            grid: {
                                color: '#e5e7eb', // gray-200
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
                                color: '#111827', // text-primary
                                font: {
                                    size: 14,
                                    weight: 'bold',
                                },
                            },
                            ticks: {
                                color: '#4b5563', // text-secondary
                            },
                            grid: {
                                drawOnChartArea: false,
                                color: '#e5e7eb', // gray-200
                            },
                        },
                    },
                }}
                data={{
                    labels: time.map((t) => t.toFixed(3)),
                    datasets: [
                        {
                            label: 'Force [N]',
                            data: time.map((t, i) => ({
                                x: t,
                                y: force[i],
                            })),
                            borderColor: '#dc2626', // Good red
                            backgroundColor: 'rgba(220, 38, 38, 0.1)',
                            pointRadius: 0,
                            yAxisID: 'y1',
                        },
                        {
                            label: 'Air Gap [mm]',
                            data: time.map((t, i) => ({
                                x: t,
                                y: airGap[i] * 1000,
                            })),
                            borderColor: '#2563eb', // Good blue
                            backgroundColor: 'rgba(37, 99, 235, 0.1)',
                            pointRadius: 0,
                            yAxisID: 'y',
                        },
                    ],
                }}
            />
        </div>
    );
}
