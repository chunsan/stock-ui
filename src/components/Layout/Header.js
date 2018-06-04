import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon } from 'antd';
import styles from './Header.less';

const SubMenu = Menu.SubMenu;

const Header = ({
                  user,
                  logout,
                  updatepwdVisible,
                }) => {
	const handleClickMenu = (e) => {
		if (e.key === 'logout') {
			logout();
		}
		if (e.key === 'updatepwd') {
			updatepwdVisible(true);
		}
	};
	return (
		<div className={styles.header}>
			<div className={styles.rightWarpper}>
				<Menu mode="horizontal" onClick={handleClickMenu}>
					<SubMenu style={{ float: 'right' }} title={< span > <Icon type="user" /> {user.result ? user.result.name : null} </span>} >
						<Menu.Item key="updatepwd">
              修改密码
            </Menu.Item>
						<Menu.Item key="logout">
              退出
            </Menu.Item>
					</SubMenu>
				</Menu>
			</div>
		</div>
	);
};

Header.propTypes = {
	user: PropTypes.object,
	logout: PropTypes.func,
	updatepwdVisible: PropTypes.bool,
};

export default Header;
