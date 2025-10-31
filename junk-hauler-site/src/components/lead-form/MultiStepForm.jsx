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
import AnimatedLoadingText from './AnimatedLoadingText';

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
  // Honeypot field for spam protection - should always be empty
  website: z.string().max(0, 'Invalid submission').optional(),
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
    mode: 'onTouched',
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
      website: '', // Honeypot field - must stay empty
    },
  });

  // Load saved form data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('leadFormData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Don't restore contact fields to prevent validation errors
        const { contactName, contactPhone, contactEmail, notes, ...safeData } = parsed;
        methods.reset({
          ...safeData,
          contactName: '',
          contactPhone: '',
          contactEmail: '',
          notes: '',
        }, {
          keepErrors: false,  // Don't keep validation errors
        });
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
      // Clear all errors before navigating to next step
      methods.clearErrors();
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
        return data;
      }
      throw new Error('Failed to get estimate');
    } catch (error) {
      console.error('Failed to get estimate:', error);
      throw error;
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Get AI estimate first
      const estimateData = await getAIEstimate();

      // Save lead to database
      const leadResponse = await fetch('/api/save-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, estimate: estimateData }),
      });

      if (!leadResponse.ok) throw new Error('Failed to save lead');

      // Send email notification
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, estimate: estimateData }),
      });

      // Clear form data
      localStorage.removeItem('leadFormData');

      // Store estimate in sessionStorage for success page
      sessionStorage.setItem('quoteEstimate', JSON.stringify({
        estimate: estimateData,
        formData: data
      }));

      // Redirect to success page with estimate
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
                    className="ml-auto inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <AnimatedLoadingText />
                      </>
                    ) : (
                      'Get Your Free Quote'
                    )}
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
