import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Tooltip, Button, Input } from 'antd';

import Map from '../Map';

export default class LocSelect extends React.Component {
	static defaultProps = {
		maxWidth: 700,
		height: 300,
		showNum: false,
		closeable: true,
		setAddress: false,
	};
	static propTypes = {
		height: PropTypes.number,
		maxWidth: PropTypes.number,
		showNum: PropTypes.bool,
		closeable: PropTypes.bool,
		setAddress: PropTypes.bool,
	};

	constructor(props) {
		super(props);

		const value = this.props.value || {};
		this.state = {
			lat: value.lat,
			lng: value.lng,
			address: value.address,
		};

		if (this.props.closeable) {
			this.componets = [{
				pos: {
					loc: window.BMAP_ANCHOR_TOP_LEFT || 0,
				},
				component: <Input.Search onSearch={this.queryLoc} />,
			}, {
				pos: {
					loc: window.BMAP_ANCHOR_TOP_RIGHT || 1,
				},
				component: <Button icon="close" onClick={this.clean} />,
			}];
		}
		this.id = `${Math.random()}`.replace('.', '');
	}
	componentWillReceiveProps(nextProps) {
		if ('value' in nextProps) {
			this.setState(nextProps.value || { lat: null, lng: null, address: null }, () => {
				if (nextProps.value && nextProps.value.lat && this.map && !this.marker) {
					this.onMapInit(this.map);
				}
			});
			if (!nextProps.value) {
				this.destoryMarker();
			}
		}
	}
	onMapInit = (map) => {
		const { lat, lng } = this.state;
		const { center } = this.props;
		this.map = map;
		if (!lat) {
			if (center) {
				map.centerAndZoom(new BMap.Point(center.lng, center.lat), 12);
			} else {
        // map.centerAndZoom(new BMap.Point(104.072236, 30.663472), 6);
				map.centerAndZoom(new BMap.Point(map.centerPoint.lng, map.centerPoint.lat), 6);
			}
			map.addEventListener('click', this.mapClick);
		} else {
			map.centerAndZoom(new BMap.Point(lng, lat), 6);
			this.renderMarker({ lat, lng });
		}
	};
	onMarkerClick = ({ target }) => {
		const { lat, lng } = this.state;
		const infoWindow = new BMap.InfoWindow(`${lng},${lat}`);
		target.openInfoWindow(infoWindow);
	};
	queryLoc = (value) => {
		if (!this.map) {
			return;
		}
		const latlng = value.split(',');
		if (latlng.length === 2) {
			const lat = latlng[0];
			const lng = latlng[1];
			if (!isNaN(lat) && !isNaN(lng)) {
				const point = { lat: parseFloat(lat), lng: parseFloat(lng) };
				this.map.setCenter(new BMap.Point(point.lng, point.lat));
				this.renderMarker({ ...point });
				this.triggerLocChange({ point });
				return;
			}
		}
		const geoc = new BMap.Geocoder();
		geoc.getLocation(this.map.getCenter(), (rs) => {
			geoc.getPoint(value, (point) => {
				if (this.map && point) {
					this.map.centerAndZoom(point, 16);
				}
			}, rs.addressComponents.city);
		});
	};
	triggerLocChange = ({ point }) => {
		const { onChange } = this.props;
		if (onChange) {
			const { address } = this.state;
			onChange({ ...point, address });
		}
		this.map.closeInfoWindow();
	};
	triggerAddressChange = (event) => {
		const { onChange } = this.props;
		if (onChange) {
			const { lat, lng } = this.state;
			onChange({ lat, lng, address: event.target.value });
		}
	};
	triggerChange = ({ point, address }) => {
		const { onChange } = this.props;
		if (onChange) {
			onChange({ ...point, address });
		}
	};
	mapClick = ({ point }) => {
		if (!this.marker) {
			this.renderMarker(point);
			this.triggerLocChange({ point });
		}
	};
	clean = () => {
		this.triggerChange({ point: { }, address: null });
		this.destoryMarker();
		this.setState({ lat: null, lng: null, address: null });
	};
	destoryMarker = () => {
		if (!this.marker) {
			return;
		}
		this.marker.removeEventListener('dragend', this.triggerLocChange);
		this.marker.removeEventListener('click', this.onMarkerClick);
		this.map.removeOverlay(this.marker);
		this.marker = null;
	};
	renderMarker = ({ lat, lng }) => {
		if (!this.marker) {
			this.marker = new BMap.Marker(new BMap.Point(lng, lat));
			this.marker.enableDragging();
			this.marker.addEventListener('dragend', this.triggerLocChange);
			this.marker.addEventListener('click', this.onMarkerClick);
			this.map.addOverlay(this.marker);
		} else {
			this.marker.setPosition(new BMap.Point(lng, lat));
		}
	};
	renderTip = () => {
		const { lat } = this.state;
		if (!lat) {
			return '点击地图设置位置';
		} else {
			return '拖动图标设置位置';
		}
	};
	renderLocText = () => {
		const { showNum } = this.props;
		if (!showNum) {
			return null;
		}
		const { lat, lng } = this.state;
		const value = !lat ? '未设置' : `${lat},${lng}`;
		return <Input prefix={<Icon type="environment" />} value={value} />;
	};
	renderAddress = () => {
		const { setAddress } = this.props;
		if (!setAddress) {
			return null;
		}
		const { address } = this.state;
		return <Input addonBefore={<Icon type="" >设置地址</Icon>} style={{ width: '100%' }} value={address} onChange={this.triggerAddressChange} />;
	};
	render() {
		const { height, maxWidth } = this.props;
		return (
			<Tooltip title={this.renderTip()} placement="right">
				<div style={{ height, maxWidth }}>
					<Map onMapInit={this.onMapInit} id={this.id} componets={this.componets} />
					{this.renderLocText()}
					{this.renderAddress()}
				</div>
			</Tooltip>
		);
	}
}
