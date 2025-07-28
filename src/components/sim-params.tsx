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
            setpoint: Number(setpoint),
            dt: Number(dt),
            invert,
        });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        <code>
                            k<sub>p</sub>
                        </code>
                        :
                        <input
                            type="number"
                            name="pid-p"
                            step="any"
                            defaultValue={0}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        <code>
                            k<sub>i</sub>
                        </code>
                        :
                        <input
                            type="number"
                            name="pid-i"
                            step="any"
                            defaultValue={0}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        <code>
                            k<sub>d</sub>
                        </code>
                        :
                        <input
                            type="number"
                            name="pid-d"
                            step="any"
                            defaultValue={0}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Setpoint:
                        <input
                            type="number"
                            name="setpoint"
                            step="any"
                            defaultValue={0}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" name="invert" /> Invert
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="number"
                            name="dt"
                            step="any"
                            defaultValue={0.01}
                        />
                        dt
                    </label>
                </div>
                <div>
                    <button type="submit">Set</button>
                    <button type="reset">Reset</button>
                </div>
            </form>
        </div>
    );
}
