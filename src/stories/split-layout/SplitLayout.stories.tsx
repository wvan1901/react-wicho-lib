import type { Meta, StoryObj } from '@storybook/react-vite';

import { Paper } from '@mui/material';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ApiIcon from '@mui/icons-material/Api';

import { ToggleSplitLayout, type Panel } from './SplitLayout';


const ToggleSplitLayoutTemplate = () => {
	const panels: Panel[] = [
		{ value: 'one', Panel: <Paper sx={{ p: '10px', height: '100%' }} elevation={5}>One</Paper>, Icon: <AcUnitIcon /> },
		{ value: 'two', Panel: <Paper sx={{ p: '10px', height: '100%' }} elevation={5}>Two</Paper>, Icon: <AccountCircleIcon /> },
		{ value: 'three', Panel: <Paper sx={{ p: '10px', height: '100%' }} elevation={5}>Three</Paper>, Icon: <ApiIcon /> },
	]
	return (
		<Paper sx={{ height: "300px", width: "700px", padding: "20px" }} elevation={5}>
			<ToggleSplitLayout panels={panels} EmptyPanel={<p>No Panels selected!</p>} />
		</Paper>
	)
}
//
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: 'Components/ToggleSplitLayout',
	component: ToggleSplitLayoutTemplate,
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
} satisfies Meta<typeof ToggleSplitLayoutTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
	args: {},
};

