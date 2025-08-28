import React from 'react';
import { Breadcrumbs, Link } from '@mui/material';

export interface BreadcrumbItem {
	label: string
	onClick: () => void
}

interface BreadcrumbProps {
	items: BreadcrumbItem[]
	seperator?: string
}
export const Breadcrumb = ({ items, seperator = '>' }: BreadcrumbProps) => {
	return (
		<Breadcrumbs aria-label="breadcrumb" separator={seperator}>
			{items.map((item) => {
				return (
					<Link key={item.label + '-breadcrumb-item'} underline='hover' color='textPrimary' onClick={item.onClick}>
						{item.label}
					</Link>
				)
			})}
		</Breadcrumbs>
	)
}
