import { useState } from 'react';
import { Button, Flex, Typography } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useApolloClient } from '@apollo/client/react';
import { Shadow } from '../Shadow/Shadow';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';
import { useLogout } from '../../../auth/hooks/useLogout';
import styles from './Header.module.scss';

const { Title } = Typography;

export const Header = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const logout = useLogout();
  const client = useApolloClient();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    await client.clearStore();
    navigate('/login');
  };

  return (
    <>
      <Flex align="center" justify="space-between" className={styles.inner}>
        <Shadow type="text" direction="bottom">
          <Link to="/" className={styles.link}>
            <Title style={{ margin: 0 }} level={3}>
              Weather
            </Title>
          </Link>
        </Shadow>

        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={() => setIsLogoutModalOpen(true)}
        />
      </Flex>

      <ConfirmModal
        visible={isLogoutModalOpen}
        title="Logout"
        content="Are you sure you want to log out?"
        okText="Logout"
        cancelText="Cancel"
        okType="danger"
        onOk={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
};
