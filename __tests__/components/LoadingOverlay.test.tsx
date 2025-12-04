import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingOverlay from '../../components/LoadingOverlay';

describe('LoadingOverlay', () => {
  it('renders correctly when visible', () => {
    const { getByText } = render(<LoadingOverlay visible={true} />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('renders with custom message', () => {
    const { getByText } = render(
      <LoadingOverlay visible={true} message="Please wait..." />
    );
    expect(getByText('Please wait...')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const { queryByText } = render(<LoadingOverlay visible={false} />);
    // Modal with visible=false doesn't render children in test environment
    expect(queryByText('Loading...')).toBeFalsy();
  });
});
