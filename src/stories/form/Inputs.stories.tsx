import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Divider, Paper, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { ControlledComboBoxField, ControlledDateField, ControlledExternalComboBoxField, ControlledTextField } from './Inputs';


const schema = yup.object({
	textField: yup.string().min(5).required(),
	combobox: yup.string().required(),
	date: yup.string().required().test(
		'is-valid-date',
		'Invalid Date',
		(value) => {
			if (!value) {
				return false; // Allow empty string if not required
			}
			const date: Date = new Date(value)
			return !isNaN(date.getTime())
		}
	),
	externalCombobox: yup.string().required(),
}).required()

const InputsTemplate = () => {

	const { control, handleSubmit } = useForm({
		defaultValues: {
			textField: '',
			combobox: '',
			date: '',
			externalCombobox: '',
		},
		resolver: yupResolver(schema),
	})
	const onSubmit = (data: any) => console.log('onSubmit', data);

	interface respObj {
		id: string
		label: string
	}

	const mockApi = (value: string | null): Promise<respObj[]> => {
		return new Promise((resolve, reject) => {
			if (value === null) {
				resolve([]);
			}
			if (value === 'error') {
				reject(new Error('ERROR'))
			}
			setTimeout(() => {
				resolve([{ id: '1', label: value + '-one' }, { id: '2', label: value + '-two' }, { id: '3', label: value + '-three' }]);
			}, 1000); // Simulate a 1-second delay
		});
	}

	// onOptionChange?: (value: T | null) => void // Callback when an option get selected
	const onOptionChange = (value: any | null) => console.log('onOptionChange', value)

	return (
		<Paper sx={{ height: "400px", width: "500px", padding: "20px" }} elevation={5}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Stack gap={2}>
					<ControlledTextField
						name='textField'
						control={control}
						label='Text Field Label'
						required={true}
					/>
					<ControlledComboBoxField
						name='combobox'
						control={control}
						label='Combobox Label'
						required={true}
						options={['1', '2', 'N/A']}
					/>
					<ControlledDateField
						name='date'
						control={control}
						label='Date Field Label'
						required={true}
					/>
					<ControlledExternalComboBoxField
						name='externalCombobox'
						control={control}
						label='Combobox Label'
						required={true}
						freeSolo={true}
						getData={mockApi}
						onOptionChange={onOptionChange}
					/>
				</Stack>
				<Divider sx={{ padding: '5px 0' }} />
				<Button type='submit'>Submit</Button>
			</form>
		</Paper>
	)
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: 'Components/Form',
	component: InputsTemplate,
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
} satisfies Meta<typeof InputsTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
	args: {},
};

