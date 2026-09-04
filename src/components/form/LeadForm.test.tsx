import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fr } from '../../content/fr';
import { ROUTES } from '../../lib/routes';
import { LeadForm } from './LeadForm';

vi.mock('../../lib/api', () => ({
  submitLead: vi.fn().mockResolvedValue(undefined),
}));

import { submitLead } from '../../lib/api';

function renderForm() {
  render(
    <MemoryRouter initialEntries={[ROUTES.visibilite('fr')]}>
      <Routes>
        <Route path={ROUTES.visibilite('fr')} element={<LeadForm content={fr.form} market="fr" />} />
        <Route path={ROUTES.merci('fr')} element={<div>Page merci</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.mocked(submitLead).mockClear();
});

describe('LeadForm', () => {
  it('shows required errors instead of advancing when step 1 is submitted empty', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: fr.form.step1.ctaLabel }));

    expect(await screen.findAllByText(fr.form.errors.required)).toHaveLength(3);
    expect(screen.getByText(fr.form.step1.title)).toBeInTheDocument();
  });

  it('advances to step 2 once step 1 is valid, then back to step 1', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(fr.form.step1.establishmentLabel, { exact: false }), 'Boulangerie du Coin');
    await user.type(screen.getByLabelText(fr.form.step1.cityLabel, { exact: false }), 'Lyon');
    await user.type(screen.getByLabelText(fr.form.step1.activityLabel, { exact: false }), 'Boulangerie');
    await user.click(screen.getByRole('button', { name: fr.form.step1.ctaLabel }));

    expect(await screen.findByText(fr.form.step2.title)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: fr.form.step2.backLabel }));
    expect(await screen.findByText(fr.form.step1.title)).toBeInTheDocument();
  });

  it('validates step 2 and submits a complete, valid lead', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(fr.form.step1.establishmentLabel, { exact: false }), 'Boulangerie du Coin');
    await user.type(screen.getByLabelText(fr.form.step1.cityLabel, { exact: false }), 'Lyon');
    await user.type(screen.getByLabelText(fr.form.step1.activityLabel, { exact: false }), 'Boulangerie');
    await user.click(screen.getByRole('button', { name: fr.form.step1.ctaLabel }));
    await screen.findByText(fr.form.step2.title);

    // Submitting empty step 2 shows errors and does not call the API.
    await user.click(screen.getByRole('button', { name: fr.form.step2.ctaLabel }));
    expect(await screen.findAllByText(fr.form.errors.required)).not.toHaveLength(0);
    expect(submitLead).not.toHaveBeenCalled();

    // "Prénom"/"Nom" need a start-anchored regex: exact:true fails on the required-field's
    // trailing "*" marker, and plain substring matching would make "Nom" match "Prénom" too.
    await user.type(screen.getByLabelText(new RegExp(`^${fr.form.step2.firstNameLabel}`)), 'Jean');
    await user.type(screen.getByLabelText(new RegExp(`^${fr.form.step2.lastNameLabel}`)), 'Dupont');
    await user.type(screen.getByLabelText(fr.form.step2.phoneLabel, { exact: false }), '0601020304');
    await user.type(screen.getByLabelText(fr.form.step2.emailLabel, { exact: false }), 'jean.dupont@example.com');
    await user.click(screen.getByRole('button', { name: fr.form.step2.ctaLabel }));

    await waitFor(() => expect(submitLead).toHaveBeenCalledTimes(1));
    expect(await screen.findByText('Page merci')).toBeInTheDocument();
  });

  it('renders the honeypot field hidden from real users, on step 2', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(fr.form.step1.establishmentLabel, { exact: false }), 'x');
    await user.type(screen.getByLabelText(fr.form.step1.cityLabel, { exact: false }), 'x');
    await user.type(screen.getByLabelText(fr.form.step1.activityLabel, { exact: false }), 'x');
    await user.click(screen.getByRole('button', { name: fr.form.step1.ctaLabel }));
    await screen.findByText(fr.form.step2.title);

    const honeypot = document.getElementById('company_website');
    expect(honeypot).toBeInTheDocument();
    expect(honeypot?.closest('[aria-hidden="true"]')).toBeTruthy();
  });

  it('shows the step indicator text for the current step', async () => {
    const user = userEvent.setup();
    renderForm();

    expect(screen.getByText(fr.form.stepIndicator(1))).toBeInTheDocument();

    await user.type(screen.getByLabelText(fr.form.step1.establishmentLabel, { exact: false }), 'x');
    await user.type(screen.getByLabelText(fr.form.step1.cityLabel, { exact: false }), 'x');
    await user.type(screen.getByLabelText(fr.form.step1.activityLabel, { exact: false }), 'x');
    await user.click(screen.getByRole('button', { name: fr.form.step1.ctaLabel }));

    expect(await screen.findByText(fr.form.stepIndicator(2))).toBeInTheDocument();
  });
});

// Sanity check that step1/step2 title text is scoped correctly (avoids false positives above).
describe('LeadForm step scoping', () => {
  it('does not render step 2 fields while on step 1', () => {
    renderForm();
    expect(within(screen.getByText(fr.form.title).closest('section')!).queryByLabelText(fr.form.step2.emailLabel)).toBeNull();
  });
});
