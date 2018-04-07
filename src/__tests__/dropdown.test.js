import 'dom-testing-library/extend-expect';
import {render, Simulate} from 'react-testing-library';

import React from 'react';

import Dropdown from '../dropdown';

test('render and renderProp', function() {
	const {container} = render(<Dropdown />);

	expect(container).toBeInTheDOM();
});

test('component sets selected item as the first item initially', function() {
	const items = [{id: 1}, {id: 2}, {id: 3}];
	const {selected, renderSpy} = renderDropdown({items});

	expect(selected.textContent).toEqual('1');
	expect(renderSpy).toHaveBeenCalledWith(
		expect.objectContaining({
			selected: items[0],
		}),
	);
});

test('setting the remaining tracks as options', function() {
	const items = [{id: 1}, {id: 2}, {id: 3}];
	const {options, renderSpy} = renderDropdown({items});

	expect(options.children.length).toEqual(2);
	expect(renderSpy).toHaveBeenCalledWith(
		expect.objectContaining({
			options: expect.arrayContaining([{id: 2}, {id: 3}]),
		}),
	);
});

test('setting selected item', function() {
	const items = [{id: 1}, {id: 2}, {id: 3}];
	const {options, selected, renderSpy} = renderDropdown({items});

	const [first, second] = options.children;
	Simulate.click(first);

	expect(selected.textContent).toEqual('2');
	expect(renderSpy).toHaveBeenLastCalledWith(
		expect.objectContaining({
			selected: items[1],
		}),
	);
});

test('initializing with isOpen to be false', function() {
	const {renderSpy} = renderDropdown();

	expect(renderSpy).toHaveBeenCalledWith(
		expect.objectContaining({
			isOpen: false,
		}),
	);
});

test('able to toggle isOpen', function() {
	const {renderSpy, toggle} = renderDropdown();

	Simulate.click(toggle);

	expect(renderSpy).toHaveBeenLastCalledWith(
		expect.objectContaining({
			isOpen: true,
		}),
	);
});

test('able to set initial selected value from a prop', function() {
	const items = [{id: 1}, {id: 2}, {id: 3}];
	const {renderSpy} = renderDropdown({items, initial: items[1]});

	expect(renderSpy).toHaveBeenLastCalledWith(
		expect.objectContaining({
			selected: items[1],
		}),
	);
});

test('a null initial value restores default behaviour of first item', function() {
	const items = [{id: 1}, {id: 2}, {id: 3}];
	const {renderSpy} = renderDropdown({items, initial: null});

	expect(renderSpy).toHaveBeenLastCalledWith(
		expect.objectContaining({
			selected: items[0],
		}),
	);
});

function renderDropdown(props = {}) {
	const renderSpy = jest.fn(function({
		options,
		selected,
		select,
		isOpen,
		toggle,
	}) {
		return (
			<div>
				<div data-testid="selected">{selected.id}</div>
				<div data-testid="options">
					{options.map(option => (
						<div key={option.id} onClick={() => select(option)}>
							{option.id}
						</div>
					))}
				</div>

				<button data-testid="toggle" onClick={() => toggle()}>
					Toggle
				</button>
			</div>
		);
	});

	const utils = render(<Dropdown {...props} render={renderSpy} />);

	return {
		...utils,
		renderSpy,
		selected: utils.getByTestId('selected'),
		options: utils.getByTestId('options'),
		toggle: utils.getByTestId('toggle'),
	};
}
