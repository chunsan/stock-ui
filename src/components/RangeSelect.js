import React from 'react';
import { Select } from 'antd';

export default class RangeSelect extends React.Component {
	static defaultProps = {
		range: null,
		onlyEffect: false,
	};
	constructor(props) {
		super(props);
		this.state = {
			province: null,
			city: null,
			county: null,
			project: null,
			farm: null,
			dsfarm: [],
			dsproject: [],
		};
		const { range, queryProject, queryFarm } = this.props;
		if (!range) {
			if (queryProject) {
				this.queryProject();
			}
			if (queryFarm) {
				this.queryFarm();
			}
		}
	}
	getCity = () => {
		const { province } = this.state;
		if (!province) {
			return [];
		}
		const { range = [], onlyEffect } = this.props;
		return range
			.filter((item) => { return (onlyEffect && item.p) || !onlyEffect; })
			.filter(item => item.name === province)
			.reduce((result, prov) => {
				return [...result, ...(prov.children || [])];
			}, [])
			.filter((item) => { return (onlyEffect && item.p) || !onlyEffect; });
	};
	getCounty = () => {
		const { city } = this.state;
		if (!city) {
			return [];
		}
		const { onlyEffect } = this.props;
		return this.getCity()
			.filter(item => item.name === city)
			.filter((item) => { return (onlyEffect && item.p) || !onlyEffect; })
			.reduce((result, item) => {
				return [...result, ...(item.children || [])];
			}, [])
			.filter((item) => { return (onlyEffect && item.p) || !onlyEffect; });
	};

	triggerChange = (value) => {
		const onChange = this.props.onChange;
		if (onChange) {
			onChange({ ...this.state, ...value });
		}
	};
	handleProvinceChange = (province) => {
		this.triggerChange({ province, city: null, county: null, project: null, farm: null });
		this.setState({
			province, city: null, county: null, project: null, farm: null, dsproject: [], dsfarm: [],
		});
	};

	handleCityChange = (city) => {
		this.triggerChange({ city, county: null, project: null, farm: null });
		this.setState({ city, county: null, project: null, farm: null, dsproject: [], dsfarm: [] });
	};

	handleCountyChange = (county) => {
		this.triggerChange({ county, project: null, farm: null });
		this.setState({ county, project: null, farm: null, dsproject: [], dsfarm: [] },
			this.queryProject);
	};
	handleProjectChange = (project) => {
		this.triggerChange({ project, farm: null });
		this.setState({ project, farm: null, dsfarm: [] }, this.queryFarm);
	};
	handleFarmChange = (farm) => {
		this.triggerChange({ farm });
		this.setState({ farm });
	};
	queryProject = () => {
		const { queryProject } = this.props;
		if (queryProject) {
			const { province, city, county } = this.state;
			queryProject(province, city, county).then(dsproject => this.setState({ dsproject }));
		}
	};
	queryFarm = () => {
		const { queryFarm } = this.props;
		if (queryFarm) {
			const { province, city, county, project } = this.state;
			queryFarm(province, city, county, project).then(dsfarm => this.setState({ dsfarm }));
		}
	};
	renderProv = () => {
		const { range, onlyEffect } = this.props;
		if (!range) {
			return null;
		}
		const { province } = this.state;
		return (
			<div style={{ float: 'left', marginRight: 20 }}>
				<span style={{ marginRight: 5 }}>省：</span>
				<Select value={province} style={{ width: 150 }} showSearch allowClear placeholder={'选择省份'} onChange={this.handleProvinceChange}>
					{
						range
							.filter((item) => { return (onlyEffect && item.p) || !onlyEffect; })
							.map(item => <Select.Option key={item.name}>{item.name}</Select.Option>)
					}
				</Select>
			</div>
		);
	};
	renderCity = () => {
		const { range } = this.props;
		if (!range) {
			return null;
		}
		const { city } = this.state;
		return (
			<div style={{ float: 'left', marginRight: 20 }}>
				<span style={{ marginRight: 5 }}>市：</span>
				<Select value={city} style={{ width: 150 }} showSearch allowClear placeholder={'选择城市'} onChange={this.handleCityChange}>
					{
						this.getCity().map(item => <Select.Option key={item.name}>{item.name}</Select.Option>)
					}
				</Select>
			</div>
		);
	};
	renderCounty = () => {
		const { range } = this.props;
		if (!range) {
			return null;
		}
		const { county } = this.state;
		return (
			<div style={{ float: 'left', marginRight: 20 }}>
				<span style={{ marginRight: 5 }}>县：</span>
				<Select value={county} style={{ width: 150 }} showSearch allowClear placeholder={'选择区县'} onChange={this.handleCountyChange}>
					{
						this.getCounty().map(item => <Select.Option key={item.name}>{item.name}</Select.Option>)
					}
				</Select>
			</div>
		);
	};
	renderProject = () => {
		const { queryProject } = this.props;
		if (!queryProject) {
			return null;
		}
		const { project, dsproject } = this.state;
		return (
			<div style={{ float: 'left', marginRight: 20 }}>
				<span style={{ marginRight: 5 }}>项目：</span>
				<Select value={project} style={{ width: 150 }} showSearch allowClear placeholder={'选择项目'} onChange={this.handleProjectChange}>
					{
						dsproject.map(item => <Select.Option key={item.id}>{item.name}</Select.Option>)
					}
				</Select>
			</div>
		);
	};
	renderFarm = () => {
		const { queryFarm } = this.props;
		if (!queryFarm) {
			return null;
		}
		const { farm, dsfarm } = this.state;
		return (
			<div style={{ float: 'left', marginRight: 20 }}>
				<span style={{ marginRight: 5 }}>地块：</span>
				<Select value={farm} style={{ width: 150 }} showSearch allowClear placeholder={'选择地块'} onChange={this.handleFarmChange}>
					{
						dsfarm.map(item => <Select.Option key={item.id}>{item.name}</Select.Option>)
					}
				</Select>
			</div>
		);
	};
	render() {
		const { styles } = this.props;
		return (
			<div style={{ paddingBottom: styles ? 15 : 0, overflow: styles ? 'hidden' : 'auto' }}>
				{ this.renderProv() }
				{ this.renderCity() }
				{ this.renderCounty() }
				{ this.renderProject() }
				{ this.renderFarm() }
			</div>
		);
	}
}
