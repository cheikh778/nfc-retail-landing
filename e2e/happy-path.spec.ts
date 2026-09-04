import { expect, test } from '@playwright/test';
import { completeLeadForm } from './helpers';

// Brief §44 scenario 1: arrivée landing → clic CTA → étape 1 → étape 2 → soumission → merci.
test('visitor completes the 2-step form and reaches the confirmation page', async ({ page }) => {
  await page.goto('/fr/visibilite');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Vos futurs clients vous trouvent-ils vraiment ?');

  let leadResponseStatus: number | null = null;
  page.on('response', (res) => {
    if (res.url().includes('/api/fr/visibilite/lead')) leadResponseStatus = res.status();
  });

  await completeLeadForm(page);

  await expect(page).toHaveURL(/\/fr\/visibilite\/merci$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Votre demande d’analyse a bien été reçue.');
  expect(leadResponseStatus).toBe(200);
});
