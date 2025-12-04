import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ErrorMessage from '../../components/ErrorMessage';

describe('ErrorMessage', () => {
  it('renders error message correctly', () => {
    const { getByText } = render(
      <ErrorMessage message="Something went wrong" />
    );
    expect(getByText(/Something went wrong/)).toBeTruthy();
  });

  it('shows retry button when onRetry is provided', () => {
    const mockRetry = jest.fn();
    const { getByText } = render(
      <ErrorMessage message="Error occurred" onRetry={mockRetry} />
    );
    expect(getByText('Try Again')).toBeTruthy();
  });

  it('calls onRetry when retry button is pressed', () => {
    const mockRetry = jest.fn();
    const { getByText } = render(
      <ErrorMessage message="Error occurred" onRetry={mockRetry} />
    );
    fireEvent.press(getByText('Try Again'));
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('does not show retry button when onRetry is not provided', () => {
    const { queryByText } = render(<ErrorMessage message="Error occurred" />);
    expect(queryByText('Try Again')).toBeFalsy();
  });
});
