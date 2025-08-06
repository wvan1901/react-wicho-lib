import React, { type ReactElement } from 'react';
import { Button, Divider, Stack, Step, StepButton, Stepper } from '@mui/material';
import { type Control, type FieldErrors, type SubmitHandler, type FieldValues, type UseFormTrigger, type UseFormHandleSubmit, type FieldPath } from 'react-hook-form';

export interface MultiFormProps<T extends FieldValues> {
	steps: StepItem<T>[]
	trigger: UseFormTrigger<T>
	handleSubmit: UseFormHandleSubmit<T>
	processForm: SubmitHandler<T>
}

export const MultiForm = <T extends FieldValues>({
	steps,
	trigger,
	handleSubmit,
	processForm,
}: MultiFormProps<T>) => {
	const [activeStep, setActiveStep] = React.useState(0);

	const handleNext = async () => {
		const curStepFields: FieldPath<T>[] = steps[activeStep].FormFields as FieldPath<T>[]
		const output = await trigger(
			curStepFields, { shouldFocus: true })
		if (!output) {
			return
		}
		if (activeStep === steps.length - 1) {
			await handleSubmit(processForm)()
			return
		}
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleStep = (step: number) => async () => {
		if (step < activeStep) {
			setActiveStep(step);
		}
		const curStepFields: FieldPath<T>[] = steps[activeStep].FormFields as FieldPath<T>[]
		const output = await trigger(curStepFields, { shouldFocus: true })
		if (!output) {
			return
		}
		setActiveStep(step);
	};

	return (
		<Stack sx={{ display: "flex", height: "100%" }}>
			<Stepper nonLinear activeStep={activeStep}>
				{steps.map((step, index) => (
					<Step key={step.Label}>
						<StepButton onClick={handleStep(index)}>
							{step.Label}
						</StepButton>
					</Step>
				))}
			</Stepper>
			<Divider sx={{ padding: "10px" }} />
			<Stack sx={{ display: "flex", height: "100%", justifyContent: "space-between", overflow: 'auto' }}>
				{steps[activeStep].Form}
				<Stack direction="row" sx={{ justifyContent: "flex-end" }}>
					<Button disabled={activeStep == 0} onClick={handleBack}>
						Back
					</Button>
					<Button onClick={handleNext}>
						{activeStep === steps.length - 1 ? 'Finish' : 'Next'}
					</Button>
				</Stack>
			</Stack>
		</Stack>
	);
};

export interface StepItem<T extends FieldValues> {
	Label: string;
	Form: ReactElement<FormStep<T>>;
	FormFields: string[];
}

export interface FormStep<T extends FieldValues> {
	control: Control<T>
	errors: FieldErrors<T>
}

