import React, {Component} from 'react';
import List from './list';

class Dropdown extends Component {
	static defaultProps = {
		items: [],
	};

	initialState = {
		selected: this.props.initial
			? this.props.initial
			: this.props.items[0] || {},
		isOpen: false,
	};

	state = this.initialState;

	select = item => this.setState({selected: item});
	toggle = () => this.setState({isOpen: !this.state.isOpen});

	render() {
		if (!this.props.render) return null;

		const filter = item => item.id !== this.state.selected.id;

		return (
			<List
				items={this.props.items}
				render={({items}) => {
					return this.props.render({
						select: this.select,
						toggle: this.toggle,
						selected: this.state.selected,
						options: this.props.items.filter(filter),
						isOpen: this.state.isOpen,
					});
				}}
			/>
		);
	}
}

export default Dropdown;
