"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = void 0;
var Permission;
(function (Permission) {
    Permission[Permission["USER"] = 0] = "USER";
    Permission[Permission["MANAGE_MESSAGES"] = 2] = "MANAGE_MESSAGES";
    Permission[Permission["MANAGE_ROLES"] = 3] = "MANAGE_ROLES";
    Permission[Permission["MANAGE_GUILD"] = 4] = "MANAGE_GUILD";
    Permission[Permission["SERVER_OWNER"] = 5] = "SERVER_OWNER";
    Permission[Permission["BOT_SUPPORT"] = 8] = "BOT_SUPPORT";
    Permission[Permission["BOT_ADMIN"] = 9] = "BOT_ADMIN";
    Permission[Permission["BOT_OWNER"] = 10] = "BOT_OWNER";
})(Permission = exports.Permission || (exports.Permission = {}));
