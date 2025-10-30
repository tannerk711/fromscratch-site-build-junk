import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PropertyTypeStep from './PropertyTypeStep';
import JunkTypeStep from './JunkTypeStep';
import LocationStep from './LocationStep';
import DateStep from './DateStep';
import PhotoUploadStep from './PhotoUploadStep';
import PriceEstimate from './PriceEstimate';
import FormProgress from './FormProgress';

const formSchema = z.object({
  propertyType: z.string().min(1, 'Please select a property type'),
  junkTypes: z.array(z.string()).min(1, 'Please select at least one type of junk'),
  city: z.string().min(1, 'Please select your city'),
  dateNeeded: z.string().min(1, 'Please select a date'),
  asap: z.boolean().optional(),
  photos: z.array(z.object({
    url: z.string(),
    publicId: z.string(),
  })).min(1, 'Please upload at least one photo'),
  contactName: z.string().min(2, 'Name is required'),
  contactPhone: z.string().min(10, 'Phone number is required'),
  contactEmail: z.string().email('Valid email is required'),
});

const STEPS = [
  { id: 'property', title: 'Property Type', component: PropertyTypeStep },
  { id: 'junk', title: 'Junk Type', component: JunkTypeStep },
  { id: 'location', title: 'Location', component: LocationStep },
  { id: 'date', title: 'Date', component: DateStep },
  { id: 'photos', title: 'Photos', component: PhotoUploadStep },
  { id: 'contact', title: 'Contact', component: PriceEstimate },
];

export default function MultiStepForm({ client:load }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [estimate, setEstimate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      propertyType: '',
      junkTypes: [],
      city: '',
      dateNeeded: '',
      asap: false,
      photos: [],
      contactName: '',
      contactPhone: '',
      contactEmail: '',
    },
  });

  // Load saved form data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('leadFormData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        methods.reset(parsed);
      } catch (e) {
        console.error('Failed to load saved form data', e);
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const subscription = methods.watch((value) => {
      localStorage.setItem('leadFormData', JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [methods]);

  const currentStepFields = {
    0: ['propertyType'],
    1: ['junkTypes'],
    2: ['city'],
    3: ['dateNeeded'],
    4: ['photos'],
    5: ['contactName', 'contactPhone', 'contactEmail'],
  };

  const handleNext = async () => {
    const fields = currentStepFields[currentStep];
    const isValid = await methods.trigger(fields);

    if (isValid) {
      // If we're on the photo step, get AI estimate
      if (currentStep === 4) {
        await getAIEstimate();
      }
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const getAIEstimate = async () => {
    const photos = methods.getValues('photos');
    const junkTypes = methods.getValues('junkTypes');
    const propertyType = methods.getValues('propertyType');

    try {
      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photos, junkTypes, propertyType }),
      });

      if (response.ok) {
        const data = await response.json();
        setEstimate(data);
      }
    } catch (error) {
      console.error('Failed to get estimate:', error);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Save lead to database
      const leadResponse = await fetch('/api/save-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, estimate }),
      });

      if (!leadResponse.ok) throw new Error('Failed to save lead');

      // Send email notification
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, estimate }),
      });

      // Clear form data
      localStorage.removeItem('leadFormData');

      // Redirect to success page or show success message
      window.location.href = '/quote/success';
    } catch (error) {
      console.error('Failed to submit form:', error);
      alert('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = STEPS[currentStep].component;
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <FormProgress
            steps={STEPS}
            currentStep={currentStep}
            progress={progress}
          />

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-8">
              <CurrentStepComponent
                estimate={estimate}
                isSubmitting={isSubmitting}
              />

              <div className="mt-8 flex justify-between">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                  >
                    Back
                  </button>
                )}

                {currentStep < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="ml-auto inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ml-auto inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Get Your Free Quote'}
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
