import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAddCityAction, useAddCityForm } from '@/weather/hooks';
import { useIsMobile } from '@/common/hooks/useIsMobile';
import {
  addCitySelectMock,
  createFormMock,
  handleSubmitMock,
  createUseAddCityFormResult,
} from '@/weather/testing/mocks';
import { setupAddCityFormRuntime } from '@/weather/testing/setups/addCityForm.runtime';
import { setupAddCityForm } from '@/weather/testing/setups/addCityForm.setup';

vi.mock('@/weather/hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/weather/hooks')>();

  return {
    ...actual,
    useAddCityAction: vi.fn(),
    useAddCityForm: vi.fn(),
  };
});
vi.mock('@/common/hooks/useIsMobile');

vi.mock('antd', async (importOriginal) => {
  const actual = await importOriginal<typeof import('antd')>();
  const { AddCityButtonMock, AddCityFormAntFormMock, AddCitySelectMock } =
    await import('@/weather/testing/mocks');

  return {
    ...actual,
    Form: AddCityFormAntFormMock,
    Select: AddCitySelectMock,
    Button: AddCityButtonMock,
  };
});

describe('AddCityForm', () => {
  beforeEach(() => {
    setupAddCityFormRuntime();
  });

  it('renders select and submit button', () => {
    const { getAddButton, getSelect } = setupAddCityForm();

    expect(getSelect()).toBeInTheDocument();
    expect(getAddButton()).toBeInTheDocument();
  });

  it('calls submit handler', async () => {
    const { user, getAddButton } = setupAddCityForm();

    await user.click(getAddButton());

    expect(handleSubmitMock).toHaveBeenCalledTimes(1);
  });

  it('disables button when city is adding', () => {
    vi.mocked(useAddCityAction).mockReturnValue({
      handleAddCity: vi.fn(),
      isAddingCity: true,
    });

    const { getAddButton } = setupAddCityForm();

    expect(getAddButton()).toBeDisabled();
  });

  it('passes getPopupContainer returning document.body', () => {
    setupAddCityForm();

    expect(addCitySelectMock).toHaveBeenCalled();

    const props = addCitySelectMock.mock.calls[0][0];

    expect(props.getPopupContainer).toBeDefined();
    expect(props.getPopupContainer?.()).toBe(document.body);
  });

  it('uses bottomLeft placement on mobile to keep suggestions visible', () => {
    vi.mocked(useIsMobile).mockReturnValue(true);

    setupAddCityForm();

    const props = addCitySelectMock.mock.calls[0][0];

    expect(props.placement).toBe('bottomLeft');
  });

  it('renders with form error', () => {
    vi.mocked(useAddCityForm).mockReturnValue(
      createUseAddCityFormResult({
        form: createFormMock(['error']),
      }),
    );

    setupAddCityForm();

    expect(screen.getByTestId('select')).toBeInTheDocument();
  });
});
