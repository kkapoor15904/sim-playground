import { useUpdateSyncedValue } from '@kkapoor/sync/react';
import type { FormEventHandler } from 'react';
import { globalSimulationParams } from '../utils/state';

export default function SimParams() {
    const setParams = useUpdateSyncedValue(globalSimulationParams);

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const kp = formData.get('pid-p');
        const ki = formData.get('pid-i');
        const kd = formData.get('pid-d');
        const setpoint = formData.get('setpoint');
        const dt = formData.get('dt');
        const invert = formData.get('invert') === 'on';

        setParams({
            kp: Number(kp),
            ki: Number(ki),
            kd: Number(kd),
            setpoint: Number(setpoint) / 1000,
            dt: Number(dt),
            invert,
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <form onSubmit={handleSubmit}>
                <table className="min-w-full border-separate border-spacing-y-2">
                    <tbody>
                        <tr>
                            <td className="pr-2 text-right align-middle">
                                <label htmlFor="pid-p">
                                    <code>
                                        k<sub>p</sub>
                                    </code>
                                </label>
                            </td>
                            <td>
                                <input
                                    id="pid-p"
                                    type="number"
                                    name="pid-p"
                                    step="any"
                                    defaultValue={0}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="pr-2 text-right align-middle">
                                <label htmlFor="pid-i">
                                    <code>
                                        k<sub>i</sub>
                                    </code>
                                </label>
                            </td>
                            <td>
                                <input
                                    id="pid-i"
                                    type="number"
                                    name="pid-i"
                                    step="any"
                                    defaultValue={0}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="pr-2 text-right align-middle">
                                <label htmlFor="pid-d">
                                    <code>
                                        k<sub>d</sub>
                                    </code>
                                </label>
                            </td>
                            <td>
                                <input
                                    id="pid-d"
                                    type="number"
                                    name="pid-d"
                                    step="any"
                                    defaultValue={0}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="pr-2 text-right align-middle">
                                <label htmlFor="setpoint">Setpoint [mm]</label>
                            </td>
                            <td>
                                <input
                                    id="setpoint"
                                    type="number"
                                    name="setpoint"
                                    step="any"
                                    defaultValue={6}
                                    min={0}
                                    max={13}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="pr-2 text-right align-middle">
                                <label htmlFor="invert">
                                    Invert controller output
                                </label>
                            </td>
                            <td>
                                <input
                                    id="invert"
                                    type="checkbox"
                                    name="invert"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="pr-2 text-right align-middle">
                                <label htmlFor="dt">dt</label>
                            </td>
                            <td>
                                <input
                                    id="dt"
                                    type="number"
                                    name="dt"
                                    step="any"
                                    defaultValue={0.01}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2} className="pt-2">
                                <div className="flex flex-row gap-2 justify-center">
                                    <button type="submit">Set</button>
                                    <button type="reset" className="bg-error">
                                        Reset
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
}
