import { generateWeeklyInsights } from '../utils/analytics';

const AIWeeklyInsights = ({ shifts }) => {
  // Convert raw shift data into short readable insight strings.
  const insights = generateWeeklyInsights(shifts);

  return (
    <section className="h-full rounded-2xl border border-indigo-200 bg-white p-6 shadow-xl hover:shadow-blue-500 shadow-blue-500/70 text-shadow-sm flex flex-col">
      {/* Header copy explains what this card is and where the text comes from. */}
      <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-4 text-left">
        <p className="text-xs font-semibold font-mono uppercase tracking-[0.25em] text-indigo-500">
          AI Weekly Insights
        </p>
        <h2 className="text-2xl font-bold text-slate-800">
          Smart readout from your shift history
        </h2>
        <p className="text-xs font-sans italic text-slate-500 mt-1">
          These insights are generated from your logged shifts to highlight trends you can act on.
        </p>
      </div>

      {/* Each item is just a sentence, so we map over the insight array and render one card per line. */}
      <div className="mt-5 grid grid-cols-1 gap-3 font-serif">
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
