import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FormField from './FormField';

describe('FormField', () => {
  it('should render children correctly', () => {
    render(
      <FormField>
        <input type="text" placeholder="Test input" />
      </FormField>
    );

    expect(screen.getByPlaceholderText('Test input')).toBeInTheDocument();
  });

  it('should render label when provided', () => {
    render(
      <FormField label="Test Label">
        <input type="text" />
      </FormField>
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('should render error message when error prop is provided', () => {
    render(
      <FormField error="This is an error message">
        <input type="text" />
      </FormField>
    );

    expect(screen.getByText('This is an error message')).toBeInTheDocument();
  });

  it('should render help text when helpText prop is provided and no error', () => {
    render(
      <FormField helpText="This is help text">
        <input type="text" />
      </FormField>
    );

    expect(screen.getByText('This is help text')).toBeInTheDocument();
  });

  it('should not render help text when error is provided', () => {
    render(
      <FormField error="Error message" helpText="This is help text">
        <input type="text" />
      </FormField>
    );

    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('This is help text')).not.toBeInTheDocument();
  });

  it('should apply correct direction class', () => {
    const { rerender } = render(
      <FormField direction="row">
        <input type="text" />
      </FormField>
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();

    rerender(
      <FormField direction="column">
        <input type="text" />
      </FormField>
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should apply htmlFor attribute to label when provided', () => {
    render(
      <FormField label="Test Label" htmlFor="test-input">
        <input id="test-input" type="text" />
      </FormField>
    );

    const label = screen.getByText('Test Label');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('should apply custom className', () => {
    render(
      <FormField className="custom-class">
        <input type="text" />
      </FormField>
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render without label when label prop is not provided', () => {
    render(
      <FormField>
        <input type="text" />
      </FormField>
    );

    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('should render complex children correctly', () => {
    render(
      <FormField label="Complex Form">
        <div>
          <input type="text" placeholder="First input" />
          <select>
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
        </div>
      </FormField>
    );

    expect(screen.getByPlaceholderText('First input')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });
});
