import { useFormContext } from 'react-hook-form';

export default function PriceEstimate({ estimate, isSubmitting }) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-slate-900">
        Almost Done! Enter Your Contact Info
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        We'll analyze your photos and send you a detailed quote right away.
      </p>

      {/* Contact Information Form */}
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="font-display text-lg font-semibold text-slate-900">
          Contact Information
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          We'll send your quote and schedule your pickup
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-slate-900">
              Full Name *
            </label>
            <input
              type="text"
              id="contactName"
              {...register('contactName')}
              placeholder="John Doe"
              className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {errors.contactName && (
              <p className="mt-1 text-sm text-red-600">{errors.contactName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-slate-900">
              Phone Number *
            </label>
            <input
              type="tel"
              id="contactPhone"
              {...register('contactPhone')}
              placeholder="(208) 555-1234"
              className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {errors.contactPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.contactPhone.message}</p>
            )}
            <p className="mt-1 text-xs text-slate-500">We can also text this number</p>
          </div>

          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-900">
              Email Address *
            </label>
            <input
              type="email"
              id="contactEmail"
              {...register('contactEmail')}
              placeholder="john@example.com"
              className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {errors.contactEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-slate-900">
              Additional Notes (optional)
            </label>
            <textarea
              id="notes"
              {...register('notes')}
              rows={3}
              placeholder="Any special instructions or details..."
              className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Honeypot field - hidden from humans, visible to bots */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website (leave blank)</label>
            <input
              type="text"
              id="website"
              {...register('website')}
              tabIndex="-1"
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
