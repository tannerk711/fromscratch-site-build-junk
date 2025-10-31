import { useEffect, useState } from 'react';

export default function QuoteResults() {
  const [quoteData, setQuoteData] = useState(null);

  useEffect(() => {
    // Read estimate from sessionStorage
    const storedData = sessionStorage.getItem('quoteEstimate');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setQuoteData(parsed);
      } catch (error) {
        console.error('Error parsing quote data:', error);
      }
    }
  }, []);

  if (!quoteData) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
        <p className="mt-4 text-sm font-medium text-slate-900">Loading your estimate...</p>
      </div>
    );
  }

  const { estimate, formData } = quoteData;

  return (
    <div className="space-y-6">
      {/* AI Estimate Card */}
      {estimate && estimate.priceRange ? (
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white shadow-xl">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100">Your AI-Powered Estimate</p>
              <p className="mt-2 text-5xl font-bold tracking-tight">
                ${estimate.priceRange.min.toLocaleString()} - ${estimate.priceRange.max.toLocaleString()}
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
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-slate-700">
            We're processing your photos and will send you a detailed quote shortly.
          </p>
        </div>
      )}

      {/* Detected Items */}
      {estimate?.items && estimate.items.length > 0 && (
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

      {/* Your Information */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="font-display text-lg font-semibold text-slate-900">
          Your Information
        </h3>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Name:</span>
            <span className="font-medium text-slate-900">{formData.contactName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Phone:</span>
            <span className="font-medium text-slate-900">{formData.contactPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Email:</span>
            <span className="font-medium text-slate-900">{formData.contactEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Property Type:</span>
            <span className="font-medium text-slate-900">{formData.propertyType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Location:</span>
            <span className="font-medium text-slate-900">{formData.city}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Date Needed:</span>
            <span className="font-medium text-slate-900">{formData.dateNeeded}</span>
          </div>
          {formData.notes && (
            <div className="pt-3 border-t border-slate-200">
              <span className="text-slate-600">Additional Notes:</span>
              <p className="mt-1 font-medium text-slate-900">{formData.notes}</p>
            </div>
          )}
        </div>
      </div>

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
  );
}
