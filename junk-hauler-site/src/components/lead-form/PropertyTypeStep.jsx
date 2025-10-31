import { useFormContext } from 'react-hook-form';

const PROPERTY_TYPES = [
  {
    id: 'residential',
    title: 'Residential',
    description: 'Home, apartment, or condo',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    id: 'commercial',
    title: 'Commercial',
    description: 'Office, retail, or business',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
  {
    id: 'storage',
    title: 'Storage Unit',
    description: 'Storage facility cleanout',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
      </svg>
    ),
  },
  {
    id: 'construction',
    title: 'Construction',
    description: 'Construction site or renovation',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
      </svg>
    ),
  },
  {
    id: 'estate',
    title: 'Estate',
    description: 'Estate or whole house cleanout',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
      </svg>
    ),
  },
  {
    id: 'yard',
    title: 'Yard/Outdoor',
    description: 'Yard debris or outdoor items',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      </svg>
    ),
  },
];

export default function PropertyTypeStep() {
  const { register, formState: { errors }, watch } = useFormContext();
  const selectedProperty = watch('propertyType');

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-slate-900">
        What type of property?
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        Select the type of property where the junk is located.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PROPERTY_TYPES.map((type) => (
          <label
            key={type.id}
            className={`relative flex cursor-pointer rounded-lg border p-4 transition-all ${
              selectedProperty === type.id
                ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600'
                : 'border-slate-300 hover:border-slate-400'
            }`}
          >
            <input
              type="radio"
              value={type.id}
              {...register('propertyType')}
              className="sr-only"
            />
            <div className="flex items-start">
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${
                  selectedProperty === type.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {type.icon}
              </div>
              <div className="ml-4">
                <h3 className="font-display text-base font-semibold text-slate-900">
                  {type.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600">{type.description}</p>
              </div>
            </div>
          </label>
        ))}
      </div>

      {errors.propertyType && (
        <p className="mt-2 text-sm text-red-600">{errors.propertyType.message}</p>
      )}
    </div>
  );
}
