import React, { Component } from 'react';
import { Menu, Icon, Badge } from 'antd';
import { Link } from 'dva/router';
import pathToRegexp from 'path-to-regexp';
import { arrayToTree, queryArray } from 'utils';
import menu from '../menu';

export default class Leftmenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			menuValue: '1',
		};
		this.menuTree = arrayToTree(menu.filter(_ => _.pid !== '-1'), 'id', 'pid');
		this.levelMap = {};
		this.navOpenKeys = [];
		this.siderFold = false;
		this.darkTheme = true;
	}
	// 保持选中
	getAncestorKeys = (key) => {
		const map = {};
		const getParent = (index) => {
			const result = [String(this.levelMap[index])];
			if (this.levelMap[result[0]]) {
				result.unshift(getParent(result[0])[0]);
			}
			return result;
		};
		for (const index in this.levelMap) {
			if ({}.hasOwnProperty.call(this.levelMap, index)) {
				map[index] = getParent(index);
			}
		}
		return map[key] || [];
	};

	// 递归生成菜单
	getMenus = (menuTreeN, siderFoldN) => {
		return menuTreeN
			.filter((m) => {
				return !m.hide;
			})
			.map((item) => {
				if (item.children) {
					if (item.pid) {
						this.levelMap[item.id] = item.pid;
					}
					return (
						<Menu.SubMenu
							key={item.id}
							title={
								<span>
									{item.icon && <Icon type={item.icon} />}
									{(!siderFoldN || !this.menuTree.includes(item)) && item.name}
								</span>
							}
						>
							{this.getMenus(item.children, siderFoldN)}
						</Menu.SubMenu>
					);
				}
				return (
					<Menu.Item key={item.id}>
						<Link to={item.route}>
							{item.icon && <Icon type={item.icon} />}
							{(!siderFoldN || !this.menuTree.includes(item)) && item.name}
							{ this.siderFold ? null : <Badge count={item.badge ? item.badge : null} /> }
						</Link>
					</Menu.Item>
				);
			});
	};

	getCurrentMenu = () => {
		let currentMenu;
		for (const item of menu) {
			if (item.route && pathToRegexp(item.route).exec(location.pathname)) {
				currentMenu = item;
				break;
			}
		}
		return currentMenu;
	};
	getPathArray = (array, current, pid, id) => {
		const result = [String(current[id])];
		const getPath = (item) => {
			if (item && item[pid]) {
				result.unshift(String(item[pid]));
				getPath(queryArray(array, item[pid], id));
			}
		};
		getPath(current);
		return result;
	};
	render = () => {
		return (
			<Menu
				mode={this.siderFold ? 'vertical' : 'inline'}
				theme={this.darkTheme ? 'dark' : 'light'}
				style={{ textAlign: 'left' }}
				defaultSelectedKeys={this.getPathArray(menu, this.getCurrentMenu(), 'pid', 'id')}
			>
				{this.getMenus(this.menuTree, this.siderFold)}
			</Menu>
		);
	}
}
