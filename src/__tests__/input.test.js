import 'dom-testing-library/extend-expect';
import {render, Simulate, wait} from 'react-testing-library';

import React from 'react';

import Input from '../input';

test('renders an input', function() {
	const {input} = renderInput();
	expect(input).toBeInTheDOM();
});

test('handling initial value', function() {
	const {input} = renderInput({value: 'test'});

	expect(input.value).toEqual('test');
});

test('changing text updates input value', function() {
	const {input} = renderInput();

	Simulate.change(input, {target: {value: 'updated'}});

	expect(input.value).toEqual('updated');
});

test('pressing enter triggers fetch', function() {
	const onEnterFn = jest.fn();
	const {input} = renderInput({onEnter: onEnterFn});

	Simulate.keyPress(input, {key: 'Enter'});

	expect(onEnterFn).toHaveBeenCalledTimes(1);
});

test('controlled props get the input event', function() {
	const onInputChange = jest.fn();
	const {input} = renderInput({onChange: onInputChange, value: ''});

	Simulate.change(input, {target: {value: 'updated'}});

	expect(onInputChange).toHaveBeenCalledTimes(1);
	expect(onInputChange).toHaveBeenCalledWith(
		expect.objectContaining({target: {value: 'updated'}}),
	);
});

test('input value is updated by controller', function() {
	const onChangeFn = jest.fn(function(event) {
		return 'override';
	});

	const {input} = renderControlledInput({
		value: 'test',
		onChange: onChangeFn,
	});

	expect(input.value).toEqual('test');

	Simulate.change(input, {target: {value: 'updated'}});

	expect(onChangeFn).toHaveBeenCalledTimes(1);
	expect(input.value).toEqual('override');
});

function renderInput(props = {}) {
	const utils = render(<Input {...props} />);

	return {
		...utils,
		input: utils.container.querySelector('input'),
	};
}

function renderControlledInput(props = {}) {
	class FakeContainer extends React.Component {
		state = {value: props.value || ''};

		handleChange = event => {
			props.onChange
				? this.setState({value: props.onChange(event)})
				: this.setState({value: event.target.value});
		};

		render() {
			return (
				<Input
					{...props}
					value={this.state.value}
					onChange={this.handleChange}
				/>
			);
		}
	}

	const utils = render(<FakeContainer />);

	return {
		...utils,
		input: utils.container.querySelector('input'),
	};
}
