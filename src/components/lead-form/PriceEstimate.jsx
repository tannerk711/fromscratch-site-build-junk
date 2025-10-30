import { useFormContext } from 'react-hook-form';

export default function PriceEstimate({ estimate, isSubmitting }) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-slate-900">
        Your Estimated Quote
      </h2>

      {estimate ? (
        <div className="mt-6 space-y-6">
          {/* Price Estimate Card */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white shadow-xl">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-sm font-medium text-blue-100">Estimated Total</p>
                <p className="mt-2 text-5xl font-bold tracking-tight">
                  ${estimate.priceRange.min} - ${estimate.priceRange.max}
                </p>
                <p className="mt-2 text-sm text-blue-100">
                  Based on ~{estimate.cubicYards.min}-{estimate.cubicYards.max} cubic yards
                </p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  AI Estimate
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-white/20 pt-6">
              <p className="text-sm font-medium text-blue-100 mb-3">What's included:</p>
              <ul className="space-y-2 text-sm text-white">
                <li className="flex items-center">
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Labor and equipment
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Eco-friendly disposal fees
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Donation/recycling coordination
                </li>
              </ul>
            </div>
          </div>

          {/* Confidence & Details */}
          {estimate.items && estimate.items.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="font-display text-lg font-semibold text-slate-900">
                Detected Items
              </h3>
              <div className="mt-4 space-y-2">
                {estimate.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-slate-700">{item.type}</span>
                    <span className="font-medium text-slate-900">
                      {item.quantity > 1 ? `${item.quantity}x` : ''}
                      {item.cubic_yards ? ` (~${item.cubic_yards} cu yd)` : ''}
                    </span>
                  </div>
                ))}
              </div>
              {estimate.notes && (
                <p className="mt-4 text-sm text-slate-600 border-t border-slate-200 pt-4">
                  <span className="font-medium">Note:</span> {estimate.notes}
                </p>
              )}
            </div>
          )}

          {/* Disclaimer */}
          <div className="rounded-lg bg-amber-50 p-4">
            <div className="flex">
              <svg
                className="h-5 w-5 text-amber-600 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-amber-900">
                  This is an AI-generated estimate based on your photos. Final pricing will be confirmed
                  on-site and may vary based on actual volume, access, and disposal requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
          <p className="mt-4 text-sm font-medium text-slate-900">Analyzing your photos...</p>
          <p className="mt-1 text-sm text-slate-600">Our AI is estimating the volume</p>
        </div>
      )}

      {/* Contact Information Form */}
      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
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
        </div>
      </div>
    </div>
  );
}
