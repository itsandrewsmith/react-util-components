import 'dom-testing-library/extend-expect';
import {render, Simulate} from 'react-testing-library';

import React from 'react';

import Update from '../update';

test('rendering', function() {
	const {container} = render(<Update />);
	expect(container).toBeInTheDOM();
});

test('it calls onUpdate with initial value given', function() {
	const updateFn = jest.fn();
	renderUpdate({value: 'test', onUpdate: updateFn});

	expect(updateFn).toHaveBeenCalled();
	expect(updateFn).toHaveBeenCalledTimes(1);
	expect(updateFn).toHaveBeenCalledWith('test');
});

test('it calls onUpdate when the value changes', function() {
	const updateFn = jest.fn();
	const {container} = renderUpdate({value: 'test', onUpdate: updateFn});

	render(<Update value="test2" onUpdate={updateFn} />, {container});

	expect(updateFn).toHaveBeenCalled();
	expect(updateFn).toHaveBeenCalledTimes(2);
	expect(updateFn).toHaveBeenCalledWith('test2');
});

test('it can render children', function()  {
    const children = <div data-testid='child'>testchild</div>
    const {getByTestId} = renderUpdate({children});

    const child = getByTestId('child');
    expect(child).toBeInTheDOM();
});

function renderUpdate(props = {}) {
	const utils = render(<Update {...props} />);
	return {
		...utils,
	};
}
