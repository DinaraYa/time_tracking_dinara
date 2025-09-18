

import {accountServiceMongo} from "../../../src/services/AccountServiceImplMongo.ts";
import {checkRole} from "../../../src/utils/tools.ts";
import {EmployeeModel} from "../../../src/model/EmployeeMongooseModel.ts";

jest.mock("../../../src/model/EmployeeMongooseModel.ts");
jest.mock("../../../src/utils/tools.ts");

describe("AccountServiceImplMongo.setRole", () => {
   const service = accountServiceMongo;
   const employee = {
       _id: "123",
       firstName: "MockEmp",
       lastName: "MOCK",
       passHash: "23498",
       table_num: "tab_num",
       roles: 'newRole'
   }
    test("Failed test: Wrong role!", async () => {
        (checkRole as jest.Mock).mockImplementation(() => {
           throw new Error("Wrong role!")
        });
        await expect(service.setRole("UNKNOWN", "123")).rejects.toThrow("Wrong role!");
    });
   test("Failed test: Employee updating failed!", async () => {
       (checkRole as jest.Mock).mockReturnValue("newRole");
       (EmployeeModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
           exec: jest.fn().mockResolvedValue(null)
       });
       await expect(service.setRole("newRole", "1234")).rejects.toThrow("Employee updating failed!");
   });
   test("Passed test", async () => {
       (checkRole as jest.Mock).mockReturnValue("newRole");
       (EmployeeModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
           exec: jest.fn().mockResolvedValue(employee)
       });
       await expect(service.setRole("123", "newRole")).resolves.toEqual(employee);
       expect(EmployeeModel.findByIdAndUpdate).toHaveBeenCalledWith("123",
           {roles: "newRole"},
           {new: true});
   });
})