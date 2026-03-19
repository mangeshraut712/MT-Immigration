/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { render, screen } from '@testing-library/react';
import { SiteLogo } from '../SiteLogo';

describe('SiteLogo', () => {
    it('renders the logo image', () => {
        render(<SiteLogo />);

        const logoImage = screen.getByAltText('M&T Immigration logo mark');
        expect(logoImage).toBeInTheDocument();
    });

    it('renders the company name', () => {
        render(<SiteLogo />);

        expect(screen.getByText('M&T Immigration')).toBeInTheDocument();
    });

    it('applies correct CSS classes', () => {
        render(<SiteLogo />);

        const container = screen.getByText('M&T Immigration').parentElement;
        expect(container).toHaveClass('flex', 'items-center', 'gap-3');
    });

    it('can hide the name when showName is false', () => {
        render(<SiteLogo showName={false} />);

        expect(screen.queryByText('M&T Immigration')).not.toBeInTheDocument();
    });

    it('passes priority and loading props to Image', () => {
        render(<SiteLogo priority={true} loading="eager" />);

        const logoImage = screen.getByAltText('M&T Immigration logo mark');
        expect(logoImage).toBeInTheDocument();
    });
});