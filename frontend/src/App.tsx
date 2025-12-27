import { LeftPanel } from '@/components/LeftPanel';
import { RightPanel } from '@/components/RightPanel';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">Item Manager</h1>
        <p className="text-gray-600">1 000 000 элементов с выбором и сортировкой</p>
      </div>
      <div className="max-w-6xl w-full mx-auto">
        <div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          style={{ height: 'calc(100vh - 120px)' }}
        >
          <LeftPanel />
          <RightPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
