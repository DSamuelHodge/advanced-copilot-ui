import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropdown, DropdownItem, DropdownSeparator, DropdownLabel } from './Dropdown';

describe('Dropdown', () => {
  const triggerText = 'Open Dropdown';
  const children = (
    <>
      <DropdownLabel>Options</DropdownLabel>
      <DropdownItem>Option 1</DropdownItem>
      <DropdownItem>Option 2</DropdownItem>
      <DropdownSeparator />
      <DropdownItem>Option 3</DropdownItem>
    </>
  );

  it('renders trigger button', () => {
    render(
      <Dropdown trigger={<button>{triggerText}</button>} isOpen={false} onOpenChange={() => {}}>
        {children}
      </Dropdown>
    );
    expect(screen.getByText(triggerText)).toBeInTheDocument();
  });

  it('does not render children when closed', () => {
    render(
      <Dropdown trigger={<button>{triggerText}</button>} isOpen={false} onOpenChange={() => {}}>
        {children}
      </Dropdown>
    );
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });

  it('renders children when open', () => {
    render(
      <Dropdown trigger={<button>{triggerText}</button>} isOpen={true} onOpenChange={() => {}}>
        {children}
      </Dropdown>
    );
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('calls onOpenChange when clicking outside', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();
    
    render(
      <Dropdown trigger={<button>{triggerText}</button>} isOpen={true} onOpenChange={handleOpenChange}>
        {children}
      </Dropdown>
    );
    
    await user.click(document.body);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('renders DropdownLabel', () => {
    render(
      <Dropdown trigger={<button>{triggerText}</button>} isOpen={true} onOpenChange={() => {}}>
        <DropdownLabel>Test Label</DropdownLabel>
      </Dropdown>
    );
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders DropdownSeparator', () => {
    render(
      <Dropdown trigger={<button>{triggerText}</button>} isOpen={true} onOpenChange={() => {}}>
        <DropdownSeparator />
      </Dropdown>
    );
    const separator = document.querySelector('.bg-border');
    expect(separator).toBeInTheDocument();
  });
});

describe('DropdownItem', () => {
  it('renders children', () => {
    render(<DropdownItem>Click me</DropdownItem>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<DropdownItem onClick={handleClick}>Click me</DropdownItem>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<DropdownItem disabled>Disabled</DropdownItem>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
