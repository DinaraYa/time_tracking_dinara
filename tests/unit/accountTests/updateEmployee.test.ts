
import {accountServiceMongo} from "../../../src/services/AccountServiceImplMongo.ts";
import {EmployeeModel} from "../../../src/model/EmployeeMongooseModel.ts";


jest.mock( "../../../src/model/EmployeeMongooseModel.ts");

describe("AccountServiceImplMongo.updateEmployee", () => {
    const service = accountServiceMongo;
    const employee = {
        _id: "444",
        firstName: "Another",
        lastName: "Employee",
    }
    const updateEmployee = {
        firstName: "MockEmp",
        lastName: "MOCK",
    };
    test("Test failed: employee not exists", async () => {
        (EmployeeModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
            exec:jest.fn().mockResolvedValue(null)
        });
        await expect(service.updateEmployee("1234", updateEmployee))
            .rejects.toThrow("Employee not found")
    });
    test("Passed test: password changed successfully", async () => {
        (EmployeeModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
            exec:jest.fn().mockResolvedValue(employee)
        });
        await expect(service.updateEmployee("444", updateEmployee))
            .resolves.toEqual(employee);
        expect(EmployeeModel.findByIdAndUpdate).toHaveBeenCalledWith("444", {
            firstName: "MockEmp",
            lastName: "MOCK"
        }, {new: true})
    });
})