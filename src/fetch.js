import React, {Component} from 'react';

class Fetch extends Component {
	static STATES = {
		MOUNTED: 'MOUNTED',
		FETCHING: 'FETCHING',
		FETCHED: 'FETCHED',
		ERROR: 'ERRORED',
	};

	initialState = {
		status: Fetch.STATES.MOUNTED,
		response: {},
	};

	state = this.initialState;

	__isMounted = false;

	componentDidMount() {
		this.__isMounted = true;
	}

	componentWillUnmount() {
		this.__isMounted = false;
	}

	fetch = (params = {}) => {
		if (this.props.api) {
			this.setState({status: Fetch.STATES.FETCHING}, () => {
				this.props
					.api(params)
					.then(response => {
						if (this.__isMounted) {
							this.setState({
								response,
								status: Fetch.STATES.FETCHED,
							});
						}
					})
					.catch(err => {
						if (this.__isMounted) {
							this.setState({
								status: Fetch.STATES.ERROR,
							});
						}
					});
			});
		}
	};

	render() {
		if (!this.props.render) return null;

		return this.props.render({
			fetch: this.fetch,
			status: this.state.status,
			response: this.state.response,
		});
	}
}

export default Fetch;
