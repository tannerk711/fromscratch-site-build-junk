import { useFormContext } from 'react-hook-form';

const CITIES = [
  'Boise',
  'Meridian',
  'Nampa',
  'Eagle',
  'Caldwell',
  'Kuna',
  'Star',
  'Garden City',
  'Middleton',
  'Emmett',
  'Other (Ada/Canyon County)',
];

export default function LocationStep() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-slate-900">
        Where is the junk located?
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        We serve the entire Treasure Valley and surrounding areas.
      </p>

      <div className="mt-6">
        <label htmlFor="city" className="block text-sm font-medium text-slate-900">
          City
        </label>
        <select
          id="city"
          {...register('city')}
          className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">Select your city...</option>
          {CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        {errors.city && (
          <p className="mt-2 text-sm text-red-600">{errors.city.message}</p>
        )}
      </div>

      <div className="mt-6">
        <label htmlFor="address" className="block text-sm font-medium text-slate-900">
          Street Address (optional)
        </label>
        <input
          type="text"
          id="address"
          {...register('address')}
          placeholder="123 Main St"
          className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <p className="mt-2 text-xs text-slate-500">
          Full address helps us provide a more accurate estimate
        </p>
      </div>

      <div className="mt-6">
        <label className="flex items-start">
          <input
            type="checkbox"
            {...register('accessDifficult')}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
          />
          <span className="ml-3 text-sm text-slate-700">
            <span className="font-medium">Difficult access</span>
            <br />
            <span className="text-slate-500">
              Check if there are stairs, narrow hallways, or other access challenges
            </span>
          </span>
        </label>
      </div>
    </div>
  );
}
