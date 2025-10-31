import { useFormContext } from 'react-hook-form';

const JUNK_TYPES = [
  { id: 'furniture', label: 'Furniture (sofas, chairs, tables)' },
  { id: 'appliances', label: 'Appliances (fridges, washers, stoves)' },
  { id: 'mattresses', label: 'Mattresses & Box Springs' },
  { id: 'electronics', label: 'Electronics & E-Waste' },
  { id: 'exercise', label: 'Exercise Equipment' },
  { id: 'hot-tubs', label: 'Hot Tubs & Spas' },
  { id: 'construction', label: 'Construction Debris' },
  { id: 'yard-waste', label: 'Yard Waste & Branches' },
  { id: 'office', label: 'Office Furniture & Equipment' },
  { id: 'retail', label: 'Retail Fixtures' },
  { id: 'general', label: 'General Household Items' },
  { id: 'other', label: 'Other (specify in notes)' },
];

export default function JunkTypeStep() {
  const { register, formState: { errors }, watch } = useFormContext();
  const selectedTypes = watch('junkTypes') || [];

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-slate-900">
        What type of junk needs removal?
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        Select all that apply. This helps us prepare the right equipment.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {JUNK_TYPES.map((type) => {
          const isSelected = selectedTypes.includes(type.id);

          return (
            <label
              key={type.id}
              className={`relative flex cursor-pointer rounded-lg border p-4 transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            >
              <input
                type="checkbox"
                value={type.id}
                {...register('junkTypes')}
                className="sr-only"
              />
              <div className="flex items-center">
                <div
                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded ${
                    isSelected
                      ? 'bg-blue-600'
                      : 'border-2 border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && (
                    <svg
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="ml-3 text-sm font-medium text-slate-900">
                  {type.label}
                </span>
              </div>
            </label>
          );
        })}
      </div>

      {errors.junkTypes && (
        <p className="mt-2 text-sm text-red-600">{errors.junkTypes.message}</p>
      )}
    </div>
  );
}
