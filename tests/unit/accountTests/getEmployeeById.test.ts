import {accountServiceMongo} from "../../../src/services/AccountServiceImplMongo.ts";
import {EmployeeModel} from "../../../src/model/EmployeeMongooseModel.ts";

jest.mock("../../../src/model/EmployeeMongooseModel.ts")


describe('AccountServiceImplMongo.getEmployeeById', () => {
    const service = accountServiceMongo;
    test("Failed test: employee not found", async () => {
        (EmployeeModel.findById as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(null)
        });
        await expect(service.getEmployeeById("UNKNOWN")).rejects.toThrow(`Employee with id UNKNOWN not found`)
    })
    test('Passed test: ', async () => {
        const mockEmployee = {
            _id: "123",
            firstName: "MockEmp",
            passHash: "23456",
            lastName: "MOCK",
            roles: 'crew',
            table_num: "tab_num"
        };
        (EmployeeModel.findById as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockEmployee)
        });
       await expect(service.getEmployeeById('123')).resolves.toEqual(mockEmployee);
       expect(EmployeeModel.findById).toHaveBeenCalledWith('123');
    })
})
