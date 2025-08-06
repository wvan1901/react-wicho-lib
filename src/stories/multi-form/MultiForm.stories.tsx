import type { Meta, StoryObj } from '@storybook/react-vite';
import { Controller, useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';

import { Button, TextField, Paper, Box, Stack } from '@mui/material';

import { MultiForm, type FormStep, type StepItem } from './MultiForm';
import { Fragment } from 'react';

const MultiFormTemplate = () => {
	const { formState: { errors }, control, trigger, handleSubmit } = useForm({
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			street: '',
			city: '',
			zip: 0,
			friends: [{ name: "", phone: 0 }]
		} as formData
	});

	const steps: StepItem<formData>[] = [
		{ Label: "Personal", FormFields: ['firstName', 'lastName', 'email'], Form: <PersonalForm control={control} errors={errors} /> },
		{ Label: "Address", FormFields: ['street', 'city', 'zip'], Form: <AddressForm control={control} errors={errors} /> },
		{ Label: "Friends", FormFields: ['friends'], Form: <FriendsForm control={control} errors={errors} /> },
	];

	const processForm: SubmitHandler<formData> = data => {
		console.log("Processing Form", data)
	}

	return (
		<Paper sx={{ height: "300px", width: "700px", padding: "20px" }} elevation={5}>
			<MultiForm
				steps={steps}
				trigger={trigger}
				handleSubmit={handleSubmit}
				processForm={processForm}
			/>
		</Paper>
	)
}

interface friendData {
	name: string
	phone: number
}

interface formData {
	firstName: string
	lastName: string
	email: string
	street: string
	city: string
	zip: number
	friends: friendData[]
}

const PersonalForm = ({
	control,
	errors,
}: FormStep<formData>) => {
	if (!!errors.firstName || !!errors.lastName || !!errors.email) {
		console.log("PersonalForm: Some error", errors)
	}
	return (
		<form>
			<p>Personal</p>
			<Controller
				name='firstName'
				control={control}
				rules={{ required: "Required" }}
				render={({ field }) =>
					<TextField
						autoComplete='off'
						label='First Name'
						size='small'
						error={!!errors.firstName}
						helperText={errors?.firstName?.message}
						{...field}
					/>
				}
			/>
			<Controller
				name='lastName'
				control={control}
				rules={{ required: "Required" }}
				render={({ field }) =>
					<TextField
						autoComplete='off'
						label='Last Name'
						size='small'
						error={!!errors.lastName}
						helperText={errors?.lastName?.message}
						{...field}
					/>
				}
			/>
			<Controller
				name='email'
				control={control}
				rules={{ required: "Required" }}
				render={({ field }) =>
					<TextField
						autoComplete='off'
						label='email'
						size='small'
						error={!!errors.email}
						helperText={errors?.email?.message}
						{...field}
					/>
				}
			/>
		</form>
	)
}

const AddressForm = ({
	control,
	errors,
}: FormStep<formData>) => {
	if (!!errors.street || !!errors.city || !!errors.zip) {
		console.log("AddressForm: Some error", errors)
	}
	return (
		<form key='address-form'>
			<p key='address-title'>Address</p>
			<Controller
				key='street-controller'
				name='street'
				control={control}
				rules={{ required: "Required" }}
				render={({ field }) =>
					<TextField
						key='street-input'
						autoComplete='off'
						label='Address Line'
						size='small'
						error={!!errors.street}
						helperText={errors?.street?.message}
						{...field}
					/>
				}
			/>
			<Controller
				key='city-controller'
				name='city'
				control={control}
				rules={{ required: "Required" }}
				render={({ field }) =>
					<TextField
						key='city-input'
						autoComplete='off'
						label='city'
						size='small'
						error={!!errors.city}
						helperText={errors?.city?.message}
						{...field}
					/>
				}
			/>
			<Controller
				key='zip-controller'
				name='zip'
				control={control}
				rules={{ required: "Required" }}
				render={({ field }) =>
					<TextField
						key='zip-input'
						autoComplete='off'
						label='Zip'
						size='small'
						type='number'
						error={!!errors.zip}
						helperText={errors?.zip?.message}
						{...field}
					/>
				}
			/>
		</form>
	)
}

const FriendsForm = ({
	control,
	errors,
}: FormStep<formData>) => {
	const { fields, append, remove } = useFieldArray({
		rules: { required: 'Required', minLength: 2 },
		control,
		name: "friends",
	});

	if (!!errors.friends) {
		console.log("FriendsForm: Some error", errors)
	}

	return (
		<Stack sx={{ overflow: 'auto' }}>
			<p>Friends</p>
			{fields.map((fieldArray, index) => (
				<Fragment key={fieldArray.id + "-fragment"}>
					<Box sx={{ display: 'flex', p: '5px 0' }}>
						<Controller
							key={fieldArray.id + '-controller-name'}
							name={`friends.${index}.name`}
							control={control}
							rules={{ required: "Required" }}
							render={({ field }) =>
								<TextField
									key={fieldArray.id + '-input-name'}
									autoComplete='off'
									label='Name'
									size='small'
									error={!!errors.friends?.[index]?.name}
									helperText={errors?.friends?.[index]?.name?.message}
									{...field}
								/>
							}
						/>
						<Controller
							key={fieldArray.id + '-controller-phone'}
							name={`friends.${index}.phone`}
							control={control}
							rules={{ required: "Required" }}
							render={({ field }) =>
								<TextField
									key={fieldArray.id + '-input-phone'}
									autoComplete='off'
									label='Phone Number'
									size='small'
									type='number'
									error={!!errors.friends?.[index]?.phone}
									helperText={errors?.friends?.[index]?.phone?.message}
									{...field}
								/>
							}
						/>
						<Button key={fieldArray.id + '-delete'} size='small' onClick={() => remove(index)}>
							Delete
						</Button>
					</Box>
				</Fragment>
			))}
			{(!!errors.friends?.root && fields.length === 0) && (<p>{errors.friends?.root?.message || 'Error'}</p>)}
			{errors.friends?.root?.type === 'minLength' && (<p>Error: Need at least 2 friends!</p>)}
			<Button onClick={() => append({ name: '', phone: 0 })}>
				Add Friend
			</Button>

		</Stack>
	)
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: 'Components/MultiForm',
	component: MultiFormTemplate,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered',
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {},
} satisfies Meta<typeof MultiForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
	args: {},
};

