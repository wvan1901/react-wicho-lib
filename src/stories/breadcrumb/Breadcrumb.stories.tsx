import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Divider, Paper, Stack, Typography } from '@mui/material';
import { Breadcrumb, type BreadcrumbItem } from './Breadcrumb';

const BreadcrumbTemplate = () => {
	const breadcrumbItems: BreadcrumbItem[] = [{ label: 'One', onClick: () => handleBreadcrumbSelect('One') },
	{ label: 'Two', onClick: () => handleBreadcrumbSelect('Two') },
	{ label: 'Three', onClick: () => handleBreadcrumbSelect('Three') }]
	const [curItem, setCurItem] = useState(breadcrumbItems.length - 1)

	const handleBreadcrumbSelect = (label: string) => {
		let newLabelIndex = 1
		switch (label) {
			case 'One':
				newLabelIndex = 0
				break
			case 'Two':
				newLabelIndex = 1
				break
			case 'Three':
				newLabelIndex = 2
				break
		}
		setCurItem(newLabelIndex)
	}

	const handleBack = () => {
		if (curItem > 0) {
			setCurItem(prev => prev - 1)
		}
	}
	const handleNext = () => {
		if (curItem < breadcrumbItems.length - 1) {
			setCurItem(prev => prev + 1)
		}
	}
	return (
		<Paper sx={{ height: '400px', width: '200px', padding: '10px' }}>
			<Stack gap={2} >
				<Breadcrumb items={breadcrumbItems.slice(0, curItem + 1)} />
				<Divider />
				<Typography variant='h5'>
					Content {breadcrumbItems?.[curItem]?.label || 'Unknown'}
				</Typography>
				<Divider />
				<Stack direction='row'>
					<Button onClick={handleBack} disabled={curItem <= 0}>
						Back
					</Button>
					<Button onClick={handleNext} disabled={curItem >= breadcrumbItems.length - 1}>
						Next
					</Button>
				</Stack>
			</Stack>
		</Paper>
	)
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: 'Components/Breadcrumb',
	component: BreadcrumbTemplate,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered',
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {},
} satisfies Meta<typeof BreadcrumbTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
	args: {},
};

