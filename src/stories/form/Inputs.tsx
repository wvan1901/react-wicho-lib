import React, { type ReactNode, useState, useEffect } from 'react';
import { Autocomplete, Stack, TextField, Tooltip, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { Controller, type Control } from 'react-hook-form';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface FieldLabelProps {
	label?: string
	required?: boolean
	children?: ReactNode;
}

const FieldLabel = ({ label, required = false, children }: FieldLabelProps) => {
	return (
		<Typography variant='caption' color='primary'>
			{label}
			{required && (
				<Typography variant='caption' color='error' fontWeight='bold'>
					{' *'}
				</Typography>
			)}
			{children}
		</Typography>
	)
}

interface ControlledFormFieldProps {
	name: string
	control: Control<any>
	label?: string
	required?: boolean
}

interface ControlledTextFieldProps extends ControlledFormFieldProps { }

export const ControlledTextField = ({
	name,
	control,
	label,
	required = false,
}: ControlledTextFieldProps) => {
	return (
		<Stack>
			<FieldLabel label={label} required={required} />
			<Controller
				render={
					({ field, fieldState }) => (
						<TextField
							{...field}
							required={required}
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
						/>
					)
				}
				control={control}
				name={name}
			/>
		</Stack>
	)
}

interface ControlledComboBoxFieldProps extends ControlledFormFieldProps {
	options: string[]
	freeSolo?: boolean // This decided if the input can be any text and doesn't have to be a option
}

export const ControlledComboBoxField = ({
	name,
	control,
	label,
	required = false,
	options,
	freeSolo = false
}: ControlledComboBoxFieldProps) => {
	return (
		<Stack>
			<FieldLabel label={label} required={required} />
			<Controller
				name={name}
				control={control}
				render={
					({ field: { onChange, value }, fieldState: { error } }) => (
						<Autocomplete
							options={options}
							freeSolo={freeSolo}
							onChange={(_, newValue) => onChange(newValue)}
							value={value || null}
							renderInput={(params) =>
								<TextField
									{...params}
									required={required}
									error={!!error}
									helperText={error ? error.message : null}
								/>
							}
						/>
					)
				}
			/>
		</Stack>
	)
}

interface ControlledDateFieldProps extends ControlledFormFieldProps { }

export const ControlledDateField = ({
	name,
	control,
	label,
	required = false,
}: ControlledDateFieldProps) => {
	// NOTE: We set the value as a ISO string or 'Invalid Date'
	return (
		<Stack>
			<FieldLabel label={label} required={required} />
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<Controller
					control={control}
					name={name}
					render={
						({ field, fieldState }) => (
							<DatePicker
								disablePast={false}
								disableFuture={false}
								disabled={false}
								{...field}
								value={convertIsoStringToDate(field.value || null)/* Convert String to Date Object */}
								onChange={(date) => {
									// Convert date Object to String
									const dateIso = convertDateToIsoString(date)
									field.onChange(dateIso)
								}}
								slotProps={{
									textField: {
										size: 'small',
										error: !!fieldState.error,
										helperText: fieldState.error?.message,
										required: required
									}
								}}
							/>
						)
					}
				/>
			</LocalizationProvider>
		</Stack>
	)
}

const convertIsoStringToDate = (isoValue: string): Date | null => {
	// Check if the input is actually a string and not empty or just whitespace.
	if (typeof isoValue !== 'string' || isoValue.trim() === '') {
		return null;
	}
	const date: Date = new Date(isoValue)
	if (!isDateValid(date)) {
		return null;
	}
	return date
}

const convertDateToIsoString = (date: Date | null): string => {
	if (!date) {
		return 'Invalid Date'
	}
	if (!isDateValid(date)) {
		return 'Invalid Date'
	}
	return date.toISOString()
}

const isDateValid = (date: Date | null): boolean => {
	if (!date) {
		return false
	}
	// isNaN(date.getTime()) returns true if the date is invalid.
	return !isNaN(date.getTime())
}

interface ControlledExternalComboBoxFieldProps<T extends optionObject> extends ControlledFormFieldProps {
	freeSolo?: boolean // This decided if the input can be any text and doesn't have to be a option
	debounceTime?: number // Number of miliseconds for debounce
	minimunInputLength?: number // Number of chacters needed to make getData call
	onOptionChange?: (value: T | null) => void // Callback when an option get selected
	getData: (value: string) => Promise<T[]>
}

export interface optionObject {
	label: string
}

export const ControlledExternalComboBoxField = <T extends optionObject>({
	name,
	control,
	label,
	required = false,
	freeSolo = false,
	debounceTime = 500,
	minimunInputLength = 3,
	onOptionChange = () => { },
	getData,

}: ControlledExternalComboBoxFieldProps<T>) => {
	const [options, setOptions] = useState<T[]>([])
	const [searchValue, setSearchValue] = useState<string | null>('')
	const [loading, setLoading] = useState(false)
	const [didPromiseErrorOccur, setDidPromiseErrorOccur] = useState(false)

	const debouncedSearch = useDebounce(searchValue, debounceTime)

	useEffect(() => {
		async function fetchOptions() {
			if (debouncedSearch === null) {
				setOptions([])
				return
			}
			setLoading(true)
			setOptions([])
			getData(debouncedSearch).then((data) => {
				setOptions(data)
				setDidPromiseErrorOccur(false)
			}).catch(() => {
				setDidPromiseErrorOccur(true)
			}).finally(() => {
				setLoading(false)
			})
		}
		// Search for data
		if (!!debouncedSearch && debouncedSearch.length >= minimunInputLength) {
			fetchOptions()
		}
	}, [debouncedSearch])

	return (
		<Stack>
			<FieldLabel label={label} required={required}>
				{didPromiseErrorOccur && (
					<Tooltip title='Error retrieving data'>
						<WarningIcon color='warning' fontSize='small' />
					</Tooltip>
				)}
			</FieldLabel >
			<Controller
				name={name}
				control={control}
				render={
					({ field: { onChange, value }, fieldState: { error } }) => (
						<Autocomplete
							options={options}
							filterOptions={(options, _) => options}
							onChange={(_, newValue) => {
								const label = newValue?.label || newValue
								// This only happens when we select a option, clear selection, create new option (freeSolo)
								setSearchValue(label)
								onChange(label)
								// Use funtion prop so parent can change other values based on selection
								onOptionChange(newValue)
							}}
							onInputChange={(_, newValue) => {
								// This happens when change the text input, aka typing, selecting value
								setSearchValue(newValue)
								if (freeSolo) {
									onChange(newValue)
								}
							}}
							value={value || null}
							freeSolo={freeSolo}
							loading={loading}
							renderInput={(params) =>
								<TextField
									{...params}
									required={required}
									error={!!error}
									helperText={error ? error.message : null}
								/>
							}
						/>
					)
				}
			/>
		</Stack>
	)
}

function useDebounce(value: string | null, delay: number): string | null {
	const [debouncedValue, setDebouncedValue] = useState(value)
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => {
			clearTimeout(handler)
		}
	}, [value, delay])

	return debouncedValue
}
