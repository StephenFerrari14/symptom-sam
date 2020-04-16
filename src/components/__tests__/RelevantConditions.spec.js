import React from 'react';
import ReactDOM from 'react-dom';
import RelevantConditions from '../RelevantConditions';
import { render } from '@testing-library/react';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RelevantConditions />, div);
});

it('renders relevant conditions', () => {
  const props = {
    showRelevantConditions: true, 
    relevantConditions: [{id: 1, name: 'condition-1'}], 
    handleRelevantConditionClick: () => {}, 
    additionalFrequency: {}
  }
  const { getByText, getAllByTestId } = render(<RelevantConditions {...props} />);
  expect(getByText('Sorry we couldn\'t diagnose your condition. Please check out these other conditions you might have to see more results.')).toBeInTheDocument();

  const relevantButtons = getAllByTestId('rel-condition')
  expect(relevantButtons).toHaveLength(1)
})