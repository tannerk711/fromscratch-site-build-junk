import { useFormContext } from 'react-hook-form';
import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, addDays } from 'date-fns';
import 'react-day-picker/style.css';

export default function DateStep() {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const [showCalendar, setShowCalendar] = useState(false);
  const isAsap = watch('asap');
  const selectedDate = watch('dateNeeded');

  const handleDateSelect = (date) => {
    if (date) {
      setValue('dateNeeded', format(date, 'yyyy-MM-dd'), { shouldValidate: true });
      setValue('asap', false);
      setShowCalendar(false);
    }
  };

  const handleAsapChange = (e) => {
    if (e.target.checked) {
      setValue('dateNeeded', 'ASAP', { shouldValidate: true });
      setValue('asap', true);
    }
  };

  const tomorrow = addDays(new Date(), 1);

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-slate-900">
        When do you need the junk removed?
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        We offer same-day and next-day service based on availability.
      </p>

      <div className="mt-6 space-y-4">
        <label className="flex items-start rounded-lg border border-slate-300 p-4 cursor-pointer hover:border-slate-400 transition-all">
          <input
            type="checkbox"
            {...register('asap')}
            onChange={handleAsapChange}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
          />
          <span className="ml-3 flex-1">
            <span className="block text-base font-semibold text-slate-900">
              As Soon As Possible (ASAP)
            </span>
            <span className="block mt-1 text-sm text-slate-600">
              We'll schedule you for the next available slot
            </span>
          </span>
        </label>

        {!isAsap && (
          <div>
            <button
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-3 text-left text-base text-slate-900 hover:border-slate-400 transition-all"
            >
              <span>
                {selectedDate && selectedDate !== 'ASAP'
                  ? format(new Date(selectedDate), 'MMMM d, yyyy')
                  : 'Select a specific date...'}
              </span>
              <svg
                className="h-5 w-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                />
              </svg>
            </button>

            {showCalendar && (
              <div className="mt-4 flex justify-center rounded-lg border border-slate-200 bg-white p-4">
                <DayPicker
                  mode="single"
                  selected={selectedDate && selectedDate !== 'ASAP' ? new Date(selectedDate) : undefined}
                  onSelect={handleDateSelect}
                  disabled={{ before: tomorrow }}
                  className="rdp-custom"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {errors.dateNeeded && (
        <p className="mt-2 text-sm text-red-600">{errors.dateNeeded.message}</p>
      )}

      <div className="mt-6 rounded-lg bg-blue-50 p-4">
        <div className="flex">
          <svg
            className="h-5 w-5 text-blue-600 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
          <div className="ml-3">
            <p className="text-sm text-blue-900">
              Your selected date is a preferred date. We'll confirm the exact time when we contact you
              with your quote.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
