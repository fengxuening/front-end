import service from "@/utils/api";
const BASE_PATH_SYS = "sys"

/**
 *获取行政单元Tree结构，包含Unitfullname和UnitId
 */
export const UnitsTreeGet = params => { return service.get(`${BASE_PATH_SYS}/getUnitFullName`, { params: params }).then(res => res.data) };

/**
 * 获取区块Tree结构
 */
export const QKTreeGet = params => { return service.get(`${BASE_PATH_SYS}/getQkCascader`, { params: params }).then(res => res.data) };

/**
 *获取[wellname,wellid,unitid]列表
 */
export const WellNamesGet = params => { return service.get(`${BASE_PATH_SYS}/getWellsInfor`, { params: params }).then(res => res.data) };

/**
 *获取登录记录列表
 */
export const LogRecordGet = params => { return service.get(`${BASE_PATH_SYS}/getLogRecord`, { params: params }).then(res => res.data) };



//权限管理

//条件查询用户并实现分页
export const GetUserList = params => {return service.get(`${BASE_PATH_SYS}/getUser`,{params:params}).then(res=>res.data)}
//删除用户
export const DeleteUserId = params => {return service.delete(`${BASE_PATH_SYS}/user/${params.userId}`,{params:params}).then(res=>res.data)}
//添加用户
export const AddUser = params => {return service.post(`${BASE_PATH_SYS}/user`,params).then(res=>res.data)}
//通过用户id查找用户
export const GetUserById = params => {return service.get(`${BASE_PATH_SYS}/user/${params.userId}`,{params:params}).then(res => res.data)}
//修改用户信息
export const UpdateUser = params => {return service.post(`${BASE_PATH_SYS}/user`,params).then(res=>res.data)}
//判断用户昵称是否存在
export const GetUserExistByName = params => {return service.get(`${BASE_PATH_SYS}/getUserExistByName`,{params:params}).then(res => res.data)}
//获取部门级联信息
export const GetFirstDepartments = params => {return service.get(`${BASE_PATH_SYS}/getFirstDepartments`).then(res=>res.data)}

//条件查询得到角色并实现分页
export const GetRoleList = params => {return service.get(`${BASE_PATH_SYS}/role`,{params:params}).then(res=>res.data)}
//得到全部角色
export const GetRoleAllList = params => {return service.get(`${BASE_PATH_SYS}/get_all_role`,{params:params}).then(res=>res.data)}
//删除角色
export const DeleteRoleId = params => {return service.delete(`${BASE_PATH_SYS}/role/${params.roleId}`,{params:params}).then(res=>res.data)}
//添加角色
export const AddRole = params => {return service.post(`${BASE_PATH_SYS}/role`,params).then(res=>res.data)}
//通过角色id查找角色
export const GetRoleById = params => {return service.get(`${BASE_PATH_SYS}/role/${params.roleId}`).then(res => res.data)}
//通过角色id查询角色权限 返回角色权限列表
export const GetRoleMenuList = params =>{ return service.get(`${BASE_PATH_SYS}/role-menu/${params.roleId}`).then(res => res.data)}
//
export const BatchInsertRoleMenu = params => {
    return service.post(`${BASE_PATH_SYS}/role-authorization`,params).then(
        res => res.data
    )
}
//判断角色名是否存在
export const  GetRoleExistByName = params => {return service.get(`${BASE_PATH_SYS}/getRoleExistByName`,{params:params}).then(res => res.data)}

//得到全部权限
export const GetMenuTree = params => {return service.get(`${BASE_PATH_SYS}/permission/getAllPermission`).then(res => res.data)}
//添加权限
export const AddMenu = params => {return service.post(`${BASE_PATH_SYS}/permission`,params).then(res => res.data)}
//通过id查找权限
export const GetMenuById = params => {return service.get(`${BASE_PATH_SYS}/permission/${params.menuId}`).then(res => res.data)}
//得到父级权限列表
export const GetFirstMenuList = params => {return service.get(`${BASE_PATH_SYS}/permission/getFirstPermissionList`).then(res => res.data)}
//删除权限
export const DeleteMenuById = params => {return service.delete(`${BASE_PATH_SYS}/permission/${params.menuId}`).then(res => res.data)}
