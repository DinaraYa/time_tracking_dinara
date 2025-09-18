
import {accountServiceMongo} from "../../../src/services/AccountServiceImplMongo.ts";
import {EmployeeModel} from "../../../src/model/EmployeeMongooseModel.ts";
import {Employee} from "../../../src/model/Employee.ts";
import {checkFiredEmployee} from "../../../src/utils/tools.ts";
jest.mock("../../../src/model/EmployeeMongooseModel.ts");
jest.mock("../../../src/utils/tools.ts");

describe('AccountServiceMongoImpl.hireEmployee', () => {
    const service = accountServiceMongo;
    const mockEmployee = {
        _id: "123",
        firstName: "MockEmp",
        lastName: "MOCK",
        passHash: "23498",
        table_num: "tab_num",
        roles: 'crew'
    };
    //================1. Employee already exists======
    test("Failed test: Employee already exists", () => {
        (EmployeeModel.findById as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockEmployee)
        });
        expect(service.hireEmployee(mockEmployee as Employee))
            .rejects.toThrow(`Employee with id ${mockEmployee._id} already exists`);
        expect(EmployeeModel.findById).toHaveBeenCalledWith(mockEmployee._id)
    });

    test("Failed test: Employee was fired early", async () => {
        (EmployeeModel.findById as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(null)
        });
        (checkFiredEmployee as jest.Mock).mockRejectedValue(new Error('mock Error'));
        await expect(service.hireEmployee(mockEmployee as Employee)).rejects.toThrow('mock Error');
        expect(EmployeeModel.findById).toHaveBeenCalledWith(mockEmployee._id);
        expect(checkFiredEmployee).toHaveBeenCalledWith(mockEmployee._id);
    });

    test("Passed test", async () => {
        (EmployeeModel.findById as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(null)
        });
        (checkFiredEmployee as jest.Mock).mockResolvedValue(undefined);
        (EmployeeModel as unknown as jest.Mock).mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(mockEmployee),
        }));

        const result = await service.hireEmployee(mockEmployee as Employee);
        expect(EmployeeModel.findById).toHaveBeenCalledWith(mockEmployee._id);
        expect(checkFiredEmployee).toHaveBeenCalledWith(mockEmployee._id);
        expect(result).toEqual(mockEmployee);
    })
})