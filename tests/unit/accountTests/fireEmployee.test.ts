import {accountServiceMongo} from "../../../src/services/AccountServiceImplMongo.ts";
import {EmployeeModel, FiredEmployeeModel} from "../../../src/model/EmployeeMongooseModel.ts";
import {convertEmployeeToFiredEmployee} from "../../../src/utils/tools.ts";
import {Employee} from "../../../src/model/Employee.ts";

jest.mock("../../../src/model/EmployeeMongooseModel.ts");
jest.mock("../../../src/utils/tools.ts");


describe("AccountServiceImplMongo.fireEmployee", () => {
    const service = accountServiceMongo;
    const mockEmployee = {
        _id: "123",
        firstName: "MockEmp",
        lastName: "MOCK",
        passHash: "23498",
        table_num: "tab_num",
        roles: 'crew'
    };
    const mockFiredEmployee = {
        _id: "123",
        firstName: "MockEmp",
        lastName: "MOCK",
        table_num: "tab_num",
        fireDate: "now"
    }
    test("Test failed: employee not exists", async () => {
        (EmployeeModel.findByIdAndDelete as jest.Mock).mockReturnValue({
           exec: jest.fn().mockResolvedValue(null)
        });
        await expect(service.fireEmployee("1234"))
            .rejects.toThrow(`Employee with  1234 not found`);
        expect(EmployeeModel.findByIdAndDelete).not.toHaveBeenCalledWith('123')
    });
    test("Test passed", async () => {
        (EmployeeModel.findByIdAndDelete as jest.Mock).mockReturnValue({
            exec: jest.fn(). mockResolvedValue(mockEmployee)
        });
        (convertEmployeeToFiredEmployee as jest.Mock).mockReturnValue(mockFiredEmployee);
        (FiredEmployeeModel as unknown as jest.Mock).mockImplementation(() => ({
                save: jest.fn().mockResolvedValue(mockFiredEmployee)
            }));
        await expect(service.fireEmployee('123')).resolves.toEqual(mockFiredEmployee);
        expect(EmployeeModel.findByIdAndDelete).toHaveBeenCalledWith('123');
        expect(convertEmployeeToFiredEmployee).toHaveBeenCalledWith(mockEmployee as Employee);
        expect(FiredEmployeeModel).toHaveBeenCalledWith(mockFiredEmployee);
    })
})
