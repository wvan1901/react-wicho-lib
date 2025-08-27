import React, { type ReactNode } from 'react';
import { CardActionArea, Paper, Stack, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentIcon from '@mui/icons-material/Assignment';

type NavIcon = 'home' | 'search' | 'assignment'
interface NavBarProps {
	Items: NavBarItemProp[]
}

export const VerticalNavBar = ({ Items }: NavBarProps) => {
	return (
		<Paper elevation={2} sx={{ display: 'block', flexGrow: 1, padding: '10px 5px', borderRadius: '20px' }}>
			<Stack gap={2} sx={{ height: '100%' }}>
				{Items.map((item) => (<NavBarItem {...item} />))}
			</Stack>
		</Paper>
	)
}

interface NavBarItemProp {
	icon: NavIcon
	label: string
	onClick: () => void
}

const NavBarItem = ({ icon, label, onClick }: NavBarItemProp) => {
	return (
		<CardActionArea onClick={onClick} aria-label={'navbar-' + label}>
			<Stack direction='column' sx={{ alignItems: 'center' }}>
				{getIcon(icon)}
				<Typography variant='caption' align='center' sx={{ display: { xs: 'none', md: 'block' } }}>
					{label}
				</Typography>
			</Stack>
		</CardActionArea>
	)
}

const getIcon = (navIcon: NavIcon): ReactNode => {
	const sxProp = { display: 'block', color: 'grey' }
	switch (navIcon) {
		case 'home':
			return <HomeIcon sx={sxProp} fontSize='large' />
		case 'search':
			return <SearchIcon sx={sxProp} fontSize='large' />
		case 'assignment':
			return <AssignmentIcon sx={sxProp} fontSize='large' />
	}
}

