import 'dom-testing-library/extend-expect';
import {render, Simulate, wait} from 'react-testing-library';

import React from 'react';

import Fetch from '../fetch';

test('accepting api call prop', async function() {
	const api = jest.fn(() => Promise.resolve());
	const {fetch} = renderFetch({api});

	Simulate.click(fetch);
	expect(api).toHaveBeenCalledTimes(1);
});

test('response is the result of its api function called', async function() {
	const api = jest.fn(() => Promise.resolve({data: 'hi'}));
	const {renderSpy, fetch} = renderFetch({api});

	Simulate.click(fetch);
	await wait();

	expect(renderSpy).toHaveBeenLastCalledWith(
		expect.objectContaining({
			response: {data: 'hi'},
		}),
	);
});

test('api function called with specific params', async function() {
	const api = jest.fn(({test}) => {
		if (test === 'value') {
			return Promise.resolve({data: 'hi'});
		} else {
			return Promise.reject({});
		}
	});
	const {renderSpy, fetch} = renderFetch({api});

	Simulate.click(fetch);
	await wait();

	expect(renderSpy).toHaveBeenLastCalledWith(
		expect.objectContaining({
			response: {data: 'hi'},
		}),
	);
});

test('passing status to render', function() {
	const {renderSpy} = renderFetch();

	expectStatusForSpy(renderSpy, Fetch.STATES.MOUNTED);
});

test('passing successful fetch state', async function() {
	const api = jest.fn(() => Promise.resolve());
	const {renderSpy, fetch} = renderFetch({api});

	Simulate.click(fetch);
	await wait();

	expectStatusForSpy(renderSpy, Fetch.STATES.FETCHED);
});

test('passing failed fetch state', async function() {
	const api = jest.fn(() => Promise.reject());

	const {renderSpy, fetch} = renderFetch({api});

	Simulate.click(fetch);
	await wait();

	expectStatusForSpy(renderSpy, Fetch.STATES.ERROR);
});

test('passing fetching fetch state', async function() {
	const api = jest.fn(() => Promise.resolve());

	const {renderSpy, fetch} = renderFetch({api});

	expectStatusForSpy(renderSpy, Fetch.STATES.MOUNTED);

	Simulate.click(fetch);

	expectStatusForSpy(renderSpy, Fetch.STATES.FETCHING);

	await wait();

	expectStatusForSpy(renderSpy, Fetch.STATES.FETCHED);
});

test('unmounting while fetching -- no warning should appear', async function() {
	const api = jest.fn(() => Promise.resolve());

	const {renderSpy, unmount, fetch} = renderFetch({api});
	Simulate.click(fetch);

	unmount();
});

function renderFetch(props = {}) {
	const renderSpy = jest.fn(function({fetch}) {
		return (
			<div>
				<button onClick={() => fetch({test: 'value'})}>Fetch</button>
			</div>
		);
	});

	const utils = render(<Fetch {...props} render={renderSpy} />);

	return {
		...utils,
		renderSpy,
		fetch: utils.getByText('Fetch'),
	};
}

function expectStatusForSpy(renderSpy, status) {
	expect(renderSpy).toHaveBeenLastCalledWith(
		expect.objectContaining({
			status,
		}),
	);
}
