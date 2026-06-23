import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmModal } from './ConfirmModal';

describe('ConfirmModal', () => {
  it('should render title and content when visible', () => {
    render(
      <ConfirmModal
        visible
        title="Delete"
        content="Are you sure?"
        onOk={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('should call onOk after confirm click', () => {
    const onOk = vi.fn();

    render(
      <ConfirmModal
        visible
        title="Delete"
        content="Are you sure?"
        onOk={onOk}
        onCancel={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByText('OK'));

    expect(onOk).toHaveBeenCalled();
  });

  it('should call onCancel after cancel click', () => {
    const onCancel = vi.fn();

    render(
      <ConfirmModal
        visible
        title="Delete"
        content="Are you sure?"
        onOk={vi.fn()}
        onCancel={onCancel}
      />,
    );

    fireEvent.click(screen.getByText('Cancel'));

    expect(onCancel).toHaveBeenCalled();
  });
});
