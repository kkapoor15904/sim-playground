import SimChart from './components/sim-chart';
import SimControls from './components/sim-controls';
import SimParams from './components/sim-params';
import SimValueDisplay from './components/sim-value-display';

function App() {
    return (
        <div className="flex flex-row items-start justify-center h-screen gap-12 p-8">
            <div className="flex flex-col gap-8">
                <SimParams />
                <SimValueDisplay />
            </div>
            <div className="flex flex-col gap-4">
                <SimChart />
                <SimControls />
            </div>
        </div>
    );
}

export default App;
