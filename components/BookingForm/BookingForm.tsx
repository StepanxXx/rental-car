'use client';

import { useId, useState } from 'react';
import { PiWarningCircleBold } from 'react-icons/pi';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';

import { carBookingMutation } from '@/lib/queries';
import { createBookingRequest, BookingRequestData } from '@/lib/api';
import { useCarBookingDraftStore } from '@/lib/store/bookingStore';
import css from './BookingForm.module.css';

interface BookingFormProps {
  carId: string;
}
type FormErrors = Partial<Record<keyof BookingRequestData, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_PATTERN = /^[\p{L}][\p{L}\p{M}'’ -]*$/u;

const NAME_ERROR_MESSAGE = 'Please enter your name.';
const EMAIL_ERROR_MESSAGE = 'Please enter your email.';
const COMMENT_ERROR_MESSAGE = 'Comment is required';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, NAME_ERROR_MESSAGE)
    .matches(NAME_PATTERN, NAME_ERROR_MESSAGE)
    .required(NAME_ERROR_MESSAGE),
  email: Yup.string()
    .email()
    .matches(EMAIL_PATTERN, EMAIL_ERROR_MESSAGE)
    .min(1, EMAIL_ERROR_MESSAGE)
    .required(EMAIL_ERROR_MESSAGE),
  comment: Yup.string()
    .min(1, COMMENT_ERROR_MESSAGE)
    .required(COMMENT_ERROR_MESSAGE),
});

export default function BookingForm({ carId }: BookingFormProps) {
  const formId = useId();
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');

  const draft = useCarBookingDraftStore(state => state.draft);
  const setDraftKey = useCarBookingDraftStore(state => state.setDraftKey);
  const clearDraft = useCarBookingDraftStore(state => state.clearDraft);

  const mutation = useMutation(
    carBookingMutation(
      async (data: BookingRequestData) => {
        const response = await createBookingRequest(carId, data);
        toast.success(response.message);
      },
      () => {
        setStatus('success');
        clearDraft(carId);
      },
      () => {
        setStatus('error');
        toast.error('Something went wrong. Please try again.');
      }
    )
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    const fieldName = name as keyof BookingRequestData;

    setDraftKey(carId, fieldName, value);

    setErrors(current => {
      if (!current[fieldName]) return current;
      const next = { ...current };
      delete next[fieldName];
      return next;
    });
    setStatus('idle');
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData) as BookingRequestData;

    try {
      setErrors({});
      await validationSchema.validate(values, { abortEarly: false });
      setStatus('submitting');
      mutation.mutate({
        name: values.name.trim(),
        email: values.email.trim(),
        comment: values.comment?.trim(),
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: Record<string, string> = {};
        err.inner.forEach(error => {
          if (error.path && !validationErrors[error.path]) {
            validationErrors[error.path] = error.message;
          }
        });
        setErrors(validationErrors);
      }
    }
  };

  const renderField = (
    field: keyof BookingRequestData,
    label: string,
    required = false
  ) => {
    const id = `${formId}-${field}`;
    const errorId = `${id}-error`;
    const hasError = Boolean(errors[field]);
    const isTextarea = field === 'comment';
    const fieldLabel = `${label}${required ? '*' : ''}`;
    const sharedProps = {
      id,
      name: field,
      value: draft[carId]?.[field] ?? '',
      placeholder: fieldLabel,
      onChange: handleChange,
      required: true,
      'aria-invalid': hasError,
      'aria-describedby': hasError ? errorId : undefined,
      className: css.control,
    };

    return (
      <div className={css.field}>
        <div className={css.controlWrapper}>
          <label
            className={`${css.floatingLabel} ${isTextarea ? 'visually-hidden' : ''}`}
            aria-hidden={isTextarea ? false : true}
            htmlFor={id}
          >
            {fieldLabel}
          </label>
          {isTextarea ? (
            <textarea {...sharedProps} rows={3} />
          ) : (
            <input
              {...sharedProps}
              type={field === 'email' ? 'email' : 'text'}
              autoComplete={field === 'name' ? 'name' : 'email'}
            />
          )}
          {hasError && (
            <PiWarningCircleBold className={css.errorIcon} aria-hidden="true" />
          )}
        </div>
        {hasError && (
          <p className={css.errorMessage} id={errorId}>
            {errors[field]}
          </p>
        )}
      </div>
    );
  };

  return (
    <form className={css.form} onSubmit={handleSubmit} noValidate>
      <div className={css.heading}>
        <h2 className={css.title}>Book your car now</h2>
        <p className={css.description}>
          Stay connected! We are always ready to help you.
        </p>
      </div>

      <div className={css.fields}>
        {renderField('name', 'Name', true)}
        {renderField('email', 'Email', true)}
        {renderField('comment', 'Comment')}
      </div>

      <button
        className={css.submitButton}
        type="submit"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Sending…' : 'Send'}
      </button>
    </form>
  );
}
