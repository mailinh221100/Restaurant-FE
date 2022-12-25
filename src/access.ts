/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    canAdmin: currentUser && currentUser.roles && currentUser.roles.includes('admin'),
    isAdmin: currentUser && currentUser.roles && currentUser.roles.includes('admin'),
    isUser: !(currentUser && currentUser.roles && currentUser.roles.includes('admin')),
  };
}
