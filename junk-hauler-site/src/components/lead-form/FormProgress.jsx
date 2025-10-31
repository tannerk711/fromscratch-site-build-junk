export default function FormProgress({ steps, currentStep, progress }) {
  return (
    <div>
      <div className="relative">
        <div className="overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-6 flex justify-between">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col items-center"
              style={{ width: `${100 / steps.length}%` }}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                  index <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {index + 1}
              </div>
              <p
                className={`mt-2 text-xs font-medium ${
                  index === currentStep ? 'text-slate-900' : 'text-slate-500'
                }`}
              >
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
