

import {accountServiceMongo} from "../../../src/services/AccountServiceImplMongo.ts";
import {EmployeeModel} from "../../../src/model/EmployeeMongooseModel.ts";
import bcrypt from "bcrypt";

jest.mock("../../../src/model/EmployeeMongooseModel.ts");
jest.mock("bcrypt");

describe("AccountServiceImplMongo.changePassword", () => {
    const service = accountServiceMongo;
    const mockEmployee = {
        _id: "123",
        firstName: "MockEmp",
        lastName: "MOCK",
        passHash: "23498",
        table_num: "tab_num",
        roles: 'crew',
        save: jest.fn()
    };
    test("Test failed: employee not exists", async () => {
        (EmployeeModel.findById as jest.Mock).mockResolvedValue(null);
        await expect(service.changePassword("1234", "password"))
            .rejects.toThrow("Account not found");
        expect(EmployeeModel.findById).toHaveBeenCalledWith("1234");
    });
    test("Passed test: password changed successfully", async () => {
        (EmployeeModel.findById as jest.Mock).mockResolvedValue(mockEmployee);
        (bcrypt.hashSync as jest.Mock).mockReturnValue("hashedPassword");
        (EmployeeModel as unknown as jest.Mock).mockImplementation(() => ({
            ...mockEmployee,
            save: jest.fn().mockResolvedValue(mockEmployee),
        }));
        await expect(service.changePassword("123", "password"))
            .resolves.toBeUndefined();
        expect(EmployeeModel.findById).toHaveBeenCalledWith("123");
        expect(bcrypt.hashSync).toHaveBeenCalledWith("password", 10);
        expect(mockEmployee.passHash).toBe("hashedPassword");
    });
})