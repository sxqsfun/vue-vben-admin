/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
}

export interface RoleInfo {
  id?: string;
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  role: RoleInfo;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: RoleInfo[];
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
}

/**
 * @description: user query parameters
 */
export interface UserQueryParams {
  username: string;
  phone: string;
  createTime: Date;
  departmentId: number;
}

/**
 * @description: Get user information return value
 */
export interface GetUserListModel {
  roles: RoleInfo[];
  // 用户id
  id: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
}

/**
 * @description: user add parameters
 */
export interface UserAddParams {
  username: string;
  phone?: string;
  status?: string;
  departmentId?: number;
  roleIds: string;
  headerImg?: string;
}

/**
 * 用户与员工绑定参数
 */
export interface BindEmpParams {
  userId: string;
  employeeId: string;
}

/**
 * 员工信息-搜索参数
 */
export interface EmployeeSearchParams {
  name?: string;
  code?: string;
  phone?: string;
  idCard?: string;
}
