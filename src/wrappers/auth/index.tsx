import { Redirect, useAccess } from 'umi';

export default () => {
  const access = useAccess();
  if (access.isAdmin) {
    return <Redirect to="/dashboard" />;
  } else {
    return <Redirect to="/menu" />;
  }
};
