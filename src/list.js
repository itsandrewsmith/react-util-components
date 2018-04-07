import React, {Component} from 'react';
import {v4} from 'uuid';
class List extends Component {

	static defaultProps = {
		initial: [],
	}

	initialState = {
		ids: [],
		byId: {},
	};

	state = this.initialState;

	componentDidMount() {
		const items = this.normalizeItems(this.props.initial);
		this.setState({...items});
	}

	componentDidUpdate(prevProps) {
		if (prevProps.initial.length === 0 && this.props.initial.length > 0) {
			const items = this.normalizeItems(this.props.initial);
			this.setState({...items});
		}
	}

	getItems = () => this.state.ids.map(id => this.state.byId[id]);

	normalizeItems = items => {
		return items.reduce(function(state, item) {
			// ensure every item has an id property
			const _item = {
				id: v4(),
				...item,
			};

			return {
				ids: [...state.ids, _item.id],
				byId: {
					...state.byId,
					[_item.id]: _item,
				},
			};
		}, this.initialState);
	};

	add = (item = {}) => {
		// ensure every item has an id property
		const _item = {
			id: v4(),
			...item,
		};

		this.setState({
			ids: [...this.state.ids, _item.id],
			byId: {
				...this.state.byId,
				[_item.id]: _item,
			},
		});
	};

	remove = id => {
		// remove item from byId object by key (id)
		const {[id]: _, ...rest} = this.state.byId;

		this.setState({
			ids: this.state.ids.filter(_id => _id !== id),
			byId: rest,
		});
	};

	update = (item = {}) => {
		this.setState({
			byId: {
				...this.state.byId,
				[item.id]: {
					...this.state.byId[item.id],
					...item,
				},
			},
		});
	};

	render() {
		if (!this.props.render) return null;

		const items = this.getItems();

		return this.props.render({
			items,
			add: this.add,
			remove: this.remove,
			update: this.update,
		});
	}
}

export default List;
