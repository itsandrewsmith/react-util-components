import 'dom-testing-library/extend-expect';
import {render, Simulate, wait} from 'react-testing-library';

import React from 'react';
import {v4} from 'uuid';

import List from '../list';

test('render', function() {
	const {container} = renderListComponent();
	expect(container).toBeInTheDOM();
});

test('taking a list as a prop', function() {
	const items = [{id: 1}, {id: 2}, {id: 3}];

	const {renderSpy} = renderListComponent({initial: items});

	expect(renderSpy).toHaveBeenCalledWith(
		expect.objectContaining({
			items: expect.arrayContaining(items),
		}),
	);
});

test('rendering the number of items from props', function() {
	const items = [{id: 1}, {id: 2}, {id: 3}];

	const {container} = renderListComponent({initial: items});

	const rows = container.querySelectorAll('.item');
	expect(rows.length).toEqual(items.length);
});

test('adding item to the list', function() {
	const items = [{id: 1}, {id: 2}, {id: 3}];

	const {container, getByText} = renderListComponent({initial: items});
	const button = getByText('Add');

	Simulate.click(button);

	const rows = container.querySelectorAll('.item');
	expect(rows.length).toEqual(items.length + 1);
});

test('removing item from the list', function() {
	const items = [{id: 1}, {id: 2}, {id: 3}];

	const {container, getByText} = renderListComponent({initial: items});
	const button = getByText('Remove');

	Simulate.click(button);

	const rows = container.querySelectorAll('.item');
	expect(rows.length).toEqual(items.length - 1);
});

test('updating item in the list', function() {
	const items = [{id: 1}, {id: 2}, {id: 3}];
	const {container, getByText} = renderListComponent({initial: items});

	const rows = container.querySelectorAll('.item');
	const firstInput = rows[0].querySelector('input');

	Simulate.change(firstInput, {
		target: {value: 'updated'},
	});

	expect(firstInput.value).toEqual('updated');

	Simulate.change(firstInput, {
		target: {value: 'update2'},
	});

	expect(firstInput.value).toEqual('update2');
});

test('updating one item does not impact the others', function() {
	const items = [{id: 1}, {id: 2}, {id: 3}];
	const {container, getByText} = renderListComponent({initial: items});

	const rows = container.querySelectorAll('.item');
	const firstInput = rows[0].querySelector('input');
	const secondInput = rows[1].querySelector('input');

	Simulate.change(firstInput, {
		target: {value: 'updated'},
	});

	Simulate.change(secondInput, {
		target: {value: 'update2'},
	});

	expect(firstInput.value).toEqual('updated');
	expect(secondInput.value).toEqual('update2');
});

function renderListComponent(props = {}) {
	const renderSpy = jest.fn(({items, add, remove, update}) => {
		return (
			<div id="list-container">
				{items.map(item => (
					<div className="item" key={item.id}>
						{item.id}
						<button onClick={() => remove(item.id)}>
							Remove
						</button>

						<input
							value={item.value || ''}
							onChange={({target: {value}}) =>
								update({...item, value})
							}
						/>
					</div>
				))}

				<button onClick={() => add({test: 'value'})}>Add</button>
			</div>
		);
	});

	const utils = render(<List {...props} render={renderSpy} />);

	return {
		...utils,
		renderSpy,
	};
}
