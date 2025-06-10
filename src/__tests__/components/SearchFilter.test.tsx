import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchFilter } from '../../components/dashboard/SearchFilter/SearchFilter';

jest.mock('../../components/dashboard/SearchFilter/SearchFilter.css', () => ({}));

describe('SearchFilter Component', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    value: '',
    onChange: mockOnChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders search input with placeholder text', () => {
    render(<SearchFilter {...defaultProps} />);
    const input = screen.getByPlaceholderText('Filter queries...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('search-input');
  });

  test('displays the initial value', () => {
    render(<SearchFilter {...defaultProps} value="initial value" />);
    const input = screen.getByDisplayValue('initial value');
    expect(input).toBeInTheDocument();
  });

  test('updates local value when user types', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SearchFilter {...defaultProps} />);
    const input = screen.getByPlaceholderText('Filter queries...');
    await user.type(input, 'test query');
    expect(input).toHaveValue('test query');
  });

  test('calls onChange after debounce delay (default 300ms)', async () => {
    render(<SearchFilter {...defaultProps} />);
    const input = screen.getByPlaceholderText('Filter queries...');
    fireEvent.change(input, { target: { value: 'debounced text' } });
    expect(mockOnChange).not.toHaveBeenCalled();
    jest.advanceTimersByTime(300);
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('debounced text');
    });
  });

  test('calls onChange after custom debounce delay', async () => {
    render(<SearchFilter {...defaultProps} debounceMs={500} />);
    const input = screen.getByPlaceholderText('Filter queries...');
    fireEvent.change(input, { target: { value: 'custom debounce' } });
    jest.advanceTimersByTime(300);
    expect(mockOnChange).not.toHaveBeenCalled();
    jest.advanceTimersByTime(200);
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('custom debounce');
    });
  });

  test('cancels previous timer when typing rapidly', async () => {
    render(<SearchFilter {...defaultProps} />);
    const input = screen.getByPlaceholderText('Filter queries...');
    fireEvent.change(input, { target: { value: 'first' } });
    jest.advanceTimersByTime(200);
    fireEvent.change(input, { target: { value: 'second' } });
    jest.advanceTimersByTime(300);
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });
  });

  test('updates local value when value prop changes', () => {
    const { rerender } = render(<SearchFilter {...defaultProps} value="initial" />);
    const input = screen.getByDisplayValue('initial');
    expect(input).toHaveValue('initial');
    rerender(<SearchFilter {...defaultProps} value="updated" />);
    expect(input).toHaveValue('updated');
  });

  test('does not call onChange if local value equals current value', async () => {
    render(<SearchFilter {...defaultProps} value="same value" />);
    const input = screen.getByDisplayValue('same value');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.change(input, { target: { value: 'same value' } });
    jest.advanceTimersByTime(300);
    await waitFor(() => {
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });
});