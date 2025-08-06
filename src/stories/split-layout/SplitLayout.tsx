import React, { type ReactElement } from 'react';
import { Box, ToggleButtonGroup, Grid2, ToggleButton, Stack } from '@mui/material';

export interface Panel {
	value: string
	Icon?: ReactElement
	Panel: ReactElement
}

export interface ToggleSplitLayoutProps {
	panels: Panel[]
	initalPanelLabel?: string
	minimumPanels?: number
	maximumPanels?: number
	EmptyPanel?: ReactElement
}

export const ToggleSplitLayout = ({
	panels,
	initalPanelLabel,
	minimumPanels = 0,
	maximumPanels = panels.length,
	EmptyPanel
}: ToggleSplitLayoutProps) => {
	const [activePanels, setActivePanels] = React.useState<string[]>(initalPanelLabel ? [initalPanelLabel] : []);

	const handleFormat = (
		_: React.MouseEvent<HTMLElement>,
		newActivePanels: string[],
	) => {
		if (maximumPanels && newActivePanels.length > maximumPanels) return
		if (minimumPanels && newActivePanels.length < minimumPanels) return
		setActivePanels(newActivePanels);
	};

	const getActivePanels: Panel[] = panels.filter(p => activePanels.includes(p.value))

	return (
		<Stack sx={{ display: 'flex', height: "100%", direction: 'column' }} gap='10px'>
			<ToggleButtonGroup
				sx={{ justifyContent: 'center' }}
				value={activePanels}
				onChange={handleFormat}
				size='small'
			>
				{panels.map((p) => (
					<ToggleButton key={p.value + '-toggle-button'} value={p.value}>
						{!!p.Icon ? (p.Icon) : p.value}
					</ToggleButton>
				))}
			</ToggleButtonGroup>
			<Grid2 container spacing={2} sx={{ flexGrow: 1 }}>
				{activePanels.length === 0 && EmptyPanel}
				{getActivePanels.map((p) => (
					<Box key={p.value + '-box'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', flexGrow: 1 }}>
						{p.Panel}
					</Box>
				))}
			</Grid2>
		</Stack>
	)
};
