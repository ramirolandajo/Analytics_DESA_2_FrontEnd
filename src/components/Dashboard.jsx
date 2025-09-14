import SummaryCards from './SummaryCards.jsx';
import SummaryChart from './SummaryChart.jsx';

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <SummaryCards />
      <SummaryChart />
    </div>
  );
}
