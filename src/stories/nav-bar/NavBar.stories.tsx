import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { VerticalNavBar } from './NavBar'
import { Box } from '@mui/material';

const NavBarTemplate = () => {
	return (
		<Box height='400px' sx={{ display: 'flex', width: { xs: '50px', md: '100px' } }}>
			<VerticalNavBar
				Items={[
					{ icon: 'home', label: 'Home', onClick: () => console.log('Home') },
					{ icon: 'search', label: 'Search', onClick: () => console.log('Search') },
					{ icon: 'assignment', label: 'Tasks', onClick: () => console.log('Tasks') },
				]}
			/>
		</Box>
	)
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: 'Components/NavBar',
	component: NavBarTemplate,
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
} satisfies Meta<typeof NavBarTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
	args: {},
};

