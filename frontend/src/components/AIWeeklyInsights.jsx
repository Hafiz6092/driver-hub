import { generateWeeklyInsights } from '../utils/analytics';

const AIWeeklyInsights = ({ shifts }) => {
  const insights = generateWeeklyInsights(shifts);

  return (
    <section className="mb-8 rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500">
            AI Weekly Insights
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-800">
            Smart readout from your shift history
          </h2>
        </div>
        <p className="max-w-xl text-sm text-slate-500">
          These insights are generated from your logged shifts to highlight trends you can act on.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
          >
            {insight}
          </div>
        ))}
      </div>
    </section>
  );
};

export default AIWeeklyInsights;
